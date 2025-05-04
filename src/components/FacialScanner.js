import { useState, useRef } from 'react';

export default function FacialScanner() {
  const [imageData, setImageData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const fileInputRef = useRef(null);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageData(event.target.result);
        analyzeFace(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFace = (imageData) => {
    setIsAnalyzing(true);
    
    // Simulating API call to Gemini for facial analysis
    setTimeout(() => {
      // Sample analysis result - in a real app, this would come from the Gemini API
      const sampleAnalysis = {
        skinType: "Combination",
        features: [
          "Oval face shape",
          "Potential dryness around T-zone",
          "Even skin tone with slight redness on cheeks"
        ],
        recommendations: [
          "Consider hydrating serums with hyaluronic acid",
          "A gentle cleanser would be suitable for your skin type",
          "Sun protection is recommended based on your complexion"
        ]
      };
      
      setAnalysisResult(sampleAnalysis);
      setIsAnalyzing(false);
      
      // Add the initial analysis as a system message
      setChatMessages([
        { 
          sender: 'system', 
          text: 'Face analysis complete. I can answer questions about your facial features and provide skincare recommendations.'
        }
      ]);
    }, 2000);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    const newMessages = [
      ...chatMessages,
      { sender: 'user', text: userMessage }
    ];
    setChatMessages(newMessages);
    
    // Simulate Gemini response
    setTimeout(() => {
      let aiResponse = "I'm analyzing your query...";
      
      if (userMessage.toLowerCase().includes("skin type")) {
        aiResponse = "Based on the facial analysis, you have combination skin. This means some areas of your face may be oily (typically the T-zone) while other areas are normal or dry. I recommend using gentle, non-stripping cleansers and applying moisturizer targeted to each zone.";
      } else if (userMessage.toLowerCase().includes("recommend") || userMessage.toLowerCase().includes("product")) {
        aiResponse = "For your skin type, I'd recommend using a gentle foaming cleanser, a hydrating serum with hyaluronic acid, and a lightweight moisturizer. You might also benefit from occasional clay masks on your T-zone.";
      } else if (userMessage.toLowerCase().includes("face shape")) {
        aiResponse = "Your face appears to have an oval shape, which is considered versatile for many hairstyles and makeup looks. This shape is characterized by balanced proportions and a slightly narrower forehead and jawline.";
      } else {
        aiResponse = "Based on your facial analysis, I can provide specific skincare and beauty recommendations tailored to your features. Could you specify what aspect you'd like to know more about? (skin type, suitable products, makeup tips, etc.)";
      }
      
      setChatMessages([
        ...newMessages,
        { sender: 'ai', text: aiResponse }
      ]);
    }, 1000);
    
    setUserMessage('');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <section className="facial-scanner-container">
      <h1>Facial Analysis Scanner</h1>
      <p>Upload a photo of your face to get personalized beauty and skincare recommendations.</p>
      
      <div className="scanner-content">
        <div className="image-upload-section">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          
          {imageData ? (
            <div className="uploaded-image-container">
              <img src={imageData} alt="Uploaded face" className="uploaded-face" />
              {isAnalyzing && <div className="analyzing-overlay">Analyzing...</div>}
            </div>
          ) : (
            <div className="upload-placeholder" onClick={triggerFileInput}>
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              <p>Click to upload a face image</p>
            </div>
          )}
          
          <button 
            className="btn primary-btn upload-btn"
            onClick={triggerFileInput}
          >
            Upload Image
          </button>
        </div>
        
        {analysisResult && (
          <div className="analysis-chat-section">
            <div className="analysis-results">
              <h3>Face Analysis Results</h3>
              <p><strong>Skin Type:</strong> {analysisResult.skinType}</p>
              <div className="features">
                <h4>Features:</h4>
                <ul>
                  {analysisResult.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="recommendations">
                <h4>Initial Recommendations:</h4>
                <ul>
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="chat-container">
              <h3>Ask Beauty Assistant</h3>
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleChatSubmit} className="chat-input">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Ask about your facial features..."
                  className="chat-text-input"
                />
                <button type="submit" className="chat-send-btn">Send</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
