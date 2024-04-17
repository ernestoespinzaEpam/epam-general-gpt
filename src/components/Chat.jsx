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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Code copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
      showToast('Failed to copy code!');
    });
  };

  const renderMessageText = (text) => {
    const codeRegex = /```(\w+)\n+([^]+?)```/gs;
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    const result = [];
  
    text = text.replace(boldRegex, '<strong>$1</strong>'); 
  
    for (const match of text.matchAll(codeRegex)) {
      const [matchedBlock, lang, codeContent] = match;
      const start = match.index;
      const preText = text.slice(lastIndex, start);
      if (preText) {
        result.push(<span key={`${lastIndex}-pre`} dangerouslySetInnerHTML={{ __html: preText.split('\n').join('<br/>') }} />);
      }
  
      result.push(
        <div key={start} className="relative my-2">
          <button
            className="absolute right-0 top-0 bg-black bg-opacity-60 text-white border-none rounded-tl-none rounded-br-lg cursor-pointer p-1"
            onClick={() => copyToClipboard(codeContent.trim())}>
            Copy
          </button>
          <SyntaxHighlighter language={lang} style={okaidia}>
            {codeContent.trim()}
          </SyntaxHighlighter>
        </div>
      );
      lastIndex = start + matchedBlock.length;
    }
  
    const postText = text.slice(lastIndex);
    if (postText) {
      result.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: postText.split('\n').join('<br/>') }} />);
    }
  
    return result;
  };

  return (
    <div className="overflow-y-auto flex-1 p-4 space-y-2">
      {toast.show && (
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white p-4 rounded-lg z-50">
          {toast.message}
        </div>
      )}
      {messages.map((msg, index) => (
        <div key={index} className={`w-full flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`inline-block p-2 rounded-lg text-gray-300 ${msg.isUser ? 'bg-blue-700' : 'bg-gray-700'} break-words max-w-3xl`}>
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