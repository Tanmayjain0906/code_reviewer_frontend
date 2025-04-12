import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import axios from "axios";
import "./style.css"; 

const CodeReviewEditor = () => {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    setReview("");

    try {
      const response = await axios.post("https://code-reviewer-backend-fryq.onrender.com/ai/get-review", { prompt: code });

      if (response.data.success) {
        setReview(response.data.message);
      } else {
        setReview("Internal Server Error");
      }
    } catch (error) {
      console.error(error);
      setReview("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-review-container">
      <div className="editor-section">
        <MonacoEditor
          height="100%"
          width="100%"
          language="javascript"
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            scrollbar: {
              vertical: "hidden",
              horizontal: "hidden",
            },
            lineNumbers: "on",
            automaticLayout: true,
            wordWrap: "on",
          }}
        />
        <button className="review-button" onClick={handleReview} disabled={loading}>
          {loading && <div className="spinner" />}
          {loading ? "Reviewing..." : "Review"}
        </button>
      </div>

      <div className="review-section">
        <h2>Code Review Output</h2>
        <div className="markdown-review">
          {review ? (
            <ReactMarkdown
              children={review}
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        borderRadius: "6px",
                        padding: "12px",
                        marginBottom: "16px",
                        background: "#2d2d2d",
                        fontSize: "13px",
                        lineHeight: "1.5",
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      style={{
                        backgroundColor: "#2d2d2d",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            />
          ) : (
            <pre>No review yet.</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReviewEditor;
