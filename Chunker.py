import uuid
from pathlib import Path

from langchain.schema import Document

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    UnstructuredWordDocumentLoader
)

from langchain.text_splitter import (
    MarkdownHeaderTextSplitter,
    RecursiveCharacterTextSplitter
)

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# =========================================================
# CONFIG
# =========================================================

IDEAL_TOKEN_SIZE = 800
MAX_TOKEN_SIZE = 1200
CHUNK_OVERLAP = 150

SEMANTIC_SIMILARITY_THRESHOLD = 0.70

embedding_model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)

recursive_splitter = RecursiveCharacterTextSplitter(
    chunk_size=IDEAL_TOKEN_SIZE,
    chunk_overlap=CHUNK_OVERLAP
)


# =========================================================
# DOCUMENT LOADER
# =========================================================

def load_document(file_path):

    ext = Path(file_path).suffix.lower()

    if ext == ".pdf":
        loader = PyPDFLoader(file_path)

    elif ext == ".txt":
        loader = TextLoader(file_path, encoding="utf-8")

    elif ext == ".docx":
        loader = UnstructuredWordDocumentLoader(file_path)

    else:
        raise ValueError(f"Unsupported file type: {ext}")

    return loader.load()


# =========================================================
# TOKEN ESTIMATION
# =========================================================

def estimate_tokens(text):

    return int(len(text.split()) * 1.3)


# =========================================================
# STRUCTURE DETECTION
# =========================================================

def is_structured_document(text):

    lines = text.split("\n")

    heading_count = 0

    for line in lines:

        line = line.strip()

        # markdown headings
        if line.startswith("#"):
            heading_count += 1

        # ALL CAPS headings
        elif (
            line.isupper()
            and len(line.split()) <= 10
            and len(line) < 80
        ):
            heading_count += 1

        # numbered headings
        elif (
            line[:2].isdigit()
            and "." in line
        ):
            heading_count += 1

    return heading_count >= 3


# =========================================================
# HEADER SEGMENTATION
# =========================================================

def header_segmentation(text):

    headers_to_split_on = [
        ("#", "Header 1"),
        ("##", "Header 2"),
        ("###", "Header 3"),
    ]

    splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=headers_to_split_on
    )

    try:

        docs = splitter.split_text(text)

        if docs:
            return docs

    except:
        pass

    # fallback manual section split
    sections = []

    current_header = "ROOT"

    current_text = []

    lines = text.split("\n")

    for line in lines:

        stripped = line.strip()

        is_heading = (
            stripped.isupper()
            and len(stripped.split()) <= 10
        )

        if is_heading:

            if current_text:

                sections.append(

                    Document(
                        page_content="\n".join(current_text),

                        metadata={
                            "header": current_header
                        }
                    )
                )

            current_header = stripped

            current_text = []

        else:

            current_text.append(line)

    if current_text:

        sections.append(

            Document(
                page_content="\n".join(current_text),

                metadata={
                    "header": current_header
                }
            )
        )

    return sections


# =========================================================
# SEMANTIC CHUNKING
# =========================================================

def semantic_chunking(text):

    sentences = text.split(". ")

    if len(sentences) <= 1:
        return [text]

    embeddings = embedding_model.encode(sentences)

    semantic_chunks = []

    current_chunk = [sentences[0]]

    for i in range(1, len(sentences)):

        similarity = cosine_similarity(
            [embeddings[i - 1]],
            [embeddings[i]]
        )[0][0]

        if similarity < SEMANTIC_SIMILARITY_THRESHOLD:

            semantic_chunks.append(
                ". ".join(current_chunk)
            )

            current_chunk = [sentences[i]]

        else:

            current_chunk.append(sentences[i])

    if current_chunk:

        semantic_chunks.append(
            ". ".join(current_chunk)
        )

    return semantic_chunks


# =========================================================
# RECURSIVE TOKEN ENFORCEMENT
# =========================================================

def recursive_chunking(text):

    return recursive_splitter.split_text(text)


# =========================================================
# FINAL CHUNK CREATOR
# =========================================================

def create_final_chunk(
    text,
    source,
    page,
    chunk_level,
    header_name=None,
    header_index=None,
    semantic_index=None,
    parent_header_id=None,
    parent_semantic_id=None
):

    return Document(

        page_content=text,

        metadata={

            # =====================================
            # SOURCE
            # =====================================

            "source": source,

            "page": page,

            # =====================================
            # CHUNK TYPE
            # =====================================

            "chunk_level": chunk_level,

            # =====================================
            # HEADER INFO
            # =====================================

            "header_name": header_name,

            "header_index": header_index,

            "parent_header_id": parent_header_id,

            # =====================================
            # SEMANTIC INFO
            # =====================================

            "semantic_index": semantic_index,

            "parent_semantic_id": parent_semantic_id,

            # =====================================
            # CURRENT CHUNK ID
            # =====================================

            "chunk_id": str(uuid.uuid4())
        }
    )


# =========================================================
# MAIN PIPELINE
# =========================================================

def intelligent_chunking_pipeline(file_path):

    documents = load_document(file_path)

    final_chunks = []

    for page_number, doc in enumerate(documents):

        raw_text = doc.page_content

        structured = is_structured_document(raw_text)

        # =================================================
        # CASE 1 — STRUCTURED DOCUMENT
        # =================================================

        if structured:

            header_sections = header_segmentation(raw_text)

            for header_index, section in enumerate(header_sections):

                header_text = section.page_content

                header_name = (
                    section.metadata.get("header")
                    or
                    section.metadata.get("Header 1")
                    or
                    "UNKNOWN"
                )

                header_id = str(uuid.uuid4())

                # ---------------------------------------------
                # HEADER CHUNK SMALL ENOUGH
                # ---------------------------------------------

                if estimate_tokens(header_text) <= MAX_TOKEN_SIZE:

                    final_chunks.append(

                        create_final_chunk(
                            text=header_text,
                            source=Path(file_path).name,
                            page=page_number,
                            chunk_level="header",
                            header_name=header_name,
                            header_index=header_index,
                            parent_header_id=header_id
                        )
                    )

                    continue

                # ---------------------------------------------
                # SEMANTIC CHUNKING
                # ---------------------------------------------

                semantic_chunks = semantic_chunking(header_text)

                for semantic_index, semantic_chunk in enumerate(semantic_chunks):

                    semantic_id = str(uuid.uuid4())

                    # -----------------------------------------
                    # SEMANTIC CHUNK SMALL ENOUGH
                    # -----------------------------------------

                    if estimate_tokens(semantic_chunk) <= MAX_TOKEN_SIZE:

                        final_chunks.append(

                            create_final_chunk(
                                text=semantic_chunk,
                                source=Path(file_path).name,
                                page=page_number,
                                chunk_level="semantic",
                                header_name=header_name,
                                header_index=header_index,
                                semantic_index=semantic_index,
                                parent_header_id=header_id,
                                parent_semantic_id=semantic_id
                            )
                        )

                        continue

                    # -----------------------------------------
                    # RECURSIVE TOKEN ENFORCEMENT
                    # -----------------------------------------

                    recursive_chunks = recursive_chunking(
                        semantic_chunk
                    )

                    for recursive_chunk in recursive_chunks:

                        final_chunks.append(

                            create_final_chunk(
                                text=recursive_chunk,
                                source=Path(file_path).name,
                                page=page_number,
                                chunk_level="recursive",
                                header_name=header_name,
                                header_index=header_index,
                                semantic_index=semantic_index,
                                parent_header_id=header_id,
                                parent_semantic_id=semantic_id
                            )
                        )

        # =================================================
        # CASE 2 — UNSTRUCTURED DOCUMENT
        # =================================================

        else:

            semantic_chunks = semantic_chunking(raw_text)

            for semantic_index, semantic_chunk in enumerate(semantic_chunks):

                semantic_id = str(uuid.uuid4())

                # ---------------------------------------------
                # SEMANTIC CHUNK SMALL ENOUGH
                # ---------------------------------------------

                if estimate_tokens(semantic_chunk) <= MAX_TOKEN_SIZE:

                    final_chunks.append(

                        create_final_chunk(
                            text=semantic_chunk,
                            source=Path(file_path).name,
                            page=page_number,
                            chunk_level="semantic",
                            semantic_index=semantic_index,
                            parent_semantic_id=semantic_id
                        )
                    )

                    continue

                # ---------------------------------------------
                # RECURSIVE ENFORCEMENT
                # ---------------------------------------------

                recursive_chunks = recursive_chunking(
                    semantic_chunk
                )

                for recursive_chunk in recursive_chunks:

                    final_chunks.append(

                        create_final_chunk(
                            text=recursive_chunk,
                            source=Path(file_path).name,
                            page=page_number,
                            chunk_level="recursive",
                            semantic_index=semantic_index,
                            parent_semantic_id=semantic_id
                        )
                    )

    return final_chunks


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    chunks = intelligent_chunking_pipeline(
        "sample.pdf"
    )

    print(f"\nTOTAL CHUNKS: {len(chunks)}")

    print("\n================ SAMPLE CHUNK ================\n")

    print(chunks[0].page_content)

    print("\n================ METADATA ================\n")

    print(chunks[0].metadata)