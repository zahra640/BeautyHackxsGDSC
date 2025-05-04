import { NavLink } from 'react-router-dom'
import icon from '../assets/iconBH.png'
import logo from '../assets/logoBH.png';  

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="logo-main">
          <img src={logo} className="main-logo" alt="Beauty Hackxs" />
        </div>
        <div className="description">
          <h1>Beauty Hackxs</h1>
          <p>Accessible beauty for everyone. We help you discover the perfect beauty products tailored to your needs through ingredient analysis and smart technology.</p>
        </div>
        <div className="cta-buttons">
          <NavLink to="/ingredients" className="btn primary-btn">Explore Ingredients</NavLink>
        </div>
      </section>

      <section id="about" className="about-section">
        <h2>About Us</h2>
        <div className="about-content">
          <div className="about-text">
            <p>Beauty Hackxs is devoted to making beauty accessible to everyone. We believe that understanding what goes into your beauty products shouldn't be complicated.</p>
            <p>Our mission is to empower consumers with knowledge about ingredients in beauty products, helping them make informed choices that align with their personal needs and values.</p>
            <p>Using technology to decode ingredient lists, we provide easy-to-understand information about what you're putting on your skin, making beauty science accessible to all.</p>
          </div>
          <div className="about-image">
            <img src={icon} className="about-logo" alt="Beauty Hackxs icon" />
          </div>
        </div>
      </section>
    </>
  );
}
