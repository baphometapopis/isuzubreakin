import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {COLOR} from '../Constant/color';
import {IconCheck, Odometer, PlaceholderImage} from '../Constant/ImageConstant';
import Orientation from 'react-native-orientation-locker';
import {useNavigation} from '@react-navigation/native';
import {saveImagestoLocalStorage} from '../Utils/saveInspectionImages';
import {submit_inspection_Images} from '../Api/submitInspectionQuestion';
import {getData} from '../Utils/localStorageData';
import {
  fetch_Checkpoint_inspection_question,
  fetch_Image_inspection_question,
} from '../Api/fetchQuestion';
import {convertImageToBase64} from '../Utils/convertImagetobase64';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import InspectionModalRules from '../Component/Modal/InspectionModalRules';

const ShowNonMandatoryFields = ({route}) => {
  const [fetchedQuestion, setfetchedQuestion] = useState();
  const [imageData, setimageData] = useState();

  const [isRequestDone, setRequestDone] = useState(false);
  const [submittedImages, setsubmittedImages] = useState([]);
  const [FailedArray, setFailedArray] = useState([]);
  const [isErrorVisible, setisErrorVisible] = useState(false);
  const [unansweredQuestions, setunansweredQuestions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localdata, setLocalData] = useState(false);
  const [totalQuestions, setTotalQuestion] = useState([]);
  const [currentQuestion, setcurrentQuestion] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const navigate = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const {capturedImagesWithOverlay, proposalInfo} = route.params;
  const handleSubmit = () => {
    setIsSubmitted(false); // Reset submitted state
    if (isRequestDone) {
      openModal();
    } else {
      FilterImages();
    }
  };
  const handleImagePress = uri => {
    setSelectedImage(uri);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
  };

  async function submitQuestions(questionDataList) {
    const sortedList = questionDataList.sort((a, b) => {
      const questionIdA = parseInt(a.question_id, 10);
      const questionIdB = parseInt(b.question_id, 10);
      if (questionIdA < questionIdB) {
        return -1;
      } else if (questionIdA > questionIdB) {
        return 1;
      } else {
        return 0;
      }
    });
    setIsLoading(true);
    const failedSubmissionsArray = [];
    const questiondone = [];
    const questiondoneImages = [];

    try {
      for (const questionData of sortedList) {
        const imageinbase64 = await convertImageToBase64(
          questionData?.answer_id,
        );
        let data = {
          break_in_case_id: questionData?.break_in_case_id,
          question_id: questionData?.question_id,
          pos_id: questionData?.pos_id,
          proposal_list_id: questionData?.proposal_list_id,
          ic_id: questionData?.ic_id,
          answer_id: imageinbase64,
          inspection_type: questionData?.inspection_type,
          part: questionData?.part,
        };
        try {
          const submittedresponse = await submit_inspection_Images(
            data,
            'From Submit Function',
          );
          if (submittedresponse?.status) {
            setcurrentQuestion(questionData?.question_id);
            console.log(
              `Question ${questionData?.question_id} submitted successfully`,
            );
            questiondone.push(Number(questionData?.question_id));
            questiondoneImages.push(questionData?.part);
            console.log(
              questionData?.part,
              'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
            );
          } else {
          }
        } catch (error) {
          console.error(
            `Error submitting question ${questionData?.question_id}: ${error.message}`,
          );
        }
      }
      setsubmittedImages(questiondoneImages);

      setSubmittedQuestions(questiondone);
    } catch (error) {
      console.log(`Error submitting questions: ${error.message}`);
    }
    setIsLoading(false);
    setFailedArray(failedSubmissionsArray);
    setRequestDone(true);
  }
  async function FilterImages() {
    const sendPOSTDATA = [];
    for (const questionId of fetchedQuestion) {
      imageData.map(async image => {
        // console.log(questionId.name, image);
        if (image.part === questionId.name) {
          let data = {
            break_in_case_id: proposalInfo?.break_in_case_id,
            question_id: questionId?.id,
            pos_id: localdata?.pos_login_data?.id,
            proposal_list_id: proposalInfo?.id,
            ic_id: proposalInfo?.ic_id,
            answer_id: image?.uri,
            part: image.part,
            inspection_type: proposalInfo?.inspection_type,
          };

          sendPOSTDATA.push(data);
        }
      });
    }
    submitQuestions(sendPOSTDATA);
  }
  const isAllurlNull = () => {
    if (imageData) {
      for (const item of imageData) {
        if (item?.uri !== '') {
          return false;
        }
      }
      return true;
    }
  };
  useEffect(() => {
    // Lock the orientation to landscape when the component mounts
    Orientation.lockToPortrait();

    // Unlock the orientation when the component unmounts
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);
  const handleUpload = prop => {
    console.log(prop);
    if (prop.uri === '') {
      Alert.alert(
        'Upload Image',
        'How do you want to upload the image?',
        [
          {
            text: 'Capture',
            onPress: () => captureImage(prop),
          },
          {
            text: 'Choose from Gallery',
            onPress: () => chooseImage(prop),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      handleImagePress(prop.uri);
    }
  };

  const captureImage = prop => {
    console.log(prop);
    launchCamera(
      {
        mediaType: 'photo',
        quality: 1.0,
      },
      response => {
        if (!response.didCancel && !response.errorCode) {
          const imageUri = response?.assets[0]?.uri;
          let updatedName = prop.part.replace(/\s+/g, '_') + '.jpeg';

          const updatedQuestions = imageData.map(question => {
            if (question.part === prop?.part) {
              return {
                ...question,
                name: updatedName,
                part: prop?.part,
                type: 'image/jpeg',
                uri: imageUri,
              };
            }
            return question;
          });

          setimageData(updatedQuestions);

          // Handle the captured image URI as needed (e.g., save to state)
        }
      },
    );
  };

  const chooseImage = prop => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1.0,
      },
      response => {
        if (!response.didCancel && !response.errorCode) {
          const imageUri = response?.assets[0]?.uri;
          let updatedName = prop.part.replace(/\s+/g, '_') + '.jpeg';

          const updatedQuestions = imageData.map(question => {
            if (question.part === prop?.part) {
              return {
                ...question,
                name: updatedName,
                part: prop?.part,
                type: 'image/jpeg',
                uri: imageUri,
              };
            }
            return question;
          });

          setimageData(updatedQuestions);
          // Handle the selected image URI as needed (e.g., save to state)
        }
      },
    );
  };
  const fetchData = async () => {
    const localstoreddata = await getData('loggedInUser');
    setLocalData(localstoreddata);
    const getfetchedData = await fetch_Image_inspection_question();
    if (getfetchedData.status) {
      const filteredarray = getfetchedData?.data.filter(
        data => data?.is_mand === '0',
      );
      setfetchedQuestion(filteredarray);

      const temparr = [];
      for (const data of filteredarray) {
        const sample = {
          name: '',
          part: data?.name,
          type: 'image/jpeg',
          uri: '',
        };
        temparr.push(sample);
      }
      setimageData(temparr);
    } else {
      setisErrorVisible(true);
    }
  };
  useEffect(() => {
    fetchData();

    saveImagestoLocalStorage(
      proposalInfo?.proposal_no,
      capturedImagesWithOverlay,
    );
  }, [capturedImagesWithOverlay, proposalInfo?.proposal_no]);
  return (
    <FlatList
      style={styles.container}
      data={imageData}
      numColumns={2}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => handleUpload(item)}>
          {submittedImages.map(submitteditem => {
            submitteditem === item?.part && (
              <Image
                style={{height: 45, width: 25, position: 'absolute'}}
                source={IconCheck}
              />
            );
          })}
          <Image
            style={styles.image}
            source={item.uri !== '' ? {uri: item.uri} : PlaceholderImage}
          />
          <Text style={styles.overlayText}>
            {item.name === '' ? item.part : item?.name}
          </Text>
        </TouchableOpacity>
      )}
      ListFooterComponent={
        <View>
          {/* Your other header components go here */}
          {/* <TextInput style={[styles.input]} placeholder="Odometer Readings" /> */}
          {/* <Image
            style={{
              position: 'absolute',
              height: 54,
              width: 100,
              top: 10,
              left: 11,
            }}
            source={Odometer}
          /> */}
          <View
            style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={openModal}
              style={[styles.submitButton, {backgroundColor: 'orange'}]}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
                Skip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isAllurlNull()}
              style={styles.submitButton}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
                {isRequestDone ? 'Next' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            transparent={true}
            animationType="fade"
            visible={isLoading}
            onRequestClose={() => {}}>
            <View style={styles.loadermodalContainer}>
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLOR.PRIMARY} />
                <View style={{marginLeft: 12}}>
                  <Text style={styles.loaderText}>please wait....</Text>
                  <Text style={styles.loaderText}>Submitting Question</Text>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            visible={!!selectedImage}
            transparent={true}
            onRequestClose={handleModalClose}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleModalClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
              <Image
                style={styles.fullScreenImage}
                source={{uri: selectedImage}}
              />
            </View>
          </Modal>
          <InspectionModalRules
            isVisible={isModalVisible}
            onClose={closeModal}
            proposalData={proposalInfo}
            isVideo={true}
          />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  closeText: {
    color: 'white',
    fontSize: 16,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 16,
    color: COLOR.LABEL,
  },
  loaderContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadermodalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  submitButton: {
    backgroundColor: COLOR.PRIMARY,
    flexDirection: 'row',
    padding: 15,
    gap: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  input: {
    // width: 50,
    color: COLOR.TEXT_COLOR,
    // height: 65,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 24,
    paddingLeft: 30,
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
    backgroundColor: COLOR.BACKGROUND_COLOR,
  },
  imageContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 5,
    padding: 2,
  },
  image: {
    flex: 1,
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  overlayText: {
    color: 'white',
    textAlign: 'center',
    paddingVertical: 5,
  },
});

export default ShowNonMandatoryFields;
