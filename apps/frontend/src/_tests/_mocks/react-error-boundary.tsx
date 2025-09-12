// React Error Boundary 모킹
import React from 'react';

export const ErrorBoundary = ({ children, fallback }: { children: React.ReactNode; fallback: unknown }) => {
  return children || fallback || React.createElement('div', {}, 'Error Boundary Mock');
};

export default ErrorBoundary;
