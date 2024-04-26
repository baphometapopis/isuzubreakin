// HeaderContext.js
import React, {createContext, useContext, useState} from 'react';

const HeaderContext = createContext();

export const HeaderProvider = ({children}) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const toggleHeaderVisibility = () => {
    setIsHeaderVisible(prev => !prev);
  };

  return (
    <HeaderContext.Provider value={{isHeaderVisible, toggleHeaderVisibility}}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};
