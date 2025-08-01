import React, { useState, useEffect } from "react";
import styles from "./Chat.module.css";
import { getChatbotResponse, getPreviousChats } from "./ChatAPI";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [displayedCode, setDisplayedCode] = useState({ react: "", css: "" });
  const [currentDisplay, setCurrentDisplay] = useState("none");
  const [iframeKey, setIframeKey] = useState(0);
  const navigate = useNavigate();

  const { sessionId } = useParams();
  const { user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    const loadPreviousChats = async () => {
      if (!sessionId || !userId) return;
      const previousMessages = await getPreviousChats(sessionId, userId);
      setMessages(previousMessages);
    };
    loadPreviousChats();
  }, [sessionId, userId]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = inputMessage;
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInputMessage("");

    const botResponse = await getChatbotResponse(userMessage, sessionId, userId);
    const reactCode = botResponse.reactCode || "";
    const cssCode = botResponse.cssCode || "";

    setMessages((prev) => [
      ...prev,
      { text: botResponse.text, sender: "chatbot", reactCode, cssCode },
    ]);

    setDisplayedCode({ react: "", css: "" });
    setCurrentDisplay("none");
    setIframeKey((prev) => prev + 1);
  };

  const handleShowCode = (reactCode, cssCode) => {
    setDisplayedCode({ react: reactCode, css: cssCode });
    setCurrentDisplay("code");
  };

  const handleShowPreview = (reactCode, cssCode) => {
    setDisplayedCode({ react: reactCode, css: cssCode });
    setCurrentDisplay("preview");
  };

  const createPreviewHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: auto;
            }
            ${displayedCode.css}
          </style>
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${displayedCode.react}
          </script>
        </body>
      </html>
    `;
  };

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputMessage]);

  return (
    <div className={styles.container}>
      <div className={styles["left-panel-wrapper"]}>
        <div className={styles["dashboard-link"]} onClick={() => navigate("/dashboard")}>
          ← Go to Dashboard
        </div>

        <div className={styles["left-panel"]}>
          <div className={styles["chat-messages"]}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.text}
                {msg.sender === "chatbot" && (msg.reactCode?.trim() || msg.cssCode?.trim()) && (
                  <div className={styles["code-buttons"]}>
                    <button onClick={() => handleShowCode(msg.reactCode, msg.cssCode)}>
                      Show Code
                    </button>
                    <button onClick={() => handleShowPreview(msg.reactCode, msg.cssCode)}>
                      Show Preview
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles["chat-input-area"]}>
            <textarea
              className={styles.input}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              rows={1}
            />
            <button className={styles.sendButton} onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>

      <div className={styles["right-panel"]}>
        <div className={styles["display-area"]}>
          {currentDisplay === "code" && (
            <>
              <div className={styles["code-section-container"]}>
                <h3>React Code</h3>
                <pre>{displayedCode.react}</pre>
              </div>
              <div className={styles["code-section-container"]}>
                <h3>CSS Code</h3>
                <pre>{displayedCode.css}</pre>
              </div>
            </>
          )}
          {currentDisplay === "preview" && (
            <iframe
              key={iframeKey}
              srcDoc={createPreviewHTML()}
              title="Live Preview"
              sandbox="allow-scripts"
              className={styles["preview-frame"]}
            ></iframe>
          )}
          {currentDisplay === "none" && (
            <div className={styles["no-display-message"]}>
              Select 'Show Code' or 'Show Preview' from the chatbot response to see the output.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { Chat };