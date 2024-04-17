import React, { useEffect, useRef, useState } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Chat = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000); // Hide after 3 seconds
  };

  // Function to copy code text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Code copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
      showToast('Failed to copy code!');
    });
  };

  // Function to render message text, splitting it into code and regular text if needed
  const renderMessageText = (text) => {
    const codeRegex = /```([^`]+)```/gs;
    let lastIndex = 0;
    const result = [];

    for (const match of text.matchAll(codeRegex)) {
      const [matchedBlock, codeContent] = match;
      const start = match.index;
      // Text before the code block with respect to line breaks
      const preText = text.slice(lastIndex, start);
      if (preText) {
        result.push(<span key={`${lastIndex}-pre`}>{preText.split('\n').map((line, i) => <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>)}</span>);
      }
      // Code block with copy button
      result.push(
        <div key={start} style={{ position: 'relative' }}>
          <button
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              backgroundColor: '#00000060',
              color: 'white',
              border: 'none',
              borderTopRightRadius: '4px',
              borderBottomLeftRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => copyToClipboard(codeContent.trim())}
          >
            Copy
          </button>
          <SyntaxHighlighter language="javascript" style={okaidia}>
            {codeContent.trim()}
          </SyntaxHighlighter>
        </div>
      );
      lastIndex = start + matchedBlock.length;
    }
    // Text after the last code block, accounting for line breaks
    const postText = text.slice(lastIndex);
    if (postText) {
      result.push(
        <span key={lastIndex}>{postText.split('\n').map((line, i) => <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>)}</span>
      );
    }

    return result;
  };

  return (
    <div className="overflow-y-auto flex-1 p-4 space-y-2">
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          zIndex: 1000, // Ensure it's above other elements
        }}>
          {toast.message}
        </div>
      )}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`w-full flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`inline-block p-2 rounded-lg text-gray-300 ${msg.isUser ? 'bg-blue-700' : 'bg-gray-700'} break-words max-w-fit`}>
            {msg.text && renderMessageText(msg.text)}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="w-full flex justify-start animate-pulse">
          <div className="inline-block p-2 rounded-lg bg-gray-700">
            <span className="block h-2 bg-gray-500 rounded"></span>
          </div>
        </div>
      )}

      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Chat;