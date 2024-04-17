import React, { useEffect, useState } from 'react';
import './App.css';
import { getHistory, deleteHistory, sendMessage } from './services/chatService';
import Chat from './components/Chat';
import ChatInput from './components/ChatInput';
import logo from './assets/EpamGPT.png';
import { Link } from 'react-router-dom'; 

function App() {
  const [token, setToken] = useState('');
  const welcomeMessage = {
    text: "🚀 Welcome to your AI IaC Assistant!\nHere to support your Infrastructure as Code efforts. Need help with code, deployment strategies, or optimizing infrastructure? I’m ready to assist.\n What can I help you with today?",
    isUser: false
  };  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const prompt = "You are a DevOps expert. Your expertise focuses on IaC, CI/CD, Configuration Management, Logging and monitoring, Cloud and also be a very helpful assistant";
  
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = () => {
    const sessionToken = sessionStorage.getItem('sessionToken') || 'Session_'+Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('sessionToken', sessionToken);
    setToken(sessionToken);

    getHistory(sessionToken)
      .then(previousMessages => {
        setMessages(prevMessages => [...prevMessages, ...previousMessages]);
      })
      .catch(error => console.error(error));
  };

  const handleSendMessage = async (messageText) => {
    setMessages((currentMessages) => [
      ...currentMessages,
      { text: messageText, isUser: true },
    ]);
    setIsLoading(true);

    try {
      const { response } = await sendMessage(messageText, prompt, token);
      setMessages((currentMessages) => [
        ...currentMessages,
        { text: response, isUser: false },
      ]);
    } catch (error) {
      console.error("There was a problem with sending the message:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleClearMessages = async () => {
    try {
      await deleteHistory(token);
      sessionStorage.removeItem('sessionToken');
      initializeSession(); 
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App container mx-auto px-4 py-10 flex flex-col min-h-screen">
      <div className="flex items-center justify-between w-full mb-8">
        <Link to="/" className="flex items-center cursor-pointer">
          <img src={logo} alt="Logo" className="logo mr-4" />
          <h1 className="text-xl font-bold"> AI IaC Assistant</h1>
        </Link>
      </div>

      <div className="flex flex-col flex-1 max-w-fit mx-auto">
        <Chat messages={messages} isLoading={isLoading} />
        <div className="mt-auto mb-0">
          <ChatInput onSendMessage={handleSendMessage} onClearMessages={handleClearMessages} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App
