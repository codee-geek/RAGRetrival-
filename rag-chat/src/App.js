// import { useState, useRef, useEffect } from "react";

// const SAMPLE_DOCS = [
//   { id: 1, name: "MLOps Handbook.pdf", size: "2.4 MB", pages: 142, color: "#e8d5b7" },
//   { id: 2, name: "FastAPI Documentation.pdf", size: "1.1 MB", pages: 68, color: "#c8d8e8" },
//   { id: 3, name: "Docker Deep Dive.pdf", size: "3.2 MB", pages: 210, color: "#d5e8d4" },
//   { id: 4, name: "Kubernetes Patterns.pdf", size: "4.7 MB", pages: 287, color: "#e8d5d5" },
// ];

// const SAMPLE_CONVO = [
//   {
//     role: "assistant",
//     text: "Hello! I've indexed your documents and I'm ready to answer questions. You can ask me anything about the content in your uploaded files.",
//     sources: [],
//   },
// ];

// const MOCK_RESPONSES = [
//   {
//     text: "Based on the **MLOps Handbook**, model deployment involves three critical phases: containerization, orchestration, and monitoring. The handbook emphasizes that a robust CI/CD pipeline is essential for maintaining model versioning and rollback capabilities.",
//     sources: [
//       { doc: "MLOps Handbook.pdf", page: 47, snippet: "Model deployment pipeline requires containerization via Docker, orchestration through Kubernetes, and continuous monitoring with tools like Prometheus." },
//       { doc: "Docker Deep Dive.pdf", page: 12, snippet: "Containers provide environment consistency across development, staging, and production, eliminating the classic 'works on my machine' problem." },
//     ],
//   },
//   {
//     text: "According to the **FastAPI Documentation**, you can integrate a scikit-learn model by loading it with `joblib` and exposing a `/predict` endpoint. FastAPI's automatic Swagger UI at `/docs` makes testing trivial during development.",
//     sources: [
//       { doc: "FastAPI Documentation.pdf", page: 23, snippet: "Loading ML models at startup using lifespan events ensures thread-safe access across concurrent requests." },
//     ],
//   },
//   {
//     text: "The **Kubernetes Patterns** guide describes the *Sidecar Pattern* as particularly useful for MLOps — attaching a logging or monitoring container alongside your model server pod without modifying the core application.",
//     sources: [
//       { doc: "Kubernetes Patterns.pdf", page: 89, snippet: "The Sidecar pattern decouples cross-cutting concerns like logging, monitoring, and configuration from the primary application container." },
//       { doc: "MLOps Handbook.pdf", page: 103, snippet: "Kubernetes-native deployments allow horizontal pod autoscaling based on inference request volume, ensuring cost-efficient scaling." },
//     ],
//   },
// ];

// let mockIdx = 0;

// function SourceChip({ source, onClick }) {
//   return (
//     <button
//       onClick={() => onClick(source)}
//       style={{
//         display: "inline-flex",
//         alignItems: "center",
//         gap: "6px",
//         padding: "4px 10px",
//         background: "rgba(255,255,255,0.06)",
//         border: "1px solid rgba(255,255,255,0.12)",
//         borderRadius: "20px",
//         color: "#a8b4c8",
//         fontSize: "12px",
//         fontFamily: "'DM Mono', monospace",
//         cursor: "pointer",
//         transition: "all 0.15s ease",
//         whiteSpace: "nowrap",
//       }}
//       onMouseEnter={e => {
//         e.currentTarget.style.background = "rgba(255,255,255,0.11)";
//         e.currentTarget.style.color = "#d4dce8";
//       }}
//       onMouseLeave={e => {
//         e.currentTarget.style.background = "rgba(255,255,255,0.06)";
//         e.currentTarget.style.color = "#a8b4c8";
//       }}
//     >
//       <span style={{ opacity: 0.6 }}>📄</span>
//       {source.doc} · p.{source.page}
//     </button>
//   );
// }

// function Message({ msg, onSourceClick }) {
//   const isUser = msg.role === "user";

//   const renderText = (text) => {
//     const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
//     return parts.map((part, i) => {
//       if (part.startsWith("**") && part.endsWith("**"))
//         return <strong key={i} style={{ color: "#e2e8f0", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
//       if (part.startsWith("`") && part.endsWith("`"))
//         return <code key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "4px", color: "#93c5fd" }}>{part.slice(1, -1)}</code>;
//       if (part.startsWith("*") && part.endsWith("*"))
//         return <em key={i} style={{ color: "#cbd5e1" }}>{part.slice(1, -1)}</em>;
//       return part;
//     });
//   };

//   return (
//     <div style={{
//       display: "flex",
//       gap: "12px",
//       padding: "20px 0",
//       borderBottom: "1px solid rgba(255,255,255,0.05)",
//       animation: "fadeSlideIn 0.3s ease forwards",
//     }}>
//       {/* Avatar */}
//       <div style={{
//         width: "32px",
//         height: "32px",
//         borderRadius: "50%",
//         flexShrink: 0,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: "14px",
//         background: isUser
//           ? "linear-gradient(135deg, #4f8ef7, #7c3aed)"
//           : "linear-gradient(135deg, #cf8b5c, #d97757)",
//         boxShadow: isUser
//           ? "0 0 12px rgba(79,142,247,0.3)"
//           : "0 0 12px rgba(207,139,92,0.3)",
//       }}>
//         {isUser ? "S" : "◆"}
//       </div>

//       {/* Content */}
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{
//           fontSize: "13px",
//           fontWeight: 600,
//           color: isUser ? "#93b4f7" : "#cf8b5c",
//           marginBottom: "8px",
//           fontFamily: "'DM Sans', sans-serif",
//           letterSpacing: "0.01em",
//         }}>
//           {isUser ? "You" : "RAG Assistant"}
//         </div>

//         <div style={{
//           fontSize: "15px",
//           lineHeight: "1.7",
//           color: "#c8d4e0",
//           fontFamily: "'DM Sans', sans-serif",
//         }}>
//           {renderText(msg.text)}
//         </div>

//         {msg.sources && msg.sources.length > 0 && (
//           <div style={{ marginTop: "14px" }}>
//             <div style={{
//               fontSize: "11px",
//               color: "#5a6a7a",
//               marginBottom: "8px",
//               fontFamily: "'DM Mono', monospace",
//               textTransform: "uppercase",
//               letterSpacing: "0.08em",
//             }}>
//               {msg.sources.length} source{msg.sources.length > 1 ? "s" : ""} retrieved
//             </div>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
//               {msg.sources.map((s, i) => (
//                 <SourceChip key={i} source={s} onClick={onSourceClick} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function SourceModal({ source, onClose }) {
//   if (!source) return null;
//   return (
//     <div
//       onClick={onClose}
//       style={{
//         position: "fixed", inset: 0,
//         background: "rgba(0,0,0,0.6)",
//         backdropFilter: "blur(4px)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         zIndex: 100,
//         animation: "fadeIn 0.2s ease",
//       }}
//     >
//       <div
//         onClick={e => e.stopPropagation()}
//         style={{
//           background: "#1a2230",
//           border: "1px solid rgba(255,255,255,0.12)",
//           borderRadius: "16px",
//           padding: "28px",
//           maxWidth: "520px",
//           width: "90%",
//           boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
//           animation: "slideUp 0.25s ease",
//         }}
//       >
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
//           <div>
//             <div style={{ fontSize: "13px", color: "#5a7a9a", fontFamily: "'DM Mono', monospace", marginBottom: "4px" }}>
//               📄 {source.doc}
//             </div>
//             <div style={{ fontSize: "12px", color: "#3a5a6a", fontFamily: "'DM Mono', monospace" }}>
//               Page {source.page}
//             </div>
//           </div>
//           <button onClick={onClose} style={{ background: "none", border: "none", color: "#5a6a7a", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>×</button>
//         </div>
//         <div style={{
//           background: "rgba(255,255,255,0.04)",
//           border: "1px solid rgba(255,255,255,0.08)",
//           borderLeft: "3px solid #cf8b5c",
//           borderRadius: "8px",
//           padding: "16px",
//           fontSize: "14px",
//           lineHeight: "1.7",
//           color: "#a0b4c4",
//           fontFamily: "'DM Sans', sans-serif",
//           fontStyle: "italic",
//         }}>
//           "{source.snippet}"
//         </div>
//         <div style={{ marginTop: "16px", fontSize: "12px", color: "#3a4a5a", fontFamily: "'DM Mono', monospace" }}>
//           Click outside to close
//         </div>
//       </div>
//     </div>
//   );
// }

// function DocCard({ doc, onRemove }) {
//   return (
//     <div style={{
//       display: "flex",
//       alignItems: "center",
//       gap: "10px",
//       padding: "10px 12px",
//       background: "rgba(255,255,255,0.04)",
//       border: "1px solid rgba(255,255,255,0.08)",
//       borderRadius: "10px",
//       transition: "border-color 0.2s",
//     }}
//       onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"}
//       onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
//     >
//       <div style={{
//         width: "32px", height: "38px",
//         background: doc.color,
//         borderRadius: "4px",
//         flexShrink: 0,
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontSize: "10px", fontWeight: 700, color: "#3a3a3a", fontFamily: "'DM Mono', monospace",
//       }}>
//         PDF
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ fontSize: "13px", color: "#c8d4e0", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//           {doc.name}
//         </div>
//         <div style={{ fontSize: "11px", color: "#4a6a7a", fontFamily: "'DM Mono', monospace", marginTop: "2px" }}>
//           {doc.pages} pages · {doc.size}
//         </div>
//       </div>
//       <button
//         onClick={() => onRemove(doc.id)}
//         style={{ background: "none", border: "none", color: "#3a5a6a", fontSize: "16px", cursor: "pointer", flexShrink: 0, lineHeight: 1, padding: "2px" }}
//         onMouseEnter={e => e.currentTarget.style.color = "#e87070"}
//         onMouseLeave={e => e.currentTarget.style.color = "#3a5a6a"}
//       >
//         ×
//       </button>
//     </div>
//   );
// }

// export default function RAGChat() {
//   const [messages, setMessages] = useState(SAMPLE_CONVO);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [docs, setDocs] = useState(SAMPLE_DOCS);
//   const [activeSource, setActiveSource] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [dragOver, setDragOver] = useState(false);
//   const bottomRef = useRef(null);
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   const handleSend = () => {
//     if (!input.trim() || loading) return;
//     const userMsg = { role: "user", text: input.trim(), sources: [] };
//     setMessages(prev => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);

//     setTimeout(() => {
//       const resp = MOCK_RESPONSES[mockIdx % MOCK_RESPONSES.length];
//       mockIdx++;
//       setMessages(prev => [...prev, { role: "assistant", ...resp }]);
//       setLoading(false);
//     }, 1400);
//   };

//   const handleKey = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const removeDoc = (id) => setDocs(prev => prev.filter(d => d.id !== id));

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     const files = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
//     const newDocs = files.map((f, i) => ({
//       id: Date.now() + i,
//       name: f.name,
//       size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
//       pages: Math.floor(Math.random() * 200 + 20),
//       color: ["#e8d5b7", "#c8d8e8", "#d5e8d4", "#e8d5d5", "#e8e0d5"][i % 5],
//     }));
//     setDocs(prev => [...prev, ...newDocs]);
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         body { background: #0d1117; }

//         @keyframes fadeSlideIn {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; } to { opacity: 1; }
//         }
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(16px) scale(0.97); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: 0.4; transform: scale(0.8); }
//           50% { opacity: 1; transform: scale(1); }
//         }
//         @keyframes spin {
//           from { transform: rotate(0deg); } to { transform: rotate(360deg); }
//         }

//         textarea:focus { outline: none; }
//         textarea { resize: none; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
//       `}</style>

//       <div style={{
//         display: "flex",
//         height: "100vh",
//         background: "#0d1117",
//         fontFamily: "'DM Sans', sans-serif",
//         color: "#c8d4e0",
//         overflow: "hidden",
//       }}>

//         {/* ── LEFT SIDEBAR ── */}
//         <div style={{
//           width: sidebarOpen ? "280px" : "0px",
//           minWidth: sidebarOpen ? "280px" : "0px",
//           overflow: "hidden",
//           transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
//           background: "#111820",
//           borderRight: "1px solid rgba(255,255,255,0.06)",
//           display: "flex",
//           flexDirection: "column",
//         }}>
//           <div style={{ padding: "20px", flex: 1, overflowY: "auto", minWidth: "280px" }}>
//             {/* Brand */}
//             <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
//               <div style={{
//                 width: "30px", height: "30px",
//                 background: "linear-gradient(135deg, #cf8b5c, #d97757)",
//                 borderRadius: "8px",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontSize: "14px",
//                 boxShadow: "0 4px 12px rgba(207,139,92,0.3)",
//               }}>◆</div>
//               <div>
//                 <div style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>DocMind</div>
//                 <div style={{ fontSize: "11px", color: "#3a5a6a", fontFamily: "'DM Mono', monospace" }}>RAG · v0.1</div>
//               </div>
//             </div>

//             {/* Upload zone */}
//             <div
//               onDragOver={e => { e.preventDefault(); setDragOver(true); }}
//               onDragLeave={() => setDragOver(false)}
//               onDrop={handleDrop}
//               style={{
//                 border: `1.5px dashed ${dragOver ? "#cf8b5c" : "rgba(255,255,255,0.1)"}`,
//                 borderRadius: "12px",
//                 padding: "20px",
//                 textAlign: "center",
//                 background: dragOver ? "rgba(207,139,92,0.06)" : "rgba(255,255,255,0.02)",
//                 cursor: "pointer",
//                 transition: "all 0.2s ease",
//                 marginBottom: "20px",
//               }}
//             >
//               <div style={{ fontSize: "22px", marginBottom: "8px" }}>📂</div>
//               <div style={{ fontSize: "12px", color: "#5a7a8a", lineHeight: 1.5 }}>
//                 Drop PDFs here<br />
//                 <span style={{ color: "#3a5a6a" }}>or click to upload</span>
//               </div>
//             </div>

//             {/* Doc list */}
//             <div style={{ fontSize: "11px", color: "#3a5a6a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
//               {docs.length} document{docs.length !== 1 ? "s" : ""} indexed
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//               {docs.map(doc => (
//                 <DocCard key={doc.id} doc={doc} onRemove={removeDoc} />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ── MAIN CHAT ── */}
//         <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

//           {/* Top bar */}
//           <div style={{
//             display: "flex",
//             alignItems: "center",
//             padding: "14px 24px",
//             borderBottom: "1px solid rgba(255,255,255,0.06)",
//             background: "#0d1117",
//             gap: "14px",
//           }}>
//             <button
//               onClick={() => setSidebarOpen(p => !p)}
//               style={{
//                 background: "rgba(255,255,255,0.05)",
//                 border: "1px solid rgba(255,255,255,0.08)",
//                 borderRadius: "8px",
//                 padding: "7px 10px",
//                 color: "#6a8a9a",
//                 cursor: "pointer",
//                 fontSize: "14px",
//                 transition: "all 0.15s",
//               }}
//               onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
//               onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
//             >
//               {sidebarOpen ? "◀" : "▶"}
//             </button>

//             <div style={{ flex: 1 }}>
//               <div style={{ fontSize: "14px", fontWeight: 500, color: "#d4dce8" }}>Document Q&A</div>
//               <div style={{ fontSize: "12px", color: "#3a5a6a", fontFamily: "'DM Mono', monospace" }}>
//                 {docs.length} docs · {docs.reduce((a, d) => a + d.pages, 0)} pages indexed
//               </div>
//             </div>

//             <div style={{
//               display: "flex", alignItems: "center", gap: "6px",
//               padding: "6px 12px",
//               background: "rgba(72,199,142,0.08)",
//               border: "1px solid rgba(72,199,142,0.2)",
//               borderRadius: "20px",
//               fontSize: "11px",
//               color: "#48c78e",
//               fontFamily: "'DM Mono', monospace",
//             }}>
//               <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#48c78e", display: "inline-block", animation: "pulse 2s infinite" }} />
//               Ready
//             </div>
//           </div>

//           {/* Messages */}
//           <div style={{
//             flex: 1,
//             overflowY: "auto",
//             padding: "0 24px",
//             maxWidth: "820px",
//             width: "100%",
//             margin: "0 auto",
//           }}>
//             {messages.map((msg, i) => (
//               <Message key={i} msg={msg} onSourceClick={setActiveSource} />
//             ))}

//             {loading && (
//               <div style={{ display: "flex", gap: "12px", padding: "20px 0", animation: "fadeSlideIn 0.3s ease" }}>
//                 <div style={{
//                   width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
//                   background: "linear-gradient(135deg, #cf8b5c, #d97757)",
//                   display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
//                 }}>◆</div>
//                 <div style={{ paddingTop: "8px" }}>
//                   <div style={{ fontSize: "13px", fontWeight: 600, color: "#cf8b5c", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
//                     RAG Assistant
//                   </div>
//                   <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
//                     {[0, 1, 2].map(i => (
//                       <div key={i} style={{
//                         width: "7px", height: "7px",
//                         borderRadius: "50%",
//                         background: "#cf8b5c",
//                         animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
//                       }} />
//                     ))}
//                     <span style={{ fontSize: "12px", color: "#4a6a7a", marginLeft: "8px", fontFamily: "'DM Mono', monospace" }}>
//                       Retrieving relevant chunks…
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={bottomRef} />
//           </div>

//           {/* Input area */}
//           <div style={{
//             padding: "16px 24px 24px",
//             maxWidth: "820px",
//             width: "100%",
//             margin: "0 auto",
//           }}>
//             <div style={{
//               background: "#151d27",
//               border: "1px solid rgba(255,255,255,0.1)",
//               borderRadius: "16px",
//               padding: "4px 4px 4px 16px",
//               display: "flex",
//               alignItems: "flex-end",
//               gap: "8px",
//               transition: "border-color 0.2s",
//               boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
//             }}
//               onFocusCapture={e => e.currentTarget.style.borderColor = "rgba(207,139,92,0.4)"}
//               onBlurCapture={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
//             >
//               <textarea
//                 ref={textareaRef}
//                 value={input}
//                 onChange={e => setInput(e.target.value)}
//                 onKeyDown={handleKey}
//                 placeholder="Ask anything about your documents…"
//                 rows={1}
//                 style={{
//                   flex: 1,
//                   background: "transparent",
//                   border: "none",
//                   color: "#d4dce8",
//                   fontSize: "14.5px",
//                   fontFamily: "'DM Sans', sans-serif",
//                   lineHeight: "1.6",
//                   padding: "12px 0",
//                   maxHeight: "140px",
//                   overflowY: "auto",
//                 }}
//                 onInput={e => {
//                   e.target.style.height = "auto";
//                   e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
//                 }}
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!input.trim() || loading}
//                 style={{
//                   width: "38px", height: "38px",
//                   borderRadius: "12px",
//                   border: "none",
//                   background: input.trim() && !loading
//                     ? "linear-gradient(135deg, #cf8b5c, #d97757)"
//                     : "rgba(255,255,255,0.06)",
//                   color: input.trim() && !loading ? "#fff" : "#3a5a6a",
//                   cursor: input.trim() && !loading ? "pointer" : "default",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontSize: "16px",
//                   transition: "all 0.2s ease",
//                   flexShrink: 0,
//                   boxShadow: input.trim() && !loading ? "0 4px 12px rgba(207,139,92,0.3)" : "none",
//                 }}
//               >
//                 {loading
//                   ? <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#cf8b5c", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "block" }} />
//                   : "↑"}
//               </button>
//             </div>

//             <div style={{
//               textAlign: "center",
//               fontSize: "11px",
//               color: "#2a3a4a",
//               marginTop: "10px",
//               fontFamily: "'DM Mono', monospace",
//             }}>
//               Answers grounded in your documents · Press Enter to send
//             </div>
//           </div>
//         </div>
//       </div>

//       <SourceModal source={activeSource} onClose={() => setActiveSource(null)} />
//     </>
//   );
// }

import { useState, useRef, useEffect } from "react";

const SAMPLE_DOCS = [
  { id: 1, name: "MLOps Handbook.pdf", size: "2.4 MB", pages: 142, color: "#e8d5b7" },
  { id: 2, name: "FastAPI Documentation.pdf", size: "1.1 MB", pages: 68, color: "#c8d8e8" },
  { id: 3, name: "Docker Deep Dive.pdf", size: "3.2 MB", pages: 210, color: "#d5e8d4" },
  { id: 4, name: "Kubernetes Patterns.pdf", size: "4.7 MB", pages: 287, color: "#e8d5d5" },
];

const SAMPLE_CONVO = [
  {
    role: "assistant",
    text: "Hello! I've indexed your documents and I'm ready to answer questions. You can ask me anything about the content in your uploaded files.",
    sources: [],
  },
];

const MOCK_RESPONSES = [
  {
    text: "Based on the **MLOps Handbook**, model deployment involves three critical phases: containerization, orchestration, and monitoring. The handbook emphasizes that a robust CI/CD pipeline is essential for maintaining model versioning and rollback capabilities.",
    sources: [
      { doc: "MLOps Handbook.pdf", page: 47, snippet: "Model deployment pipeline requires containerization via Docker, orchestration through Kubernetes, and continuous monitoring with tools like Prometheus." },
      { doc: "Docker Deep Dive.pdf", page: 12, snippet: "Containers provide environment consistency across development, staging, and production, eliminating the classic 'works on my machine' problem." },
    ],
  },
  {
    text: "According to the **FastAPI Documentation**, you can integrate a scikit-learn model by loading it with `joblib` and exposing a `/predict` endpoint. FastAPI's automatic Swagger UI at `/docs` makes testing trivial during development.",
    sources: [
      { doc: "FastAPI Documentation.pdf", page: 23, snippet: "Loading ML models at startup using lifespan events ensures thread-safe access across concurrent requests." },
    ],
  },
  {
    text: "The **Kubernetes Patterns** guide describes the *Sidecar Pattern* as particularly useful for MLOps — attaching a logging or monitoring container alongside your model server pod without modifying the core application.",
    sources: [
      { doc: "Kubernetes Patterns.pdf", page: 89, snippet: "The Sidecar pattern decouples cross-cutting concerns like logging, monitoring, and configuration from the primary application container." },
      { doc: "MLOps Handbook.pdf", page: 103, snippet: "Kubernetes-native deployments allow horizontal pod autoscaling based on inference request volume, ensuring cost-efficient scaling." },
    ],
  },
];

let mockIdx = 0;

function SourceChip({ source, onClick }) {
  return (
    <button
      onClick={() => onClick(source)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "20px",
        color: "#a8b4c8",
        fontSize: "12px",
        fontFamily: "'DM Mono', monospace",
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.11)";
        e.currentTarget.style.color = "#d4dce8";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        e.currentTarget.style.color = "#a8b4c8";
      }}
    >
      <span style={{ opacity: 0.6 }}>📄</span>
      {source.doc} · p.{source.page}
    </button>
  );
}

function Message({ msg, onSourceClick }) {
  const isUser = msg.role === "user";

  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={i} style={{ color: "#e2e8f0", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("`") && part.endsWith("`"))
        return <code key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "4px", color: "#93c5fd" }}>{part.slice(1, -1)}</code>;
      if (part.startsWith("*") && part.endsWith("*"))
        return <em key={i} style={{ color: "#cbd5e1" }}>{part.slice(1, -1)}</em>;
      return part;
    });
  };

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      padding: "20px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      animation: "fadeSlideIn 0.3s ease forwards",
    }}>
      <div style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        background: isUser
          ? "linear-gradient(135deg, #4f8ef7, #7c3aed)"
          : "linear-gradient(135deg, #cf8b5c, #d97757)",
        boxShadow: isUser
          ? "0 0 12px rgba(79,142,247,0.3)"
          : "0 0 12px rgba(207,139,92,0.3)",
      }}>
        {isUser ? "S" : "◆"}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "13px",
          fontWeight: 600,
          color: isUser ? "#93b4f7" : "#cf8b5c",
          marginBottom: "8px",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.01em",
        }}>
          {isUser ? "You" : "RAG Assistant"}
        </div>

        <div style={{
          fontSize: "15px",
          lineHeight: "1.7",
          color: "#c8d4e0",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {renderText(msg.text)}
        </div>

        {msg.sources && msg.sources.length > 0 && (
          <div style={{ marginTop: "14px" }}>
            <div style={{
              fontSize: "11px",
              color: "#5a6a7a",
              marginBottom: "8px",
              fontFamily: "'DM Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
              {msg.sources.length} source{msg.sources.length > 1 ? "s" : ""} retrieved
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {msg.sources.map((s, i) => (
                <SourceChip key={i} source={s} onClick={onSourceClick} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SourceModal({ source, onClose }) {
  if (!source) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#1a2230",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "16px",
          padding: "28px",
          maxWidth: "520px",
          width: "90%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          animation: "slideUp 0.25s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "13px", color: "#5a7a9a", fontFamily: "'DM Mono', monospace", marginBottom: "4px" }}>
              📄 {source.doc}
            </div>
            <div style={{ fontSize: "12px", color: "#3a5a6a", fontFamily: "'DM Mono', monospace" }}>
              Page {source.page}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#5a6a7a", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderLeft: "3px solid #cf8b5c",
          borderRadius: "8px",
          padding: "16px",
          fontSize: "14px",
          lineHeight: "1.7",
          color: "#a0b4c4",
          fontFamily: "'DM Sans', sans-serif",
          fontStyle: "italic",
        }}>
          "{source.snippet}"
        </div>
        <div style={{ marginTop: "16px", fontSize: "12px", color: "#3a4a5a", fontFamily: "'DM Mono', monospace" }}>
          Click outside to close
        </div>
      </div>
    </div>
  );
}

function DocCard({ doc, onRemove }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 12px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
    >
      <div style={{
        width: "32px", height: "38px",
        background: doc.color,
        borderRadius: "4px",
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "10px", fontWeight: 700, color: "#3a3a3a", fontFamily: "'DM Mono', monospace",
      }}>
        PDF
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "13px", color: "#c8d4e0", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {doc.name}
        </div>
        <div style={{ fontSize: "11px", color: "#4a6a7a", fontFamily: "'DM Mono', monospace", marginTop: "2px" }}>
          {doc.pages} pages · {doc.size}
        </div>
      </div>
      <button
        onClick={() => onRemove(doc.id)}
        style={{ background: "none", border: "none", color: "#3a5a6a", fontSize: "16px", cursor: "pointer", flexShrink: 0, lineHeight: 1, padding: "2px" }}
        onMouseEnter={e => e.currentTarget.style.color = "#e87070"}
        onMouseLeave={e => e.currentTarget.style.color = "#3a5a6a"}
      >
        ×
      </button>
    </div>
  );
}

export default function RAGChat() {
  const [messages, setMessages] = useState(SAMPLE_CONVO);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState(SAMPLE_DOCS);
  const [activeSource, setActiveSource] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input.trim(), sources: [] };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const resp = MOCK_RESPONSES[mockIdx % MOCK_RESPONSES.length];
      mockIdx++;
      setMessages(prev => [...prev, { role: "assistant", ...resp }]);
      setLoading(false);
    }, 1400);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeDoc = (id) => setDocs(prev => prev.filter(d => d.id !== id));

  const addFiles = (files) => {
    const pdfs = Array.from(files).filter(f => f.name.toLowerCase().endsWith(".pdf"));
    if (pdfs.length === 0) {
      alert("Please upload PDF files only.");
      return;
    }
    const colors = ["#e8d5b7", "#c8d8e8", "#d5e8d4", "#e8d5d5", "#e8e0d5"];
    const newDocs = pdfs.map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      pages: Math.floor(Math.random() * 200 + 20),
      color: colors[i % colors.length],
    }));
    setDocs(prev => [...prev, ...newDocs]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1117; }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); } to { transform: rotate(360deg); }
        }

        textarea:focus { outline: none; }
        textarea { resize: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      `}</style>

      <div style={{
        display: "flex",
        height: "100vh",
        background: "#0d1117",
        fontFamily: "'DM Sans', sans-serif",
        color: "#c8d4e0",
        overflow: "hidden",
      }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{
          width: sidebarOpen ? "280px" : "0px",
          minWidth: sidebarOpen ? "280px" : "0px",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          background: "#111820",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ padding: "20px", flex: 1, overflowY: "auto", minWidth: "280px" }}>

            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
              <div style={{
                width: "30px", height: "30px",
                background: "linear-gradient(135deg, #cf8b5c, #d97757)",
                borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px",
                boxShadow: "0 4px 12px rgba(207,139,92,0.3)",
              }}>◆</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>DocMind</div>
                <div style={{ fontSize: "11px", color: "#3a5a6a", fontFamily: "'DM Mono', monospace" }}>RAG · v0.1</div>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {/* Upload / Drop zone */}
            <div
              onClick={handleUploadClick}
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: `1.5px dashed ${dragOver ? "#cf8b5c" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                background: dragOver ? "rgba(207,139,92,0.06)" : "rgba(255,255,255,0.02)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                marginBottom: "20px",
                userSelect: "none",
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>
                {dragOver ? "⬇️" : "📂"}
              </div>
              <div style={{ fontSize: "12px", color: "#5a7a8a", lineHeight: 1.6 }}>
                {dragOver
                  ? <span style={{ color: "#cf8b5c" }}>Drop to upload!</span>
                  : <>Drop PDFs here<br /><span style={{ color: "#3a5a6a" }}>or click to browse</span></>
                }
              </div>
            </div>

            {/* Doc list */}
            <div style={{
              fontSize: "11px", color: "#3a5a6a",
              fontFamily: "'DM Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "10px",
            }}>
              {docs.length} document{docs.length !== 1 ? "s" : ""} indexed
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {docs.map(doc => (
                <DocCard key={doc.id} doc={doc} onRemove={removeDoc} />
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN CHAT ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Top bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "#0d1117",
            gap: "14px",
          }}>
            <button
              onClick={() => setSidebarOpen(p => !p)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                padding: "7px 10px",
                color: "#6a8a9a",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >
              {sidebarOpen ? "◀" : "▶"}
            </button>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 500, color: "#d4dce8" }}>Document Q&A</div>
              <div style={{ fontSize: "12px", color: "#3a5a6a", fontFamily: "'DM Mono', monospace" }}>
                {docs.length} docs · {docs.reduce((a, d) => a + d.pages, 0)} pages indexed
              </div>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 12px",
              background: "rgba(72,199,142,0.08)",
              border: "1px solid rgba(72,199,142,0.2)",
              borderRadius: "20px",
              fontSize: "11px",
              color: "#48c78e",
              fontFamily: "'DM Mono', monospace",
            }}>
              <span style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "#48c78e", display: "inline-block",
                animation: "pulse 2s infinite",
              }} />
              Ready
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 24px",
            maxWidth: "820px",
            width: "100%",
            margin: "0 auto",
          }}>
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} onSourceClick={setActiveSource} />
            ))}

            {loading && (
              <div style={{ display: "flex", gap: "12px", padding: "20px 0", animation: "fadeSlideIn 0.3s ease" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #cf8b5c, #d97757)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
                }}>◆</div>
                <div style={{ paddingTop: "8px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#cf8b5c", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                    RAG Assistant
                  </div>
                  <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: "7px", height: "7px",
                        borderRadius: "50%",
                        background: "#cf8b5c",
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                    ))}
                    <span style={{ fontSize: "12px", color: "#4a6a7a", marginLeft: "8px", fontFamily: "'DM Mono', monospace" }}>
                      Retrieving relevant chunks…
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: "16px 24px 24px",
            maxWidth: "820px",
            width: "100%",
            margin: "0 auto",
          }}>
            <div
              style={{
                background: "#151d27",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "4px 4px 4px 16px",
                display: "flex",
                alignItems: "flex-end",
                gap: "8px",
                transition: "border-color 0.2s",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
              onFocusCapture={e => e.currentTarget.style.borderColor = "rgba(207,139,92,0.4)"}
              onBlurCapture={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about your documents…"
                rows={1}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "#d4dce8",
                  fontSize: "14.5px",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: "1.6",
                  padding: "12px 0",
                  maxHeight: "140px",
                  overflowY: "auto",
                }}
                onInput={e => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                style={{
                  width: "38px", height: "38px",
                  borderRadius: "12px",
                  border: "none",
                  background: input.trim() && !loading
                    ? "linear-gradient(135deg, #cf8b5c, #d97757)"
                    : "rgba(255,255,255,0.06)",
                  color: input.trim() && !loading ? "#fff" : "#3a5a6a",
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                  boxShadow: input.trim() && !loading ? "0 4px 12px rgba(207,139,92,0.3)" : "none",
                }}
              >
                {loading
                  ? <span style={{
                    width: "14px", height: "14px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#cf8b5c",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    display: "block",
                  }} />
                  : "↑"}
              </button>
            </div>

            <div style={{
              textAlign: "center",
              fontSize: "11px",
              color: "#2a3a4a",
              marginTop: "10px",
              fontFamily: "'DM Mono', monospace",
            }}>
              Answers grounded in your documents · Press Enter to send
            </div>
          </div>
        </div>
      </div>

      <SourceModal source={activeSource} onClose={() => setActiveSource(null)} />
    </>
  );
}
