// App.js
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigation from './SRC/Navigation/DrawerNavigation';
import Orientation from 'react-native-orientation-locker';

const App = () => {
  useEffect(() => {
    // Lock the orientation to landscape when the component mounts
    Orientation.lockToPortrait();

    // Unlock the orientation when the component unmounts
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);
  return (
    <NavigationContainer>
      <DrawerNavigation />
    </NavigationContainer>
  );
};

export default App;
