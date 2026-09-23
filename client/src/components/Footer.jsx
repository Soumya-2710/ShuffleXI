import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      padding: 'var(--space-2xl) var(--space-lg)',
      background: 'var(--bg-secondary)',
      marginTop: 'auto',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: 'var(--text-sm)',
    }}>
      <div className="container">
        <p style={{ marginBottom: 'var(--space-xs)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Football Game</strong> — Full-Stack MERN Squad Builder
        </p>
        <p>Built with React, Vite, Node.js, Express, and MongoDB.</p>
      </div>
    </footer>
  );
};

export default Footer;
