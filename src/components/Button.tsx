import React from "react";


//interface ButtonProps :This creates a custom TypeScript blueprint. Any data passed into your custom Button component must follow this contract.
// extends:copy everything from htmal buttons don't need to manually type same for the next
// variant: it's extra custom additon this help the button crash 
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
};

export const Button:React.FC<ButtonProps>=({
     children, 
  variant = 'primary', 
  ...props
}) => {
    //basestyle : It temporarily holds all your global layout rules (padding, rounded corners, transitions, and disabled states) so they can be reused later.//
    const baseStyle = "px-5 py-2.5 rounded font-bold transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800"
}
 return (
    <button 
    className = {`${baseStyle} ${variants[variant]}`} 
      {...props}
    >{children}</button>
 );
};



