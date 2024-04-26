import React, {useRef, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import {saveImagestoLocalStorage} from '../Utils/saveInspectionImages';

const AddTextToImage = () => {
  const viewShotRef = useRef();
  const [imageURI, setImageURI] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleCapture = async camera => {
    if (camera) {
      const options = {quality: 0.5, base64: true};
      const data = await camera.takePictureAsync(options);
      setImageURI(data.uri);
      setIsCameraOpen(false);

      // Save the image with text
      saveImage(data.uri);
    }
  };

  const saveImage = async uri => {
    const dest = `${RNFS.DocumentDirectoryPath}/modified_image.jpg`;

    try {
      saveImagestoLocalStorage('Testingl;kjhvgcf', [
        {name: 'modified_image.jpg', uri},
      ]);
      await RNFS.copyFile(uri, dest);
      Alert.alert('Image Saved', `Image saved to ${dest}`);
      listFilesInDirectory();
    } catch (error) {
      console.error('Error saving image: ', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const listFilesInDirectory = async () => {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      console.log('Files in Document Directory: ', files);
    } catch (error) {
      console.error('Error reading directory: ', error);
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {isCameraOpen ? (
        <RNCamera
          style={{flex: 1, width: '100%'}}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          ref={ref => {
            cameraRef = ref;
          }}>
          {({camera}) => (
            <View
              style={{flex: 1, justifyContent: 'flex-end', marginBottom: 20}}>
              <TouchableOpacity
                onPress={() => handleCapture(camera)}
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'blue',
                  borderRadius: 50,
                  padding: 20,
                }}>
                <Text style={{color: '#fff'}}> Capture </Text>
              </TouchableOpacity>
            </View>
          )}
        </RNCamera>
      ) : imageURI ? (
        <ViewShot ref={viewShotRef} style={{width: 300, height: 300}}>
          <Image source={{uri: imageURI}} style={{width: 300, height: 300}} />
          <Text
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              color: 'white',
              fontSize: 20,
            }}>
            Your Text Here
          </Text>
        </ViewShot>
      ) : (
        <TouchableOpacity
          onPress={() => setIsCameraOpen(true)}
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: 'blue',
            borderRadius: 5,
          }}>
          <Text style={{color: 'white', fontSize: 16}}>Open Camera</Text>
        </TouchableOpacity>
      )}

      {imageURI && (
        <TouchableOpacity
          onPress={() => {
            viewShotRef.current.capture().then(uri => saveImage(uri));
          }}
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: 'green',
            position: 'absolute',
            borderRadius: 5,
          }}>
          <Text style={{color: 'white', fontSize: 16}}>Add Text and Save</Text>
        </TouchableOpacity>
      )}

      {imageURI && (
        <Image
          source={{uri: imageURI}}
          style={{width: 150, height: 150, marginTop: 20}}
        />
      )}
    </View>
  );
};

export default AddTextToImage;
