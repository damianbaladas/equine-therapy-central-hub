
import React from 'react';
import { LucideProps } from 'lucide-react';

export const HorseSaddle: React.FC<LucideProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 8.5a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0z" />
      <path d="M15.25 5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0z" />
      <path d="M20 17.5c-3-1-4.5-3-4.5-3l-1-.5h-2c-3 0-5.5 2-5.5 2" />
      <path d="M19 15.5c-2-1-7-1-7-1h-4l-2 3" />
    </svg>
  );
};

export default HorseSaddle;
