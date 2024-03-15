import React from "react";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ButtonProps {
  // text: string;
  text: React.ReactNode;
  className?: string;
  type?: "submit" | "button" | undefined;
  loading?: boolean;
  disabled?: boolean;
  to?: string;
  onClick?: (e: React.FormEvent) => void;
}

export const CustomButton: React.FC<ButtonProps> = ({
  text,
  className,
  type,
  loading,
  disabled,
  to,
  onClick,
}) => {
  const buttonContent = (
    <>
      {loading ? <FaSpinner className="animate-spin text-[18px] text-white" /> : null}
      {!loading && text}
    </>
  );

  if (to) {
    return (
      <Link to={to} className="no-underline">
        <button
          type={type}
          disabled={disabled}
          className={`text-[14px] font-bold transition rounded-[10px] bg-[#1C61D5] hover:bg-[#1854bb]  ${className}`}
          onClick={onClick}
        >
          {buttonContent}
        </button>
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`text-[14px] font-bold transition rounded-[10px] bg-[#1C61D5] hover:bg-[#1854bb]  ${className}`}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
};
