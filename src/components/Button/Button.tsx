import React, { MouseEvent, PropsWithChildren, useRef } from 'react';
import './Button.scss';
import { ButtonProps } from './types';
import classNames from 'classnames';

const useRippleEffect = () => {
  const addRipple = (event: MouseEvent<HTMLButtonElement>, buttonRef: React.RefObject<HTMLButtonElement>) => {
    const button = buttonRef.current;

    if (!button) return;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  return { addRipple };
};

const Button: React.FC<PropsWithChildren<ButtonProps>> = (props: ButtonProps) => {
  const {
    variant = 'text', 
    color = 'default', 
    size = 'medium', 
    children, 
    onClick, 
    startIcon,
    endIcon,
  } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const { addRipple } = useRippleEffect();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    addRipple(event, buttonRef);
    onClick?.(event);
  };

  const buttonClass = classNames(
    'btn',
    `btn--${variant}`,
    `btn--${color}`,
    `btn--${size}`
  );

  return (
    <button
      {...props}
      ref={buttonRef}
      className={buttonClass}
      onClick={handleClick}
    >
      {startIcon && <span className="btn-icon start-icon">{startIcon}</span>}
      {children}
      {endIcon && <span className="btn-icon end-icon">{endIcon}</span>}
    </button>
  );
};

export default Button;
