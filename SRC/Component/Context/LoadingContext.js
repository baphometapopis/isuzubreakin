import React, { createContext, useState, useEffect } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({children}) => {
  const [loading, setLoading] = useState(false);

  const enableLoader = () => setLoading(true);
  const disableLoader = () => setLoading(false);

  useEffect(() => {
    let timer;
    if (loading) {
      // Set a timer to disable the loader after 1 minute and 30 seconds (90 seconds)
      timer = setTimeout(() => {
        setLoading(false);
      }, 90000); // 90 seconds in milliseconds
    }
    return () => clearTimeout(timer); // Clear the timer when the component unmounts or loading state changes
  }, [loading]);

  return (
    <LoadingContext.Provider value={{loading, enableLoader, disableLoader}}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
