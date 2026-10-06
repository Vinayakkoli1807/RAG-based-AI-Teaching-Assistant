import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState("tutor");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hello! 👋 I'm your AI Teaching Assistant. Ask me anything about your Web Development course.",
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =========================
  // ASK AI
  // =========================

  const askQuestion = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question.trim();

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userQuestion,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text:
            data.answer ||
            "I couldn't generate an answer.",
          sources: data.sources || [],
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text:
            "I couldn't connect to the AI server. Please make sure FastAPI and Ollama are running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askQuestion();
    }
  };

  // =========================
  // NEW CHAT
  // =========================

  const newChat = () => {
    setMessages([
      {
        type: "ai",
        text: "Hello! 👋 I'm your AI Teaching Assistant. Ask me anything about your Web Development course.",
      },
    ]);

    setQuestion("");
    setActiveSection("tutor");
  };

  // =========================
  // SUGGESTED QUESTIONS
  // =========================

  const suggestedQuestions = [
    "What is HTML?",
    "What is CSS?",
    "Explain JavaScript",
    "What are HTML tags?",
  ];

  const askSuggestedQuestion = (text) => {
    setQuestion(text);
    setActiveSection("tutor");

    setTimeout(() => {
      document
        .getElementById("question-input")
        ?.focus();
    }, 100);
  };

  // =========================
  // TIME FORMAT
  // =========================

  const formatTime = (seconds) => {
    if (
      seconds === undefined ||
      seconds === null
    ) {
      return "";
    }

    const totalSeconds = Math.floor(
      Number(seconds)
    );

    if (isNaN(totalSeconds)) return "";

    const minutes = Math.floor(
      totalSeconds / 60
    );

    const remainingSeconds =
      totalSeconds % 60;

    return `${minutes}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // =========================
  // VIDEO
  // =========================

  const [selectedVideo, setSelectedVideo] =
    useState(null);

  const openVideo = async (source) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/find-video?title=${encodeURIComponent(
          source.title
        )}`
      );

      const data = await response.json();

      if (!data.found) {
        alert(
          "Video could not be found in the videos folder."
        );
        return;
      }

      setSelectedVideo({
        url: `http://127.0.0.1:8000/video/${encodeURIComponent(
          data.filename
        )}`,
        title: source.title,
        start: Number(source.start) || 0,
      });
    } catch (error) {
      console.error(error);
      alert("Unable to open the video.");
    }
  };

  // =========================
  // COURSE SECTION
  // =========================

  const courseVideos = [
    "Installing VS Code & How Websites Work",
    "Basic Structure of an HTML Website",
    "Heading, Paragraphs and Links",
    "Id & Classes in HTML",
    "Image, Lists and Tables in HTML",
    "Inline & Block Elements in HTML",
    "Forms and input tags in HTML",
    "Video, Audio & Media in HTML",
    "SEO and Core Web Vitals in HTML",
    "Your First HTML Website",
  ];

  // =========================
  // PRACTICE QUESTIONS
  // =========================

  const practiceQuestions = [
    {
      question: "What is HTML?",
      topic: "HTML Basics",
    },
    {
      question:
        "What is the difference between HTML and CSS?",
      topic: "Web Development",
    },
    {
      question:
        "What are classes and IDs in HTML?",
      topic: "HTML",
    },
    {
      question:
        "What is the purpose of the <form> tag?",
      topic: "HTML Forms",
    },
    {
      question:
        "What is the difference between block and inline elements?",
      topic: "HTML",
    },
  ];

  // =========================
  // TUTOR PAGE
  // =========================

  const renderTutor = () => (
    <>
      <section className="chat-area">

        <div className="welcome-card">
          <div className="welcome-icon">
            ✨
          </div>

          <div>
            <h2>
              How can I help you learn?
            </h2>

            <p>
              Ask questions about your Web
              Development course and I'll find
              the relevant lessons for you.
            </p>
          </div>
        </div>

        {messages.map((message, index) => (
          <div
            className={`message-row ${message.type}`}
            key={index}
          >
            <div className="avatar">
              {message.type === "ai"
                ? "🤖"
                : "VK"}
            </div>

            <div className="message-content">

              <div className="message-header">
                <span className="message-name">
                  {message.type === "ai"
                    ? "AI Assistant"
                    : "You"}
                </span>

                {message.type === "ai" && (
                  <span className="ai-badge">
                    AI Tutor
                  </span>
                )}
              </div>

              <div className="message-bubble">
                {message.text}
              </div>

              {message.sources &&
                message.sources.length > 0 && (
                  <div className="sources">

                    <div className="sources-header">
                      <div>
                        <span className="sources-icon">
                          📚
                        </span>

                        <strong>
                          Related Course Content
                        </strong>
                      </div>

                      <span className="source-count">
                        {message.sources.length}{" "}
                        sources
                      </span>
                    </div>

                    {message.sources
                      .slice(0, 3)
                      .map(
                        (
                          source,
                          sourceIndex
                        ) => (
                          <div
                            className="source-card"
                            key={sourceIndex}
                          >
                            <div className="video-thumbnail">
                              ▶
                            </div>

                            <div className="source-info">
                              <strong>
                                {source.title ||
                                  "Web Development Lesson"}
                              </strong>

                              <span>
                                Video{" "}
                                {source.number}
                              </span>

                              <small>
                                ⏱{" "}
                                {formatTime(
                                  source.start
                                )}{" "}
                                –{" "}
                                {formatTime(
                                  source.end
                                )}
                              </small>
                            </div>

                            <button
                              className="watch-button"
                              onClick={() =>
                                openVideo(source)
                              }
                            >
                              ▶ Watch
                            </button>
                          </div>
                        )
                      )}
                  </div>
                )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-row ai">
            <div className="avatar">
              🤖
            </div>

            <div className="message-content">

              <div className="message-header">
                <span className="message-name">
                  AI Assistant
                </span>
              </div>

              <div className="message-bubble typing">
                <span></span>
                <span></span>
                <span></span>
                <label>
                  Thinking...
                </label>
              </div>

            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </section>

      {messages.length === 1 &&
        !loading && (
          <div className="suggestions">
            <p>Try asking</p>

            <div className="suggestion-list">
              {suggestedQuestions.map(
                (suggestion, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      askSuggestedQuestion(
                        suggestion
                      )
                    }
                  >
                    💡 {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        )}

      <div className="input-section">

        <div className="input-container">

          <textarea
            id="question-input"
            value={question}
            onChange={(event) =>
              setQuestion(
                event.target.value
              )
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your course..."
            rows="1"
            disabled={loading}
          />

          <button
            className="send-button"
            onClick={askQuestion}
            disabled={
              loading ||
              !question.trim()
            }
          >
            ➤
          </button>

        </div>

        <div className="input-footer">
          <span>
            ✨ AI answers are based on 
            course content  
          </span>

          <span>
            Enter ↵ to send
          </span>
        </div>

      </div>
    </>
  );

  // =========================
  // COURSE PAGE
  // =========================

  const renderCourse = () => (
    <div className="page-content">

      <div className="page-title">
        <div>
          <h2>📚 Web Development Course</h2>
          <p>
            Explore your available course
            lessons.
          </p>
        </div>

        <div className="course-stat">
          10 Lessons
        </div>
      </div>

      <div className="course-grid">

        {courseVideos.map(
          (video, index) => (
            <div
              className="lesson-card"
              key={index}
            >
              <div className="lesson-number">
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </div>

              <div className="lesson-icon">
                ▶
              </div>

              <div className="lesson-info">
                <span>
                  Video {index + 1}
                </span>

                <h3>{video}</h3>

                <small>
                  Sigma Web Development
                  Course
                </small>
              </div>

              <button
                onClick={() =>
                  setActiveSection(
                    "tutor"
                  )
                }
              >
                Ask AI
              </button>
            </div>
          )
        )}

      </div>
    </div>
  );

  // =========================
  // PROGRESS PAGE
  // =========================

  const renderProgress = () => (
    <div className="page-content">

      <div className="page-title">
        <div>
          <h2>📊 Your Progress</h2>

          <p>
            Track your Web Development
            learning journey.
          </p>
        </div>
      </div>

      <div className="progress-overview">

        <div className="progress-circle">
          <strong>35%</strong>
          <span>Completed</span>
        </div>

        <div className="progress-details">

          <h3>
            Web Development
          </h3>

          <p>
            Keep learning and complete more
            lessons.
          </p>

          <div className="large-progress">
            <div></div>
          </div>

          <div className="progress-numbers">
            <span>
              3 of 10 lessons completed
            </span>

            <strong>35%</strong>
          </div>

        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <span>📚</span>
          <strong>10</strong>
          <p>Total Lessons</p>
        </div>

        <div className="stat-card">
          <span>✅</span>
          <strong>3</strong>
          <p>Completed</p>
        </div>

        <div className="stat-card">
          <span>🎯</span>
          <strong>7</strong>
          <p>Remaining</p>
        </div>

        <div className="stat-card">
          <span>🔥</span>
          <strong>5</strong>
          <p>Practice Sessions</p>
        </div>

      </div>
    </div>
  );

  // =========================
  // PRACTICE PAGE
  // =========================

  const renderPractice = () => (
    <div className="page-content">

      <div className="page-title">
        <div>
          <h2>🧠 Practice</h2>

          <p>
            Test your Web Development
            knowledge with AI.
          </p>
        </div>
      </div>

      <div className="practice-card">

        <div className="practice-header">
          <span>
            Practice Questions
          </span>

          <strong>
            {practiceQuestions.length}
            {" "}Questions
          </strong>
        </div>

        {practiceQuestions.map(
          (item, index) => (
            <div
              className="practice-question"
              key={index}
            >
              <div className="question-number">
                {index + 1}
              </div>

              <div>
                <span>
                  {item.topic}
                </span>

                <h3>
                  {item.question}
                </h3>
              </div>

              <button
                onClick={() =>
                  askSuggestedQuestion(
                    item.question
                  )
                }
              >
                Ask AI →
              </button>
            </div>
          )
        )}

      </div>
    </div>
  );

  // =========================
  // MAIN PAGE
  // =========================

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            🎓
          </div>

          <div>
            <h2>RAG-edu</h2>
            <span>
              Teaching Assistant
            </span>
          </div>

        </div>

        <div className="new-chat">
          <button onClick={newChat}>
            ＋ New Chat
          </button>
        </div>

        <nav className="navigation">

          <button
            className={`nav-item ${
              activeSection === "tutor"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("tutor")
            }
          >
            <span className="nav-icon">
              🤖
            </span>

            <span>AI Tutor</span>
          </button>

          <button
            className={`nav-item ${
              activeSection === "course"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("course")
            }
          >
            <span className="nav-icon">
              📚
            </span>

            <span>Course</span>
          </button>

          {/* <button
            className={`nav-item ${
              activeSection === "progress"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("progress")
            }
          >
            <span className="nav-icon">
              📊
            </span>

            <span>Progress</span>
          </button> */}

          <button
            className={`nav-item ${
              activeSection === "practice"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("practice")
            }
          >
            <span className="nav-icon">
              🧠
            </span>

            <span>Practice</span>
          </button>

        </nav>

        <div className="sidebar-spacer"></div>

        <div className="course-progress">

          <div className="course-label">
            <span>Current Course</span>
            <span>Learning</span>
          </div>

          <h3>
            Web Development
          </h3>

          <div className="progress-bar">
            <div className="progress-value"></div>
          </div>

          <div className="progress-info">
            <span>Course progress</span>
            <strong>35%</strong>
          </div>

        </div>

        {/* DEVELOPER NAME */}

        <div className="developer-card">

          <div className="developer-avatar">
            VK
          </div>

          <div className="developer-info">
            <span>Developed by</span>
            <strong>
              Vinayak Koli
            </strong>
          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="main">

        <header className="header">

          <div className="header-title">

            <div className="mobile-logo">
              🎓
            </div>

            <div>

              <h1>
                {activeSection === "tutor" &&
                  "AI Teaching Assistant"}

                {activeSection === "course" &&
                  "Course"}

                {activeSection === "progress" &&
                  "Learning Progress"}

                {activeSection === "practice" &&
                  "Practice"}
              </h1>

              <p>
                Learn Web Development with
                your AI tutor
              </p>

            </div>

          </div>

          <div className="online-status">
            <span className="online-dot"></span>
            AI Online
          </div>

        </header>

        {/* PAGE CONTENT */}

        {activeSection === "tutor" &&
          renderTutor()}

        {activeSection === "course" &&
          renderCourse()}

        {activeSection === "progress" &&
          renderProgress()}

        {activeSection === "practice" &&
          renderPractice()}

        {/* VIDEO MODAL */}

        {selectedVideo && (
          <div
            className="video-modal"
            onClick={() =>
              setSelectedVideo(null)
            }
          >
            <div
              className="video-modal-content"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="video-modal-header">

                <div>
                  <h2>
                    {selectedVideo.title}
                  </h2>

                  <span>
                    Starting at{" "}
                    {formatTime(
                      selectedVideo.start
                    )}
                  </span>
                </div>

                <button
                  className="close-video"
                  onClick={() =>
                    setSelectedVideo(
                      null
                    )
                  }
                >
                  ✕
                </button>

              </div>

              <video
                className="course-video"
                controls
                autoPlay
                ref={(video) => {
                  if (video) {
                    video.currentTime =
                      selectedVideo.start;
                  }
                }}
              >
                <source
                  src={selectedVideo.url}
                  type="video/mp4"
                />

                Your browser does not support
                video playback.
              </video>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;