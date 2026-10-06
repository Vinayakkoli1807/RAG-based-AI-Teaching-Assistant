

<b>🚀 RAG based – AI-Powered Course Assistant<b>



> An AI-powered course assistant that uses Retrieval-Augmented Generation (RAG) and Semantic Search to answer questions from course video content and guide students to the relevant video and timestamp.



---



📌 Project Overview



RAG is an AI-based Teaching Assistant designed for web development courses.



Instead of searching through long course videos manually, students can simply ask a question. The system searches the relevant course content using semantic similarity and uses an LLM to generate a contextual answer.



The application also provides the relevant course video and timestamp, allowing students to directly continue learning from the appropriate section.



---



✨ Key Features



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

\- 📝 Practice section

\- 💻 Interactive web interface



\---



🏗️ System Architecture



```text

               👨‍🎓 Student

                   │

                   ▼

         ┌────────────────────┐

         │   React Frontend   │

         └─────────┬──────────┘

                   │

                   ▼

         ┌────────────────────┐

         │   FastAPI Backend  │

         └─────────┬──────────┘

                   │

                   ▼

         ┌────────────────────┐

         │   BGE-M3 Embedding │

         └─────────┬──────────┘

                   │

                   ▼

         ┌────────────────────┐

         │ Semantic Similarity│

         │   Search / RAG     │

         └─────────┬──────────┘

                   │

                   ▼

           Top Relevant Chunks

                   │

                   ▼

         ┌────────────────────┐

         │    Llama 3.2 LLM   │

         └─────────┬──────────┘

                   │

                   ▼

           AI Answer + Sources

                   │

                   ▼

          🎥 Video + Timestamp

