import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {IconClose, SampleImage} from '../../Constant/ImageConstant';
import {COLOR} from '../../Constant/color';
import {fetch_Image_inspection_question} from '../../Api/fetchQuestion';
import {useNavigation} from '@react-navigation/native';
import CustomCamera from '../CameraScreen';

const InspectionModalRules = ({isVisible, onClose, proposalData, isVideo}) => {
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [isErrorVisible, setisErrorVisible] = useState(false);
  const navigation = useNavigation();

  const openCamera = async () => {
    onClose();

    const fetchData = await fetch_Image_inspection_question();
    if (fetchData.status) {
      if (isVideo) {
        navigation.navigate('videomodule', {
          proposalInfo: proposalData,
        });
      } else {
        navigation.navigate('cameramodule', {
          imageData: fetchData?.data?.filter(item => item.is_mand === '1'),
          proposalInfo: proposalData,
        });
        setCameraVisible(true);
      }
    } else {
      setisErrorVisible(true);
    }
  };

  useEffect(() => {}, [isErrorVisible, isCameraVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        {/* {isCameraVisible && (
          <CustomCamera data={fetchedImageQuestion} onClose={closeCamera} />
        )} */}
        <View style={styles.modalView}>
          <TouchableOpacity
            style={{position: 'absolute', right: 15, top: 15}}
            onPress={onClose}>
            <Image
              source={IconClose}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Guideline</Text>
          <Text
            style={[
              styles.modalText,
              {
                textAlign: 'center',
                fontSize: 16,
                color: COLOR.TEXT_COLOR,
                fontWeight: '500',
              },
            ]}>
            Follow these steps for the self-inspection process to be successful
          </Text>
          <Image source={SampleImage} style={styles.image} />
          <ScrollView style={{maxHeight: 300}}>
            <Text style={styles.scrollIndicator}>
              Scroll down for more details
            </Text>

            {isVideo ? (
              <View>
                <Text style={styles.modalPoint}>
                  -> The video has to be captured during the daylight. Videos
                  captured in basements or shades (ex. tree shades) will not be
                  valid..
                </Text>
                <Text style={styles.modalPoint}>
                  ->Ensure you capture the Engine number, Chassis number and
                  odometer reading as part of the video.
                </Text>
                <Text style={styles.modalPoint}>
                  -> In case of any dent or scratches, please capture it Clearly.
                </Text>
                <Text style={styles.modalPoint}>
                  -> The RC copy and Previous Year Policy (if applicable) should
                  be captured in the video either at the start or end.
                </Text>
                <Text style={styles.modalPoint}>
                  -> Make sure you have high speed internet connection for a
                  faster upload.
                </Text>
                <Text style={styles.modalPoint}>
                  -> Review and submit the application.
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.modalPoint}>
                  -> Follow the handy guide to identify the chassis number and
                  engine number of your vehicle.
                </Text>
                <Text style={styles.modalPoint}>
                  -> Find out the car's chassis number that is engraved under
                  the front bonnet of the car. However, in some cars, it is
                  found next to the driver's door of the passenger's door.Ensure
                  the chassis number is on the car's body, not on a sticker of
                  the car's window.
                </Text>
                <Text style={styles.modalPoint}>
                  ->Keep the car's Registration Certificate (RC) and the
                  Previous Year Policy (PYP) documents handy as you need to
                  Capture these in the self-inspection .
                </Text>
                <Text style={styles.modalPoint}>
                  ->Clean your car's windshield and windows.
                </Text>
                <Text style={styles.modalPoint}>
                  -> Check if your vehicle is parked in an open area with good
                  sunlight for best quality photos.
                </Text>
                <Text style={styles.modalPoint}>
                  -> As per the instructions on the screen, shoot a continuous
                  photo of the vehicle.
                </Text>
                <Text style={styles.modalPoint}>
                  -> Click photos of the vehicle according to the guide marks
                  shown on the screen. This will help the Artificial
                  Intelligence engine and inspection team behind the app to
                  identify your vehicle condition.
                </Text>
                <Text style={styles.modalPoint}>
                  -> Review and submit the application.
                </Text>
              </View>
            )}
          </ScrollView>
          <TouchableOpacity
            style={{...styles.button, backgroundColor: '#2196F3'}}
            onPress={openCamera}>
            <Text style={styles.textStyle}>
              {isVideo ? 'Start Video' : 'Start Camera'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 150,
    resizeMode: 'center',
    borderRadius: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Red background with 30% opacity
  },
  modalView: {
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLOR.TEXT_COLOR,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalPoint: {
    fontSize: 14,
    marginVertical: 5,
    marginLeft: 5,
    color: COLOR.TEXT_COLOR,
    textAlign: 'justify',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollIndicator: {
    fontSize: 14,
    marginBottom: 10,
    color: '#888',
    textAlign: 'center',
  },
});

export default InspectionModalRules;
