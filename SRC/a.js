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
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {captureRef} from 'react-native-view-shot';
import TextGradient from 'react-native-text-gradient';

const CustomCamera = props => {
  const [overlays, setOverlays] = useState(props.route.params?.imageData);
  const cameraRef = useRef(null);
  const [capturedImagesUri, setCapturedImagesUri] = useState([]);
  const [capturedImages, setCapturedImages] = useState([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const [currentOverlayIndex, setCurrentOverlayIndex] = useState(0);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isInstructionModalVisible, setInstructionModalVisible] =
    useState(true);

  const showPreview = async () => {
    if (cameraRef.current) {
      setShowOverlay(false);

      const options = {quality: 0.5, base64: true};
      const overlayText = overlays[currentOverlayIndex]?.name;
      const overlayTextid = overlays[currentOverlayIndex]?.id;

      const data = await cameraRef.current.takePictureAsync(options);

      const imageWithText = (
        <View style={{flex: 1}}>
          <Image source={{uri: data.uri}} style={{flex: 1}} />
          <TextGradient
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              fontSize: 24,
            }}
            colors={['#FF5733', '#FFC300']}
            locations={[0, 1]}>
            {overlayText}
          </TextGradient>
        </View>
      );

      const uri = await captureRef(cameraRef, {
        format: 'jpg',
        quality: 0.8,
        result: 'base64',
      });

      setCapturedImagesUri([...capturedImagesUri, uri]);

      const timestamp = new Date().getTime();
      const fileName = `${overlayText}.jpg`;
      const fileData = {
        uri: `data:image/jpeg;base64,${uri}`,
        type: 'image/jpeg',
        name: fileName,
        part: overlayText,
        image_id: overlayTextid,
      };
      setCapturedImages([...capturedImages, fileData]);
      setIsPreviewVisible(true);
      setInstructionModalVisible(false);
    }
  };

  const showNextOverlay = () => {
    if (currentOverlayIndex < overlays.length - 1) {
      setCurrentOverlayIndex(currentOverlayIndex + 1);
      setIsPreviewVisible(false);
      setInstructionModalVisible(true);
    } else {
      saveCapturedImages();
      closeCamera();
    }
  };

  const saveCapturedImages = () => {
    console.log('Captured Images:', capturedImagesUri);
    // Logic to save captured images in an array or perform any other actions
    // You can use the capturedImagesUri state for further processing
  };

  const closeCamera = () => {
    props.navigation.navigate('ShowInspectionImages', {
      capturedImagesWithOverlay: capturedImages,
      proposalInfo: props.route.params?.proposalInfo,
    });
  };

  const takePicture = async () => {
    if (currentOverlayIndex < overlays.length) {
      showNextOverlay();
    }
  };

  const onCancel = () => {
    closeCamera();
  };

  const retakePicture = () => {
    setCapturedImagesUri([]);
    setCurrentOverlayIndex(0);
    setIsPreviewVisible(false);
    setInstructionModalVisible(true);
  };

  useEffect(() => {
    return () => {
      // Clean up on unmount
      setCapturedImagesUri([]);
      setCapturedImages([]);
      setCurrentOverlayIndex(0);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        visible={isInstructionModalVisible}
        animationType="slide"
        transparent={true}>
        {/* Your modal content */}
      </Modal>

      {isPreviewVisible ? (
        <View style={styles.previewContainer}>
          {capturedImagesUri.length > 0 ? (
            <Image
              style={styles.previewImage}
              source={{uri: capturedImagesUri[capturedImagesUri.length - 1]}}
            />
          ) : null}
        </View>
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
        </View>
      )}

      {!isPreviewVisible ? null : (
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={retakePicture} style={styles.retakeButton}>
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.saveButton}>
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentOverlayIndex < overlays.length && !isPreviewVisible ? (
        <TouchableOpacity onPress={showPreview} style={styles.captureButton}>
          <Text style={styles.captureButtonText}>Capture</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
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
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
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
  captureButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default CustomCamera;
