import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  TextInput,
  Image,
} from 'react-native';
import RNFS from 'react-native-fs';

import Video from 'react-native-video';
import {COLOR} from '../Constant/color';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import {submit_inspection_Video} from '../Api/submitInspectionQuestion';
import CustomLoader from '../Component/Modal/Loader';
import CustomAlert from '../Component/Modal/AlertModal';
import {Odometer} from '../Constant/ImageConstant';
import {submit_odometer_Reading} from '../Api/submitOdometerReading';

const VideoPreview = ({route}) => {
  // const data = props.route.params;
  const {videoUri, proposalInfo} = route.params;

  // console.log(proposalInfo, 'dsdsdsdsdsd');
  const [isErrorVisible, setisErrorVisible] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [uuid, setUUID] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [odometerReading, setOdometerReading] = useState('');

  // const [, setVideoUri] = useState(data?.videoUri);
  const navigation = useNavigation();
  const [ErrorMessage, setErrorMessage] = useState('');
  const toggleErrorAlert = () => {
    setisErrorVisible(!isErrorVisible);
  };
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      error => {
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          getLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        // For iOS, permissions are handled differently
        getLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const submitVideo = async () => {
    if (!odometerReading.trim()) {
      setisErrorVisible(true);
      setErrorMessage('Please enter the odometer reading');
      return;
    }

    setisLoading(true);

    const videopath = {
      uri: videoUri,
      type: 'video/mp4',
      name: 'video.mp4',
    };
    const odometerres = await submit_odometer_Reading(
      odometerReading,
      proposalInfo,
    );
    if (odometerres?.status) {
      const apires = await submit_inspection_Video(videopath, proposalInfo);

      if (apires.status) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
        ToastAndroid.showWithGravityAndOffset(
          apires.message,
          ToastAndroid.TOP,
          ToastAndroid.LONG,
          25,
          50,
        );
      } else {
        setisErrorVisible(true);
        setErrorMessage(apires?.message ?? 'Data upload failed');
      }
    } else {
      setisErrorVisible(true);
      setErrorMessage(odometerres?.message ?? 'odometer not uploaded');
    }
    setisLoading(false);
  };

  useEffect(() => {
    // Get Device UUID
    Orientation.lockToPortrait();

    requestLocationPermission();
    const getUUID = async () => {
      const deviceId = await DeviceInfo.getUniqueId();
      setUUID(deviceId);
    };

    getUUID();

    // Get Geolocation

    // Clean up function
    return () => {
      // Clear location watch
      Orientation.unlockAllOrientations();
      Geolocation.stopObserving();
    };
  }, []);
  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={[styles.input]}
          placeholder="Odometer Reading"
          placeholderTextColor="#6d6d6d"
          onChangeText={text => setOdometerReading(text)}
          value={odometerReading}
          keyboardType="numeric"
        />

        <Image
          style={{
            position: 'absolute',
            height: 54,
            width: 100,
            top: 10,
            left: 11,
          }}
          source={Odometer}
        />
      </View>
      <Text style={styles.text}>Preview you Video Before Submitting</Text>
      <CustomLoader visible={isLoading} />
      <CustomAlert
        visible={isErrorVisible}
        message={ErrorMessage}
        onClose={toggleErrorAlert}
      />
      {videoUri ? (
        <View style={styles.videoContainer}>
          <Video
            source={{uri: videoUri}}
            controls
            style={styles.video}
            repeat={false}
            resizeMode="contain" // or "contain" based on your preference
          />
        </View>
      ) : (
        <Text style={styles.noVideoText}>No video available</Text>
      )}
      <Text style={styles.textLabel}>Latitude: {latitude}</Text>
      <Text style={styles.textLabel}>Longitude: {longitude}</Text>
      <Text style={styles.textLabel}>Device UUID: {uuid}</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          gap: 10,
        }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('videomodule', {
              proposalInfo: proposalInfo,
            })
          }
          style={{
            backgroundColor: 'red',
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginVertical: 20,
            width: '40%',
          }}>
          <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
            Retake
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={submitVideo}
          style={{
            backgroundColor: COLOR.PRIMARY,
            marginVertical: 20,
            padding: 15,
            width: '40%',
            borderRadius: 8,
            height: 'fit-content',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    // width: 50,
    color: COLOR.TEXT_COLOR,
    // height: 65,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 24,
    paddingLeft: 80,
    textAlign: 'center',
    backgroundColor: 'white',
    shadowColor: COLOR.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  container: {
    flex: 1,
  },
  videoContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },

  video: {
    width: '100%',
    height: '100%',
  },
  noVideoText: {
    alignSelf: 'center',
    marginTop: 10,
  },
  text: {
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 12,
    color: COLOR.TEXT_COLOR,
  },
  textLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 5,
    color: COLOR.TEXT_COLOR,
  },
});

export default VideoPreview;
