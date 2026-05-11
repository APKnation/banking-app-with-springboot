import React from 'react';

const Cards = () => (
  <div className="container anim-fade-up">
    <div className="section-header" style={{ marginTop: '2.5rem' }}>
      <div>
        <h2>Virtual Cards</h2>
        <p>Manage your physical and digital cards</p>
      </div>
    </div>
    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <div className="glass-card p-8" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', position: 'relative', height: '200px' }}>
        <div className="flex justify-between items-start">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" opacity="0.3">
            <rect x="2" y="5" width="20" height="14" rx="2" />
          </svg>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>VISA</span>
        </div>
        <div style={{ marginTop: '3rem', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.2em', color: 'white' }}>
          •••• •••• •••• 4242
        </div>
        <div className="flex justify-between" style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
          <span>VORTEX USER</span>
          <span>12/26</span>
        </div>
      </div>
      
      <div className="glass-card p-8 flex flex-col justify-center items-center text-center border-dashed" style={{ borderStyle: 'dashed', background: 'transparent' }}>
        <div className="empty-icon" style={{ marginBottom: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <h3 style={{ fontSize: '1rem' }}>Add New Card</h3>
      </div>
    </div>
  </div>
);

export default Cards;
