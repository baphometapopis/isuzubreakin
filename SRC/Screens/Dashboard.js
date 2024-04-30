import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLOR} from '../Constant/color';
import {
  DrawerIcon,
  IconPhone,
  Info1,
  Inprogress,
  NewInspection,
  Rejected,
  Odometer,
  ReferBAck,
} from '../Constant/ImageConstant';
import CustomCamera from '../Component/CameraScreen';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import CustomAlert from '../Component/Modal/AlertModal';
import {fetch_Image_inspection_question} from '../Api/fetchQuestion';
import {loginAPi} from '../Api/loginApi';
import localStorageData, {getData, storeData} from '../Utils/localStorageData';
import {extractInitials} from '../Utils/extractInitials';
import {fetchProposalCounter} from '../Api/proposalcounterApi';

export const DashboardScreen = () => {
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [proposalCounter, setproposalCounter] = useState({
    Pending: '',
    inprocess: '',
    referback: '',
    rejected: '',
  });
  const [Initials, setInitials] = useState();
  const [loginData, setloginData] = useState();

  const navigation = useNavigation();
  const [isErrorVisible, setisErrorVisible] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState('');
  const toggleErrorAlert = () => {
    setisErrorVisible(!isErrorVisible);
  };

  const getLocalData = async () => {
    const localdata = await getData('loggedInUser');
    setloginData(localdata);

    const initialsdata = extractInitials(localdata?.pos_login_data?.full_name);

    setInitials(initialsdata);
    const proposolcounterdata = await fetchProposalCounter(
      localdata?.pos_login_data?.id,
      localdata?.pos_login_data?.business_id,
    );
    if (proposolcounterdata?.status) {
      setproposalCounter({
        Pending: proposolcounterdata?.data?.Pending,
        inprocess: proposolcounterdata?.data?.inprocess,
        referback: proposolcounterdata?.data?.referback,
        rejected: proposolcounterdata?.data?.rejected,
      });
    }
    console.log(proposolcounterdata);
  };

  useEffect(() => {
    getLocalData();
  }, []);
  return (
    <View style={styles.container}>
      <CustomAlert
        visible={isErrorVisible}
        message={ErrorMessage}
        onClose={toggleErrorAlert}
      />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Image
            style={{height: 25, width: 25, margin: 10}}
            source={DrawerIcon}
            accessible={true}
            accessibilityLabel="Open Drawer"
          />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            // onPress={() => navigation.navigate('AddTextToImage')}
            style={styles.nameContainer}>
            <Text
              style={styles.initialsText}
              accessibilityLabel="User Initials">
              {Initials}
            </Text>
          </TouchableOpacity>
          <View style={styles.userInfoContainer}>
            <Text
              style={styles.userNameText}
              accessibilityLabel="User Full Name">
              {loginData?.pos_login_data?.full_name}
            </Text>
            <Text style={styles.userEmailText} accessibilityLabel="User Email">
              {loginData?.pos_login_data?.email}
            </Text>
          </View>
        </View>
        <View style={styles.phoneContainer}>
          <Image source={IconPhone} style={styles.phoneIcon} />
          <Text
            style={styles.phoneNumberText}
            accessibilityLabel="User Phone Number">
            {loginData?.pos_login_data?.mobile_no}
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap', // Add this to wrap the items to the next line
            marginTop: 15,
            gap: 25,
            paddingHorizontal: 20, // Add horizontal padding
          }}>
          {/* First Card */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('NewInspection')}
            style={[styles.optionCard, {flexBasis: '45%'}]}
            accessibilityLabel="New Inspection Button">
            {proposalCounter?.Pending && (
              <View style={styles.badge}>
                <Text style={styles.badgefont}>{proposalCounter?.Pending}</Text>
              </View>
            )}
            <Image
              style={styles.images}
              source={NewInspection}
              accessibilityLabel="New Inspection Image"
            />
            <Text style={{color: COLOR.TEXT_COLOR}}>New Inspection</Text>
          </TouchableOpacity>

          {/* Second Card */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('progressInspection')}
            style={[styles.optionCard, {flexBasis: '45%'}]}
            accessibilityLabel="In Progress Button">
            {proposalCounter?.inprocess && (
              <View style={styles.badge}>
                <Text style={styles.badgefont}>
                  {proposalCounter?.inprocess}
                </Text>
              </View>
            )}
            <Image
              style={styles.images}
              source={Inprogress}
              accessibilityLabel="In Progress Image"
            />
            <Text style={{color: COLOR.TEXT_COLOR}}>InProgress</Text>
          </TouchableOpacity>

          {/* Third Card */}
          <TouchableOpacity
            style={[styles.optionCard, {flexBasis: '45%'}]}
            onPress={() => navigation.navigate('ReferBackScreen')}
            accessibilityLabel="Refer Back Button">
            {proposalCounter?.referback && (
              <View style={styles.badge}>
                <Text style={styles.badgefont}>
                  {proposalCounter?.referback}
                </Text>
              </View>
            )}
            <Image
              style={styles.images}
              source={ReferBAck}
              accessibilityLabel="Refer Back Image"
            />
            <Text style={{color: COLOR.TEXT_COLOR}}>Refer Back</Text>
          </TouchableOpacity>

          {/* Fourth Card */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('RejectedInspection')}
            style={[styles.optionCard, {flexBasis: '45%'}]}
            accessibilityLabel="Rejected Button">
            {proposalCounter?.rejected && (
              <View style={styles.badge}>
                <Text style={styles.badgefont}>
                  {proposalCounter?.rejected}
                </Text>
              </View>
            )}
            <Image
              style={styles.images}
              source={Rejected}
              accessibilityLabel="Rejected Image"
            />
            <Text style={{color: COLOR.TEXT_COLOR}}>Rejected</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.InfoCard}>
          <Image
            style={{
              height: '100%',
              width: '100%',
              resizeMode: 'center',
            }}
            source={Info1}
            accessibilityLabel="Information Image"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLOR.PRIMARY,
    width: 25,
    height: 25,
    position: 'absolute',
    top: 2,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    right: 4,
    borderRadius: 15,
  },
  badgefont: {
    color: 'white',
  },
  optionCard: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 8,
    // width: '45%',
    // margin: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  InfoCard: {
    overflow: 'hidden',
    flex: 1,
    padding: 25,
    margin: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  images: {width: 80, height: 80},
  container: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND_COLOR,
  },
  headerContainer: {
    backgroundColor: COLOR.PRIMARY,
    height: 200,
    // justifyContent: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 25,
    marginHorizontal: 10,
    gap: 10,
  },
  nameContainer: {
    borderWidth: 1,
    borderColor: '#705656',
    backgroundColor: '#FFE3E3',
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 22,
    color: '#705656',
  },
  userInfoContainer: {
    flex: 1,
  },
  userNameText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmailText: {
    color: 'white',
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 10,
    right: 5,
    marginRight: 10,
  },
  phoneIcon: {
    height: 20,
    width: 20,
  },
  phoneNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  cameraButtonText: {
    fontSize: 18,
    color: 'blue',
  },
});
