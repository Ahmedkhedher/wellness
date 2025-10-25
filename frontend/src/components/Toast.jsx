import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'celebration': return '🎉';
      default: return '✅';
    }
  };

  const getColors = () => {
    switch(type) {
      case 'success': return {
        bg: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        shadow: 'rgba(76, 175, 80, 0.4)'
      };
      case 'error': return {
        bg: 'linear-gradient(135deg, #F44336 0%, #E53935 100%)',
        shadow: 'rgba(244, 67, 54, 0.4)'
      };
      case 'warning': return {
        bg: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
        shadow: 'rgba(255, 152, 0, 0.4)'
      };
      case 'celebration': return {
        bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        shadow: 'rgba(255, 215, 0, 0.4)'
      };
      default: return {
        bg: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
        shadow: 'rgba(33, 150, 243, 0.4)'
      };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      ...styles.toast,
      background: colors.bg,
      boxShadow: `0 8px 24px ${colors.shadow}`
    }}>
      <div style={styles.icon}>{getIcon()}</div>
      <div style={styles.message}>{message}</div>
      <button onClick={onClose} style={styles.closeBtn}>×</button>
    </div>
  );
};

const styles = {
  toast: {
    position: 'fixed',
    top: '100px',
    right: '20px',
    minWidth: '300px',
    maxWidth: '500px',
    padding: '16px 20px',
    borderRadius: '12px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 10000,
    animation: 'slideIn 0.3s ease-out',
    fontWeight: '600',
    fontSize: '1rem'
  },
  icon: {
    fontSize: '1.5rem',
    flexShrink: 0
  },
  message: {
    flex: 1,
    lineHeight: '1.4'
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.2s'
  }
};

// Add animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  if (!document.querySelector('style[data-toast-animation]')) {
    style.setAttribute('data-toast-animation', 'true');
    document.head.appendChild(style);
  }
}

export default Toast;
