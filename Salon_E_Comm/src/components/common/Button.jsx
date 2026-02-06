import React from 'react';

const Button = ({ children, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--accent-color)',
                color: '#fff',
                borderRadius: '4px',
                fontWeight: '500'
            }}
        >
            {children}
        </button>
    );
};

export default Button;
