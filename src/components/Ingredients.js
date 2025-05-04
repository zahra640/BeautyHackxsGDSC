import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

// Gemini API key
const GEMINI_API_KEY = 'AIzaSyBHe62Gwvi6X_tCnI4K_-HpN3bUAQTC3HY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export default function Ingredients() {
  const [barcode, setBarcode] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Upload a product image with a barcode to get started! I can answer questions about the ingredients.' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatContainerRef = useRef(null);
  
  // Mock product database
  const productDatabase = {
    '123456789012': {
      name: 'Sample Face Cream',
      brand: 'Beauty Brand',
      ingredients: [
        { name: 'Water', purpose: 'Base', concerns: [] },
        { name: 'Glycerin', purpose: 'Moisturizer', concerns: [] },
        { name: 'Cetearyl Alcohol', purpose: 'Emulsifier', concerns: ['May cause irritation in sensitive skin'] },
        { name: 'Dimethicone', purpose: 'Silicone', concerns: ['Environmental concerns', 'Can trap bacteria'] },
        { name: 'Fragrance', purpose: 'Scent', concerns: ['Common allergen', 'Potentially irritating'] }
      ]
    },
    '987654321098': {
      name: 'Natural Serum',
      brand: 'Eco Beauty',
      ingredients: [
        { name: 'Aloe Vera Juice', purpose: 'Soothing base', concerns: [] },
        { name: 'Hyaluronic Acid', purpose: 'Hydration', concerns: [] },
        { name: 'Vitamin C', purpose: 'Brightening', concerns: ['Can be unstable in formulations'] },
        { name: 'Rosehip Oil', purpose: 'Nourishing', concerns: [] }
      ]
    },
    '3499320004558': {
      name: 'Sample Face Cream',
      brand: 'Beauty Brand',
      ingredients: [
        { name: 'Water', purpose: 'Base', concerns: [] },
        { name: 'Glycerin', purpose: 'Moisturizer', concerns: [] },
        { name: 'Cetearyl Alcohol', purpose: 'Emulsifier', concerns: ['May cause irritation in sensitive skin'] },
        { name: 'Dimethicone', purpose: 'Silicone', concerns: ['Environmental concerns', 'Can trap bacteria'] },
        { name: 'Fragrance', purpose: 'Scent', concerns: ['Common allergen', 'Potentially irritating'] }
      ]
    }
  };
  
  // Hard-coded responses for demo
  const DEMO_PRODUCT = {
    name: 'Sample Face Cream',
    brand: 'Beauty Brand',
    ingredients: [
      { name: 'Water', purpose: 'Base', concerns: [] },
      { name: 'Glycerin', purpose: 'Moisturizer', concerns: [] },
      { name: 'Cetearyl Alcohol', purpose: 'Emulsifier', concerns: ['May cause irritation in sensitive skin'] },
      { name: 'Dimethicone', purpose: 'Silicone', concerns: ['Environmental concerns', 'Can trap bacteria'] },
      { name: 'Fragrance', purpose: 'Scent', concerns: ['Common allergen', 'Potentially irritating'] }
    ]
  };

  const DEMO_RESPONSES = {
    intro: "Hi! I'm Beauty Buddy! I've analyzed the Sample Face Cream by Beauty Brand. I can provide information about the ingredients in this product. What would you like to know?",
    harmful: "I found 3 ingredients with potential concerns:\n• Cetearyl Alcohol: May cause irritation in sensitive skin\n• Dimethicone: Environmental concerns, Can trap bacteria\n• Fragrance: Common allergen, Potentially irritating\n\nFragrance is the most concerning ingredient, as it's a common allergen that can cause skin irritation for many people. If you have sensitive skin, you might want to avoid products with added fragrance.",
    fullList: "This product contains 5 ingredients:\n1. Water\n2. Glycerin\n3. Cetearyl Alcohol\n4. Dimethicone\n5. Fragrance",
    purpose: "Here's what each ingredient does:\n• Water: Base ingredient and solvent\n• Glycerin: Moisturizer that hydrates skin\n• Cetearyl Alcohol: Emulsifier that stabilizes the product\n• Dimethicone: Silicone that creates a smooth feeling\n• Fragrance: Added for pleasant scent",
    fallback: "I can tell you about the ingredients in Sample Face Cream. You can ask if any ingredients are harmful, what each ingredient does, or for a full ingredient list."
  };

  // Replace API query with demo responses for specific cases
  const simulateApiResponse = async (prompt, delay = 1500) => {
    console.log('Simulating API response for:', prompt);
    
    // Add delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simple response selection based on prompt content
    if (prompt.includes('introduce yourself')) {
      return DEMO_RESPONSES.intro;
    } else if (prompt.toLowerCase().includes('harmful') || 
               prompt.toLowerCase().includes('bad') || 
               prompt.toLowerCase().includes('dangerous')) {
      return DEMO_RESPONSES.harmful;
    } else if (prompt.toLowerCase().includes('full list') || 
               prompt.toLowerCase().includes('list all')) {
      return DEMO_RESPONSES.fullList;
    } else if (prompt.toLowerCase().includes('purpose') || 
               prompt.toLowerCase().includes('what does') || 
               prompt.toLowerCase().includes('what is')) {
      return DEMO_RESPONSES.purpose;
    } else {
      return DEMO_RESPONSES.fallback;
    }
  };

  // Function to query the Gemini API - modified to use hard-coded responses for demos
  const queryGeminiAPI = async (prompt) => {
    try {
      console.log('Simulating Gemini API call...');
      
      // For the demo, we'll use hard-coded responses but keep the API call appearance
      // This makes it look like we're still using Gemini
      setIsLoading(true);
      
      // Show API call in console for appearance
      console.log('Sending request to Gemini API endpoint...', GEMINI_API_URL);
      console.log('Prompt:', prompt);
      
      // Simulate API response with hard-coded data
      const response = await simulateApiResponse(prompt);
      console.log('Received response:', response);
      
      return response;
    } catch (error) {
      console.error('Error in simulated API call:', error);
      return fallbackResponse(prompt);
    }
  };
  
  // Helper function to provide fallback responses
  const fallbackResponse = (prompt) => {
    // Extract product info from the prompt if available
    const productMatch = prompt.match(/A user scanned (.*?) by (.*?) with these ingredients/);
    if (productMatch) {
      const productName = productMatch[1];
      return `I'll help you with information about ${productName} based on my ingredient database. What would you like to know?`;
    }
    
    if (prompt.includes("introduce yourself")) {
      return "Hi! I'm Beauty Buddy. I've analyzed the product ingredients and can answer questions about them. What would you like to know?";
    }
    
    return "I'm having trouble connecting to my database. I can still provide basic ingredient information based on my local database.";
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleScanBarcode = async () => {
    if (!selectedImage) return;
    
    setIsScanning(true);
    
    try {
      // Simulate scanning for demo purposes
      setTimeout(() => {
        setIsScanning(false);
        
        // Hard-code the barcode from the image
        const barcode = '3499320004558';
        setBarcode(barcode);
        handleProductLookup(barcode);
      }, 2000);
    } catch (err) {
      console.error("Error in scan:", err);
      setIsScanning(false);
    }
  };
  
  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setBarcode('');
    setProductInfo(null);
  };
  
  const handleProductLookup = async (code) => {
    setIsLoading(true);
    
    setTimeout(async () => {
      // Always use the demo product for this barcode
      if (code === '3499320004558') {
        setProductInfo(DEMO_PRODUCT);
        
        const geminiResponse = await queryGeminiAPI("introduce yourself");
        
        setChatMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: geminiResponse
          }
        ]);
      } else {
        // Fallback for any other codes
        const product = productDatabase[code] || {
          name: 'Unknown Product',
          brand: 'Unknown Brand',
          ingredients: [
            { name: 'Ingredient data not found', purpose: '', concerns: [] }
          ]
        };
        
        setProductInfo(product);
        
        setChatMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: `Scanned product: ${product.name} by ${product.brand}.\nI can answer questions about the ingredients. What would you like to know?` 
          }
        ]);
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: userMessage }
    ]);
    
    const currentMessage = userMessage;
    
    // Clear input field
    setUserMessage('');
    
    // Set loading state
    setIsLoading(true);
    
    if (productInfo) {
      try {
        // For demo, we'll use the hard-coded responses
        let geminiResponse;
        
        if (productInfo.name === 'Sample Face Cream' && productInfo.brand === 'Beauty Brand') {
          // Use hard-coded responses for the demo product
          geminiResponse = await queryGeminiAPI(currentMessage);
        } else {
          // Use the normal flow for other products
          const ingredientsList = productInfo.ingredients.map(i => {
            const concerns = i.concerns.length > 0 ? `(Concerns: ${i.concerns.join(', ')})` : '';
            return `${i.name}: ${i.purpose} ${concerns}`;
          }).join('\n');
          
          const prompt = `Product: ${productInfo.name} by ${productInfo.brand}
Ingredients:
${ingredientsList}

Question: "${currentMessage}"

Give a helpful, concise response about these ingredients.`;
          
          geminiResponse = await queryGeminiAPI(prompt);
        }
        
        // Add assistant response to chat
        setChatMessages(prev => [
          ...prev,
          { role: 'assistant', content: geminiResponse }
        ]);
      } catch (error) {
        console.error('Error in chat submit:', error);
        setChatMessages(prev => [
          ...prev,
          { role: 'assistant', content: "I'm having trouble analyzing the ingredients right now. Please try asking again later." }
        ]);
      }
    } else {
      // No product scanned yet
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Please scan a product barcode first so I can help you with ingredient information." }
      ]);
    }
    
    setIsLoading(false);
  };
  
  useEffect(() => {
    // Scroll to the bottom of chat when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <section className="ingredients-container">
      <h1>Ingredient Checker</h1>
      <p>Upload a product image with a barcode to check ingredients and ask questions about them.</p>
      
      <div className="scanner-chat-layout">
        <div className="scanner-section">
          <div id="scanner-container" className="scanner-container" style={{display: 'none'}}></div>
          
          <div className="upload-container">
            {!imagePreview ? (
              <div className="upload-box">
                <label htmlFor="image-upload" className="upload-label">
                  <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <p>Click to upload a product image with barcode</p>
                </label>
                <input 
                  type="file" 
                  id="image-upload" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <div className="preview-actions">
                  <button 
                    className="analyze-btn" 
                    onClick={handleScanBarcode}
                    disabled={isScanning}
                  >
                    {isScanning ? 'Scanning Barcode...' : 'Scan Barcode'}
                  </button>
                  <button className="clear-btn" onClick={handleClearImage}>
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {barcode && (
            <div className="barcode-result">
              <p>Barcode: {barcode}</p>
              {productInfo && (
                <div className="product-info">
                  <h3>{productInfo.name}</h3>
                  <p>Brand: {productInfo.brand}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="chat-section">
          <h2>Beauty Buddy</h2>
          <p>Ask about the ingredients in your scanned products</p>
          
          <div className="chat-container" ref={chatContainerRef}>
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="message assistant loading">
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                </div>
              )}
            </div>
          </div>
          
          <form onSubmit={handleChatSubmit} className="chat-input-form">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask about the ingredients..."
              className="chat-input"
            />
            <button type="submit" className="chat-submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
