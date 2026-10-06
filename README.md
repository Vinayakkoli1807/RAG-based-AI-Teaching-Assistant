

\🚀 RAG based – AI-Powered Course Assistant



> An AI-powered course assistant that uses \*\*Retrieval-Augmented Generation (RAG)\*\* and \*\*Semantic Search\*\* to answer questions from course video content and guide students to the relevant video and timestamp.



\---



\📌 Project Overview



\*\*RAG\*\* is an AI-based Teaching Assistant designed for web development courses.



Instead of searching through long course videos manually, students can simply ask a question. The system searches the relevant course content using semantic similarity and uses an LLM to generate a contextual answer.



The application also provides the \*\*relevant course video and timestamp\*\*, allowing students to directly continue learning from the appropriate section.



\---



\ ✨ Key Features



\- 🤖 AI-powered question answering

\- 🔎 Semantic search using embeddings

\- 📚 Retrieval-Augmented Generation (RAG)

\- 🧠 BGE-M3 for text embeddings

\- 💬 Llama 3.2 for AI response generation

\- ⚡ FastAPI backend

\- ⚛️ React frontend

\- 🦙 Ollama for local LLM and embedding inference

\- 🎥 Relevant course video recommendations

\- ⏱️ Video timestamp references

\- 📖 Course learning interface

\- 📊 Progress section

\- 📝 Practice section

\- 💻 Interactive web interface



\---



\🏗️ System Architecture



```text

&#x20;               👨‍🎓 Student

&#x20;                   │

&#x20;                   ▼

&#x20;         ┌────────────────────┐

&#x20;         │   React Frontend   │

&#x20;         └─────────┬──────────┘

&#x20;                   │

&#x20;                   ▼

&#x20;         ┌────────────────────┐

&#x20;         │   FastAPI Backend  │

&#x20;         └─────────┬──────────┘

&#x20;                   │

&#x20;                   ▼

&#x20;         ┌────────────────────┐

&#x20;         │   BGE-M3 Embedding │

&#x20;         └─────────┬──────────┘

&#x20;                   │

&#x20;                   ▼

&#x20;         ┌────────────────────┐

&#x20;         │ Semantic Similarity│

&#x20;         │   Search / RAG     │

&#x20;         └─────────┬──────────┘

&#x20;                   │

&#x20;                   ▼

&#x20;           Top Relevant Chunks

&#x20;                   │

&#x20;                   ▼

&#x20;         ┌────────────────────┐

&#x20;         │    Llama 3.2 LLM   │

&#x20;         └─────────┬──────────┘

&#x20;                   │

&#x20;                   ▼

&#x20;         AI Answer + Sources

&#x20;                   │

&#x20;                   ▼

&#x20;         🎥 Video + Timestamp

