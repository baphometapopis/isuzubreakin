import React, {useRef, useState, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Orientation from 'react-native-orientation-locker';

const CameraScreen = () => {
  const cameraRef = useRef(null);
  const overlays = [
    {
      image: {
        uri: 'https://demo.mypolicynow.com/api/images/breakin_sample_image/Undercarriage.jpg',
      },
      text: 'Overlay 1',
    },
    {
      image: {
        uri: 'https://demo.mypolicynow.com/api/images/breakin_sample_image/ODOMETER.jpeg',
      },
      text: 'Overlay 2',
    },
    {
      image: {
        uri: 'https://demo.mypolicynow.com/api/images/breakin_sample_image/Engraved-Chassis.jpg',
      },
      text: 'Overlay 3',
    },
    {
      image: {
        uri: 'https://demo.mypolicynow.com/api/images/breakin_sample_image/ODOMETER.jpeg',
      },
      text: 'Overlay 2',
    },
    {
      image: {
        uri: 'https://demo.mypolicynow.com/api/images/breakin_sample_image/ODOMETER.jpeg',
      },
      text: 'Overlay 2',
    },
    {
      image: {
        uri: 'https://demo.mypolicynow.com/api/images/breakin_sample_image/ODOMETER.jpeg',
      },
      text: 'Overlay 2',
    },
    {
      image: {
        uri: 'https://demo.mypolicynow.com/api/images/breakin_sample_image/ODOMETER.jpeg',
      },
      text: 'Overlay 2',
    },
    {
      image: {
        uri: 'https://demo.mypolicynow.com/api/images/breakin_sample_image/ODOMETER.jpeg',
      },
      text: 'Overlay 2',
    },

    // Add more overlays as needed
  ];

  const [overlayIndex, setOverlayIndex] = useState(0);
  const [capturedImages, setCapturedImages] = useState([]);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data);

      // Process the captured image data, you can save it, send it to a server, etc.
      setCapturedImages(prevImages => [...prevImages, data]);

      // Move to the next overlay
      setOverlayIndex(prevIndex => (prevIndex + 1) % overlays.length);
    }
  };

  useEffect(() => {
    // Lock the orientation to landscape when the component mounts
    Orientation.lockToLandscape();

    // Unlock the orientation when the component unmounts
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <RNCamera
        ref={ref => {
          cameraRef.current = ref; // Assign the ref to the current property of the ref object
        }}
        style={{flex: 1}}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}>
        {({camera, status}) => {
          if (status !== 'READY') return <Text>Waiting...</Text>;

          return (
            <View style={{flex: 1}}>
              {/* Your camera preview */}
              <RNCamera
                ref={camera}
                style={{flex: 1}}
                type={RNCamera.Constants.Type.back}
              />

              {/* Your overlay array at the top */}
              <View style={styles.overlayContainer}>
                {overlays.map((overlay, index) => (
                  <View key={index} style={styles.overlayItem}>
                    <Image
                      source={overlay.image}
                      style={{width: 50, height: 50}}
                    />
                    <Text>{overlay.text}</Text>
                  </View>
                ))}
              </View>

              {/* Captured images */}
              <View style={styles.capturedImagesContainer}>
                {capturedImages.map((image, index) => (
                  <Image
                    key={index}
                    source={{uri: image.uri}}
                    style={styles.capturedImage}
                  />
                ))}
              </View>

              {/* Capture button */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 20,
                  alignSelf: 'center',
                  backgroundColor: 'white',
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={handleCapture}>
                <Text>Capture</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
  },
  overlayItem: {
    alignItems: 'center',
  },
  capturedImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
  },
  capturedImage: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
  },
});

export default CameraScreen;
