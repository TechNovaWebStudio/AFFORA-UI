import React from 'react';

const GlassButton = ({ children, onClick, className = '', type = 'button', variant = 'primary', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-md border shadow-sm";
  
  const variants = {
    primary: "bg-brand-primary/90 text-white border-brand-primary/20 hover:bg-brand-primary hover:shadow-md",
    secondary: "bg-white/70 text-brand-textMain border-white/40 hover:bg-white/90 hover:shadow-md",
    outline: "bg-transparent text-brand-textMain border-brand-border hover:bg-brand-light/50",
    dark: "bg-brand-dark/90 text-white border-brand-dark/20 hover:bg-brand-dark hover:shadow-md"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;
