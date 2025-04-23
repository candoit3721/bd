"use client";

import React from 'react';

const Decorations: React.FC = () => {
  return (
    <>
      {/* Top section - sparse and light */}
      <div className="decoration" 
        style={{ 
          top: '10%', 
          left: '15%', 
          transform: 'rotate(-15deg)', 
          animationDuration: '6.5s' 
        }}>
        <span role="img" aria-label="balloon" style={{ fontSize: '28px', color: '#FF4E9D' }}>🎈</span>
      </div>
      <div className="decoration" 
        style={{ 
          top: '12%', 
          right: '20%', 
          transform: 'rotate(10deg)', 
          animationDuration: '7s' 
        }}>
        <span role="img" aria-label="star" style={{ fontSize: '24px' }}>⭐</span>
      </div>

      {/* Middle section - activity focused */}
      <div className="decoration" 
        style={{ 
          top: '40%', 
          left: '25%', 
          transform: 'rotate(-8deg)', 
          animationDuration: '5.8s' 
        }}>
        <span role="img" aria-label="person-cartwheel" style={{ fontSize: '26px' }}>🤸</span>
      </div>
      <div className="decoration" 
        style={{ 
          top: '45%', 
          right: '28%', 
          transform: 'rotate(12deg)', 
          animationDuration: '6.2s' 
        }}>
        <span role="img" aria-label="basketball" style={{ fontSize: '24px' }}>🏀</span>
      </div>

      {/* Side accents */}
      <div className="decoration" 
        style={{ 
          top: '60%', 
          left: '12%', 
          transform: 'rotate(15deg)', 
          animationDuration: '7.2s' 
        }}>
        <span role="img" aria-label="sparkles" style={{ fontSize: '22px' }}>✨</span>
      </div>
      <div className="decoration" 
        style={{ 
          top: '65%', 
          right: '15%', 
          transform: 'rotate(-12deg)', 
          animationDuration: '6.8s' 
        }}>
        <span role="img" aria-label="balloon" style={{ fontSize: '26px', color: '#4FB3FF' }}>🎈</span>
      </div>

      {/* Bottom section - celebration themed */}
      <div className="decoration" 
        style={{ 
          bottom: '15%', 
          left: '30%', 
          transform: 'rotate(-5deg)', 
          animationDuration: '6.5s' 
        }}>
        <span role="img" aria-label="party-popper" style={{ fontSize: '25px' }}>🎉</span>
      </div>
      <div className="decoration" 
        style={{ 
          bottom: '20%', 
          right: '35%', 
          transform: 'rotate(8deg)', 
          animationDuration: '5.5s' 
        }}>
        <span role="img" aria-label="cake" style={{ fontSize: '24px' }}>🎂</span>
      </div>
    </>
  );
};

export default Decorations;
