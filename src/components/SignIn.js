import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); 
    }
  }, [isAuthenticated, navigate]);
  
  
  const API_URL = 'http://localhost/Kalsoums%20Hackathon/beautyhackxs/auth.php';
  
  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          username: email,
          password: password
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(data.message);
        
        login(data.user);
        
        
        setTimeout(() => {
          navigate('/'); 
        }, 1500);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('Error connecting to server. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword) {
      setErrorMessage('Email and password are required');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          username: registerEmail,
          password: registerPassword
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(data.message);
        setShowRegisterForm(false);
        
        setRegisterEmail('');
        setRegisterPassword('');
        
        
        setTimeout(() => {
          setEmail(registerEmail);
          setPassword(registerPassword);
          
          handleSubmit();
        }, 1500);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('Error connecting to server. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    
    setSuccessMessage('Password reset link sent to your email');
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
  };
  
  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setErrorMessage('');
    setSuccessMessage('');
  };
  
  return (
    <section className="signin-container">
      <h2>Welcome Back</h2>
      <p>Sign in to access your personalized beauty recommendations</p>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      {!showRegisterForm && !showForgotPassword && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email/Username</label>
            <input 
              type="text" 
              id="email" 
              className="form-control" 
              value={email}
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-control" 
              value={password}
              onChange={e => setPassword(e.target.value)} 
              required
              placeholder="••••••••"
              disabled={isLoading}
            />
            <div className="forgot-password">
              <a href="#" onClick={toggleForgotPassword}>
                Forgot password?
              </a>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="signin-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      )}

      {showForgotPassword && (
        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <label htmlFor="forgotEmail">Email Address</label>
            <input 
              type="email" 
              id="forgotEmail" 
              className="form-control" 
              value={forgotPasswordEmail}
              onChange={e => setForgotPasswordEmail(e.target.value)} 
              required 
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="signin-btn"
            disabled={isLoading}
          >
            Send Reset Link
          </button>
          
          <div className="back-to-signin">
            <button 
              type="button" 
              className="back-link"
              onClick={toggleForgotPassword}
              disabled={isLoading}
            >
              Back to Sign In
            </button>
          </div>
        </form>
      )}
      
      {showRegisterForm && (
        <form onSubmit={handleCreateAccount}>
          <div className="form-group">
            <label htmlFor="registerEmail">Email/Username</label>
            <input 
              type="text" 
              id="registerEmail" 
              className="form-control" 
              value={registerEmail}
              onChange={e => setRegisterEmail(e.target.value)} 
              required 
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="registerPassword">Password</label>
            <input 
              type="password" 
              id="registerPassword" 
              className="form-control" 
              value={registerPassword}
              onChange={e => setRegisterPassword(e.target.value)} 
              required
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="signin-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="back-to-signin">
            <button 
              type="button" 
              className="back-link"
              onClick={toggleRegisterForm}
              disabled={isLoading}
            >
              Back to Sign In
            </button>
          </div>
        </form>
      )}
      
      {!showRegisterForm && !showForgotPassword && (
        <>
          <div className="signup-option">
            <p>Don't have an account?</p>
            <button 
              className="create-account-btn" 
              onClick={toggleRegisterForm}
              disabled={isLoading}
            >
              Create Account
            </button>
          </div>
          
          <div className="skip-option">
            <NavLink to="/">Continue without an account</NavLink>
          </div>
        </>
      )}
    </section>
  );
}
