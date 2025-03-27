import React from 'react';

interface SmoothScrollButtonProps {
  targetId: string;
  children: React.ReactNode;
}

const SmoothScrollButton: React.FC<SmoothScrollButtonProps> = ({
  targetId,
  children,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  return (
    <a href={`#${targetId}`} onClick={handleClick}>
      {children}
    </a>
  );
};

export default SmoothScrollButton;
