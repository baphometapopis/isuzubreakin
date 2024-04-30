import {useNavigation, useFocusEffect} from '@react-navigation/native';
import React, {useRef, useState, useEffect} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Orientation from 'react-native-orientation-locker';

const VideoRecorder = ({route}) => {
  const cameraRef = useRef(null);
  const [isRecording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [timer, setTimer] = useState(90); // 1 minute and 30 seconds
  const navigate = useNavigation();
  const {proposalInfo} = route.params;
  console.log(proposalInfo);

  // Reset videoUri when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setVideoUri(null);
    }, []),
  );

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            stopRecording();
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    if (cameraRef.current) {
      setRecording(true);

      const options = {quality: RNCamera.Constants.VideoQuality['480p']};
      const data = await cameraRef.current.recordAsync(options);

      setVideoUri(data.uri);
      setRecording(false);
      setTimer(90); // Reset the timer after recording

      // Navigate to the video preview screen with the video URI
      // navigate.navigate('VideoPreview', {
      //   videoUri: data.uri,
      //   proposalInfo: proposalInfo,
      // });
      navigate.reset({
        index: 0,
        routes: [
          {
            name: 'VideoPreview',
            params: {
              videoUri: data.uri,
              proposalInfo: proposalInfo,
            },
          },
        ],
      });
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      setRecording(false);
      cameraRef.current.stopRecording();

      // You can save the recorded video here, e.g., using AsyncStorage or a server API
    }
  };
  Orientation.lockToLandscape();

  useEffect(() => {
    // Lock the orientation to landscape when the component mounts

    // Unlock the orientation when the component unmounts
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);
  return (
    <View style={{flex: 1}}>
      <RNCamera
        ref={cameraRef}
        style={{flex: 1}}
        type={RNCamera.Constants.Type.back}
        captureAudio={true}
        orientation={RNCamera.Constants.Orientation.landscapeRight}
      />

      <View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          justifyContent: 'center',
          right: 20,
          top: 125,
        }}>
        <Text style={{fontSize: 20, color: 'white'}}>
          {Math.floor(timer / 60)}:
          {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
        </Text>

        {isRecording ? (
          <TouchableOpacity
            onPress={stopRecording}
            style={{
              backgroundColor: 'white',
              padding: 5,
              borderRadius: 8,
              padding: 25,
              borderRadius: 50,
            }}>
            <Text
              style={{
                fontSize: 20,
                color: 'red',
              }}>
              Stop
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={startRecording}
            style={{backgroundColor: 'white', padding: 20, borderRadius: 50}}>
            <Text style={{fontSize: 20, color: 'green'}}>Rec</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default VideoRecorder;
