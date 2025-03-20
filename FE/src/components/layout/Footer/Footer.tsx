// Footer.tsx
import React from 'react'
import './Footer.css'
import { CSSProperties } from 'react'

interface FooterProps {
  style?: CSSProperties
}

const Footer: React.FC<FooterProps> = ({ style }) => {
  return (
    <footer className='footer-container' style={style}>
      <div className='footer-content'>
        <div className='footer-section'>
          <h3>About Us</h3>
          <p>Skin Care System</p>
        </div>

        <div className='footer-section'>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href='#'>Home</a>
            </li>
            <li>
              <a href='#'>About</a>
            </li>
            <li>
              <a href='#'>Contact</a>
            </li>
          </ul>
        </div>

        <div className='footer-section'>
          <h3>Contact</h3>
          <p>Email: info@xai.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>© {new Date().getFullYear()} xAI. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
