import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  Breakincase,
  Cancellation,
  Endorsement,
  Home,
  Logo1,
  Logout,
  Quotelist,
  RejectedIcon,
  Savedproposal,
  Uploadbreakin,
} from '../Constant/ImageConstant';
import {COLOR} from '../Constant/color';
import {getData} from '../Utils/localStorageData';
import {extractInitials} from '../Utils/extractInitials';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

export const CustomDrawerContent = ({navigation, state}) => {
  const navigateToScreen = screenName => {
    navigation.navigate(screenName);
    navigation.closeDrawer(); // Close the drawer after navigating
  };
  const [loginData, setloginData] = useState({});
  const [Initials, setInitials] = useState('');

  const getLocalData = async () => {
    const localdata = await getData('loggedInUser');
    setloginData(localdata);
    console.log('loggedInUser Drawer COntent', localdata);

    const initialsdata = extractInitials(localdata?.pos_login_data?.full_name);

    setInitials(initialsdata);
  };
  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });

      console.log('OK pressed');
    } catch (e) {
      // clear error
      console.log(e);
    }

    console.log('Done.');
  };

  useEffect(() => {
    getLocalData();
  }, []);

  useEffect(() => {}, [loginData, Initials]);
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Drawer Header */}
      <View style={styles.headerContainer}>
        <Image
          source={Logo1}
          style={{
            height: 50,
            width: 250,
            alignSelf: 'center',
          }}
        />
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 25,
            gap: 10,
          }}>
          <TouchableOpacity style={styles.namecnt}>
            <Text style={{fontSize: 22, color: '#705656'}}>{Initials}</Text>
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Text style={{color: COLOR.TEXT_COLOR, fontSize: 16}}>
              {loginData?.pos_login_data?.full_name}
            </Text>
            <Text style={{color: COLOR.TEXT_COLOR, fontSize: 12}}>
              {loginData?.pos_login_data?.email}
            </Text>
          </View>
        </View> */}
      </View>

      {/* Drawer Body (Menu) */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen('Dashboard')}>
          <Image
            source={Home}
            style={{width: 24, height: 24, marginRight: 10}}
          />
          <Text
            style={[
              styles.menuText,
              {color: state.index === 0 ? 'blue' : 'black'},
            ]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen('NewInspection')}>
          <Image
            source={Quotelist}
            style={{width: 24, height: 24, marginRight: 10}}
          />
          <Text style={[styles.menuText]}>New Inspection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen('progressInspection')}>
          <Image
            source={Breakincase}
            style={{width: 24, height: 24, marginRight: 10}}
          />
          <Text style={[styles.menuText]}>In Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen('ReferBackScreen')}>
          <Image
            source={Breakincase}
            style={{width: 24, height: 24, marginRight: 10}}
          />
          <Text style={[styles.menuText]}>Refer Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen('RejectedInspection')}>
          <Image
            source={RejectedIcon}
            style={{width: 24, height: 24, marginRight: 10}}
          />
          <Text style={[styles.menuText]}>Rejected</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen('Savedproposal')}>
          <Image
            source={Savedproposal}
            style={{width: 24, height: 24, marginRight: 10}}
          />
          <Text style={[styles.menuText]}>Refer Back</Text>
        </TouchableOpacity> */}

        {/* Add more menu items as needed */}
      </View>

      {/* Drawer Footer (Logout) */}
      <TouchableOpacity
        style={styles.footerContainer}
        onPress={() => {
          navigation.closeDrawer();
          Alert.alert(
            'Confirmation',
            'Do you want to Logout ?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  clearAll();
                },
              },
            ],
            {cancelable: false}, // Prevent dismissing the alert by tapping outside of it
          );
        }}>
        <Image
          source={Logout}
          style={{width: 24, height: 24, marginRight: 10}}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  namecnt: {
    borderWidth: 1,
    borderColor: '#705656',
    backgroundColor: '#FFE3E3',
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerStyle: {
    width: '80%', // Adjust the width of the drawer as needed
  },
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: COLOR.BACKGROUND_COLOR, // Set the background color of the header
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    marginVertical: 2,
    paddingVertical: 10,
    height: 48,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    // backgroundColor: 'red',
    flexDirection: 'row',
  },
  menuText: {
    fontSize: 16,
    color: COLOR.TEXT_COLOR,
  },
  footerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#FFF2F2', // Set the background color of the footer
    flexDirection: 'row',
  },
  logoutText: {
    fontSize: 16,
    color: 'red',
  },
});
