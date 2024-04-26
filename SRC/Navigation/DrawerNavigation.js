// DrawerNavigation.js
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import StackNavigation from './StackNavigation'; // Import the stack navigation file
import {CustomDrawerContent} from '../Component/CustomDrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Main" component={StackNavigation} />
      {/* Add more drawer screens as needed */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
