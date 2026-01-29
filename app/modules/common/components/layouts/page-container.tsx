import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'full' | '7xl' | '6xl' | '5xl';
  className?: string;
}

export function PageContainer({ 
  children, 
  maxWidth = '7xl',
  className = '' 
}: PageContainerProps) {
  const widthClasses = {
    full: 'w-full',
    '7xl': 'max-w-7xl',
    '6xl': 'max-w-6xl',
    '5xl': 'max-w-5xl',
  };
  
  return (
    <div className={`mx-auto w-full ${widthClasses[maxWidth]} space-y-6 ${className}`}>
      {children}
    </div>
  );
}
