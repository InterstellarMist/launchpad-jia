"use client";

import { assetConstants } from "@/lib/utils/constantsV2";
import React, { useRef, useEffect } from "react";

export default function RichTextEditor({ setText, text, hasError = false }) {
  const descriptionEditorRef = useRef(null);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    descriptionEditorRef.current?.focus();
  };

  const handleDescriptionChange = () => {
    if (descriptionEditorRef.current) {
      setText(descriptionEditorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    // Get plain text from clipboard
    const text = e.clipboardData.getData("text/plain");

    // Insert the plain text at cursor position
    document.execCommand("insertText", false, text);

    // Update the state
    handleDescriptionChange();
  };

  // Handle placeholder for contenteditable div
  useEffect(() => {
    const editor = descriptionEditorRef.current;
    if (editor) {
      const handleFocus = () => {
        if (editor.innerHTML === "" || editor.innerHTML === "<br>") {
          editor.innerHTML = "";
        }
      };

      const handleBlur = () => {
        if (editor.innerHTML === "" || editor.innerHTML === "<br>") {
          editor.innerHTML = "";
        }
      };

      editor.addEventListener("focus", handleFocus);
      editor.addEventListener("blur", handleBlur);

      return () => {
        editor.removeEventListener("focus", handleFocus);
        editor.removeEventListener("blur", handleBlur);
      };
    }
  }, []);

  useEffect(() => {
    if (
      descriptionEditorRef.current &&
      !descriptionEditorRef.current.innerHTML &&
      text
    ) {
      descriptionEditorRef.current.innerHTML = text;
    }
  }, []);

  return (
    <div
      style={{
        border: hasError ? "1px solid #FDA29B" : "1px solid #E9EAEB",
        borderRadius: "8px",
      }}
    >
      <div
        ref={descriptionEditorRef}
        contentEditable={true}
        className="input-focus-ring"
        style={{
          height: "300px",
          overflowY: "auto",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          padding: "12px",
          lineHeight: "1.5",
          position: "relative",
          fontWeight: 500,
          color: "#414651",
        }}
        onInput={handleDescriptionChange}
        onBlur={handleDescriptionChange}
        onPaste={handlePaste}
        data-placeholder="Enter job description..."
      ></div>
      {/* Rich Text Editor Toolbar */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          display: "flex",
          gap: "4px",
          height: "48px",
          padding: "0 8px",
          alignItems: "center",
          borderTop: "1px solid #E9EAEB",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("bold")}
          title="Bold"
          style={{
            padding: "6px",
            height: 36,
            width: 36,
            backgroundColor: "transparent",
            margin: 0,
          }}
        >
          <img
            src={assetConstants.textBold}
            alt="Bold"
            width={20}
            height={20}
          />
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("italic")}
          title="Italic"
          style={{
            padding: "6px",
            height: 36,
            width: 36,
            backgroundColor: "transparent",
            margin: 0,
          }}
        >
          <img
            src={assetConstants.textItalic}
            alt="Italic"
            width={20}
            height={20}
          />
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("underline")}
          title="Underline"
          style={{
            padding: "6px",
            height: 36,
            width: 36,
            backgroundColor: "transparent",
            margin: 0,
          }}
        >
          <img
            src={assetConstants.textUnderline}
            alt="Underline"
            width={20}
            height={20}
          />
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("strikeThrough")}
          title="Strikethrough"
          style={{
            padding: "6px",
            height: 36,
            width: 36,
            backgroundColor: "transparent",
            margin: 0,
          }}
        >
          <img
            src={assetConstants.textStrikethrough}
            alt="Strikethrough"
            width={20}
            height={20}
          />
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("insertOrderedList")}
          title="Numbered List"
          style={{
            padding: "6px",
            height: 36,
            width: 36,
            backgroundColor: "transparent",
            margin: 0,
          }}
        >
          <img
            src={assetConstants.textNumberedList}
            alt="Numbered List"
            width={20}
            height={20}
          />
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("insertUnorderedList")}
          title="Bullet List"
          style={{
            padding: "6px",
            height: 36,
            width: 36,
            backgroundColor: "transparent",
            margin: 0,
          }}
        >
          <img
            src={assetConstants.textBulletList}
            alt="Bullet List"
            width={20}
            height={20}
          />
        </button>
      </div>
      <style jsx>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #6c757d;
          pointer-events: none;
          position: absolute;
          top: 12px;
          left: 12px;
        }
      `}</style>
    </div>
  );
}
