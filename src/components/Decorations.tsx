"use client";

import React from 'react';

const Decorations: React.FC = () => {
  return (
    <>
      {/* Star at top */}
      <div className="decoration" style={{ top: '15%', left: '8%', transform: 'rotate(5deg)', animationDuration: '5s' }}>
        <span role="img" aria-label="star" style={{ fontSize: '28px' }}>⭐</span>
      </div>

      {/* Cake in upper middle */}
      <div className="decoration" style={{ top: '25%', right: '12%', transform: 'rotate(-8deg)', animationDuration: '6s' }}>
        <span role="img" aria-label="cake" style={{ fontSize: '32px' }}>🎂</span>
      </div>

      {/* Two balloons with different colors/positions */}
      <div className="decoration" style={{ top: '40%', left: '5%', transform: 'rotate(-15deg)', animationDuration: '7s' }}>
        <span role="img" aria-label="balloon" style={{ fontSize: '30px', color: '#FF4E9D' }}>🎈</span>
      </div>
      <div className="decoration" style={{ top: '45%', right: '15%', transform: 'rotate(12deg)', animationDuration: '5.5s' }}>
        <span role="img" aria-label="balloon" style={{ fontSize: '28px', opacity: '0.85' }}>🎈</span>
      </div>

      {/* Sparkles as accent */}
      <div className="decoration" style={{ top: '55%', left: '12%', transform: 'rotate(8deg)', animationDuration: '4.5s' }}>
        <span role="img" aria-label="sparkles" style={{ fontSize: '24px' }}>✨</span>
      </div>

      {/* Gifts at lower positions */}
      <div className="decoration" style={{ bottom: '25%', right: '8%', transform: 'rotate(-10deg)', animationDuration: '6.5s' }}>
        <span role="img" aria-label="gift" style={{ fontSize: '28px' }}>🎁</span>
      </div>
      <div className="decoration" style={{ bottom: '15%', left: '15%', transform: 'rotate(15deg)', animationDuration: '5.8s' }}>
        <span role="img" aria-label="gift" style={{ fontSize: '26px', opacity: '0.9' }}>🎁</span>
      </div>
    </>
  );
};

export default Decorations;
