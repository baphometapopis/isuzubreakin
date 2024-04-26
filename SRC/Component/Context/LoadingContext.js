import React, {createContext, useState} from 'react';

// Create the context
const LoadingContext = createContext();

// Create a provider for components to consume and update the loading state
export const LoadingProvider = ({children}) => {
  const [loading, setLoading] = useState(false);

  const enableLoader = () => setLoading(true);
  const disableLoader = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{loading, enableLoader, disableLoader}}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
