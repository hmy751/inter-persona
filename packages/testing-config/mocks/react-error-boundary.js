// React Error Boundary 모킹
import React from 'react';

export const ErrorBoundary = ({ children, fallback }) => {
  return children || fallback || React.createElement('div', {}, 'Error Boundary Mock');
};

export default ErrorBoundary;