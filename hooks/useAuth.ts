import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  return {
    isAuthenticated,
    isLoading
  };
} 