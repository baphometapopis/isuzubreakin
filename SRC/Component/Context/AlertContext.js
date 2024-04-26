import React, {createContext, useState, useContext} from 'react';

const AlertContext = createContext();

export const AlertProvider = ({children}) => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = message => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    setAlertMessage('');
  };

  return (
    <AlertContext.Provider
      value={{isAlertVisible, alertMessage, showAlert, hideAlert}}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};
