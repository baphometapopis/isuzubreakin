import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigation from './SRC/Navigation/DrawerNavigation';
import Orientation from 'react-native-orientation-locker';
import {View} from 'react-native';
import NoInternetPage from './SRC/Screens/NoInternetPage';
import {useNetInfo} from '@react-native-community/netinfo';

const App = () => {
  const netInfo = useNetInfo();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Lock the orientation to portrait when the component mounts
    Orientation.lockToPortrait();

    // Unlock the orientation when the component unmounts
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  useEffect(() => {
    // Update the connection status
    setIsConnected(netInfo.isConnected);
  }, [netInfo.isConnected]);

  const checkInternetConnection = async () => {
    try {
      const response = await fetch('https://www.google.com');
      setIsConnected(response.status === 200);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const handleRetry = () => {
    checkInternetConnection();
  };

  return (
    <NavigationContainer>
      {isConnected ? (
        <DrawerNavigation />
      ) : (
        <View style={{flex: 1}}>
          <NoInternetPage onRetry={handleRetry} />
        </View>
      )}
    </NavigationContainer>
  );
};

export default App;
