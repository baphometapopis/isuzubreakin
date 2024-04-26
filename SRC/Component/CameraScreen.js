import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  Alert,
  BackHandler,
  PermissionsAndroid,
} from 'react-native';
import moment from 'moment';

import {RNCamera} from 'react-native-camera';
import {Platform} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {COLOR} from '../Constant/color';
import {useNavigation} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import Geolocation from 'react-native-geolocation-service';

const CustomCamera = prop => {
  const viewShotRef = useRef();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [overlays, setOverlays] = useState(prop.route.params?.imageData);
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const [capturedImagesUri, setCapturedImagesUri] = useState([]);
  const [capturedImages, setCapturedImages] = useState([]);
  const [showOverlay, setShowOverlay] = useState(true);

  const [currentOverlayIndex, setCurrentOverlayIndex] = useState(0);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isInstructionModalVisible, setInstructionModalVisible] =
    useState(true);

  const showNextOverlay = () => {
    if (currentOverlayIndex < overlays.length - 1) {
      setCurrentOverlayIndex(currentOverlayIndex + 1);
      setIsPreviewVisible(false);
      setInstructionModalVisible(true);
    } else {
      // Close the camera when overlays end
      closeCamera();
    }
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
          getLocation();
        } else {
        }
      } else {
        // For iOS, permissions are handled differently
        getLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const showPreview = async () => {
    if (cameraRef.current) {
      setShowOverlay(false);
      const options = {quality: 0.5, base64: true};

      const data = await cameraRef.current.takePictureAsync(options);
      setCapturedImagesUri([...capturedImagesUri, data.uri]);
      setIsPreviewVisible(true);
      setInstructionModalVisible(false);
    }
  };

  const closeCamera = images => {
    navigation.navigate('ShowInspectionImages', {
      capturedImagesWithOverlay: capturedImages,
      proposalInfo: prop.route.params?.proposalInfo,
    });
  };

  const takePicture = async () => {
    if (currentOverlayIndex < overlays.length) {
      // onImageSave(fileData);
      // console.log('File information:', fileData);
    }
    const overlayText = overlays[currentOverlayIndex]?.name;
    const overlayTextid = overlays[currentOverlayIndex]?.id;
    const textimage = await viewShotRef.current.capture();

    const timestamp = new Date().getTime();
    const fileName = `${overlayText}.jpg`;
    const fileData = {
      uri: textimage, // Use the last captured image URI
      type: 'image/jpeg',
      name: fileName,
      part: overlayText,
      image_id: overlayTextid,
    };
    setCapturedImages([...capturedImages, fileData]);
    showNextOverlay();
  };

  // const onCancel = () => {
  //   closeCamera();
  // };

  const retakePicture = () => {
    const updatedCapturedImagesUri = [...capturedImagesUri];
    updatedCapturedImagesUri.pop(); // Remove the last captured image URI
    setCapturedImagesUri(updatedCapturedImagesUri);

    // setCurrentOverlayIndex(currentOverlayIndex - 1); // Go back to the previous overlay
    setIsPreviewVisible(false);
    setInstructionModalVisible(true);
  };

  useEffect(() => {
    // Lock the orientation to landscape when the component mounts
    Orientation.lockToLandscape();

    // Unlock the orientation when the component unmounts
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, [isPreviewVisible, capturedImages, capturedImagesUri, showOverlay]);
  useEffect(() => {
    const onBackPress = () => {
      // Show an alert when the user tries to go back

      Alert.alert(
        'Alert',
        'Are you sure you want to leave,if You go back your saved photos wont be uploaded till you finish the full process?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('NewInspection');
            },
          },
        ],
        {cancelable: false},
      );
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        visible={isInstructionModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalContent}>
          <View style={styles.instructionimagecontainer}>
            <Image
              source={{uri: overlays[currentOverlayIndex]?.sample_image_url}}
              style={{height: 200, width: 200}}
            />
            <Text style={styles.imagelabel}>
              {overlays[currentOverlayIndex]?.name}
            </Text>
          </View>
          <View style={styles.instructionpointscontaoner}>
            <View>
              <Text style={styles.modalText}>
                Please follow the instructions to capture Image
              </Text>
              <Text style={styles.additionalInstructions}>
                {'\u2022'} The Image has to be captured during the daylight.
                Image captured in basements or shades (ex. tree shades) will not
                be valid.
              </Text>
              <Text style={styles.additionalInstructions}>
                {'\u2022'} Please keep your car Turned ON for 10 seconds and
                then Start Taking Imagesa
              </Text>
              <Text style={styles.additionalInstructions}>
                {'\u2022'} A Reference Image is placed in the Middle of the
                Camera while capturing Image
              </Text>
              {/* <Text style={styles.additionalInstructions}>
              {'\u2022'} The video has to be captured during the daylight.
              Videos captured in basements or shades (ex. tree shades) will not
              be valid.
            </Text> */}
              <Text style={styles.additionalInstructions}>
                {'\u2022'} Click on Ok When Your are Ready
              </Text>
            </View>
            <TouchableOpacity onPress={() => setInstructionModalVisible(false)}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isPreviewVisible ? (
        <ViewShot ref={viewShotRef} style={styles.previewContainer}>
          {capturedImagesUri.length > 0 ? (
            <View style={{flex: 1}}>
              <Image
                style={styles.previewImage}
                source={{uri: capturedImagesUri[capturedImagesUri.length - 1]}}
              />
              <Text style={styles.viewshotlabeltime}>
                Time: {moment().format('MMMM Do YYYY, h:mm a')}
              </Text>
              <Text style={styles.viewshotlabellat}>
                lat:{latitude}/long:{longitude}
              </Text>
            </View>
          ) : null}
        </ViewShot>
      ) : (
        <View style={styles.previewContainer}>
          <Text style={styles.overlayText}>
            {`Overlay ${currentOverlayIndex + 1} - ${
              overlays[currentOverlayIndex]?.name
            }`}
          </Text>
          <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            captureAudio={false}
            flashMode={RNCamera.Constants.FlashMode.off}
          />
          <View style={styles.overlayContainer}>
            {overlays?.map((overlay, index) => (
              <View key={index} style={styles.overlayItem}>
                <Image
                  source={{uri: overlay?.sample_image_url}}
                  style={{width: 30, height: 30}}
                />

                {/* <Text>{overlay?.name}</Text> */}
              </View>
            ))}
          </View>
        </View>
      )}
      {currentOverlayIndex < overlays?.length && !isPreviewVisible && (
        <Image
          source={{
            uri: overlays[currentOverlayIndex]?.sample_image_url,
          }}
          style={styles.caroverlayimage}
        />
      )}
      {!isPreviewVisible ? null : (
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={retakePicture} style={styles.retakeButton}>
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.saveButton}>
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity> */}
        </View>
      )}
      <View style={styles.capturebuttonContainer}>
        {currentOverlayIndex < overlays?.length && !isPreviewVisible ? (
          <TouchableOpacity onPress={showPreview} style={styles.captureButton}>
            <Text style={styles.captureButtonText}>Capture</Text>
          </TouchableOpacity>
        ) : null}

        {/* {currentOverlayIndex < overlays.length && !isPreviewVisible ? (
          <TouchableOpacity
            onPress={onCancelCamera}
            style={styles.cancelcamera}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        ) : null} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  capturebuttonContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 120,
  },
  imagelabel: {color: 'black'},
  instructionpointscontaoner: {flex: 0.6, justifyContent: 'space-between'},
  instructionimagecontainer: {
    justifyContent: 'center',
    flex: 0.4,
  },
  caroverlayimage: {
    position: 'absolute',
    alignSelf: 'center',
    top: 80,
    height: 225,
    width: 225,
    opacity: 0.5, // Adjust the opacity as needed
    resizeMode: 'contain',
  },
  viewshotlabellat: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: 'red',
    fontSize: 20,
  },
  viewshotlabeltime: {
    position: 'absolute',
    top: 10,
    left: 10,
    color: 'red',
    fontSize: 20,
  },
  container: {
    flex: 1,
    // flexDirection: 'column',
    backgroundColor: 'black',
  },
  previewContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  overlayContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
  },
  additionalInstructions: {color: 'black'},
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5, // Adjust the opacity as needed
    resizeMode: 'contain',
  },

  overlayItem: {
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  captureButton: {
    // alignSelf: 'center',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelcamera: {
    alignSelf: 'center',
    margin: 20,
    backgroundColor: 'red',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: COLOR.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  captureButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
  },
  retakeButton: {
    backgroundColor: 'orange',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    height: '95%',
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignSelf: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: COLOR.PRIMARY,
  },
  okButtonText: {
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLOR.PRIMARY,
    marginVertical: 10,
  },
});

export default CustomCamera;
