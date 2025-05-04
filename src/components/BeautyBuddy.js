import { useState } from 'react';

export default function BeautyBuddy() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Hi! I\'m your Beauty Buddy. I\'ll be here to help with beauty advice soon!' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setChatHistory([...chatHistory, { role: 'user', content: message }]);
    
    setMessage('');
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Gemini API integration coming soon. Stay tuned!'
      }]);
    }, 1000);
  };

  return (
    <section className="beauty-buddy-container">
      <h2>Beauty Buddy</h2>
      <p>Your AI beauty assistant powered by Gemini</p>
      
      <div className="chat-container">
        <div className="chat-messages">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`message ${chat.role}`}>
              {chat.content}
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about beauty..."
            className="chat-input"
          />
          <button type="submit" className="chat-submit">Send</button>
        </form>
      </div>
    </section>
  );
} 