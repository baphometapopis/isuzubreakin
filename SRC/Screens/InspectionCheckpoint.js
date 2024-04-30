import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {COLOR} from '../Constant/color';
import RadioButton from '../Component/CustomRadioButton';
import {useNavigation} from '@react-navigation/native';
import CustomAlert from '../Component/Modal/AlertModal';
import {fetch_Checkpoint_inspection_question} from '../Api/fetchQuestion';
import InspectionModalRules from '../Component/Modal/InspectionModalRules';
import {submit_inspection_checkpointData} from '../Api/submitInspectionQuestion';
import {getData} from '../Utils/localStorageData';
import CustomLoader from '../Component/Modal/Loader';

const InspectionCheckpoint = prop => {
  const [proposalInfo] = useState(prop?.route?.params);
  const [selectedValues, setSelectedValues] = useState({});
  const [fetchedQuestion, setfetchedQuestion] = useState();
  const [isRequestDone, setRequestDone] = useState(false);
  const [FailedArray, setFailedArray] = useState([]);

  const [isErrorVisible, setisErrorVisible] = useState(false);
  const [unansweredQuestions, setunansweredQuestions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localdata, setLocalData] = useState(false);
  const [totalQuestions, setTotalQuestion] = useState([]);
  const [currentQuestion, setcurrentQuestion] = useState('');

  const [submittedQuestions, setSubmittedQuestions] = useState([]);

  const [ErrorMessage, setErrorMessage] = useState('');
  const toggleErrorAlert = () => {
    setisErrorVisible(!isErrorVisible);
  };
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    const unansweredQuestionslist = checkUnansweredQuestions();
    setunansweredQuestions(unansweredQuestionslist);

    // if (false) {
    if (unansweredQuestionslist.length > 0) {
      console.log(unansweredQuestionslist, 'unansweredQuestionslist');
    } else {
      setIsSubmitted(false); // Reset submitted state
      submitQuestions(selectedValues);
      setTotalQuestion(selectedValues);
    }
  };

  async function submitQuestions(questionDataList) {
    setIsLoading(true);
    const retryArray = [];
    const failedSubmissionsArray = [];
    const questiondone = [];

    try {
      for (const [questionId, answer] of Object.entries(questionDataList)) {
        let data = {
          break_in_case_id: proposalInfo?.break_in_case_id,
          question_id: questionId,
          pos_id: localdata?.pos_login_data?.id,
          proposal_list_id: proposalInfo?.id,
          ic_id: proposalInfo?.ic_id,
          answer_id: answer,
          inspection_type: proposalInfo?.inspection_type,
        };
        try {
          // await submit_inspection_checkpointData(questionId);
          const submittedresponse = await submit_inspection_checkpointData(
            data,
          );
          if (submittedresponse?.status) {
            setcurrentQuestion(questionId);
            console.log(`Question ${questionId} submitted successfully`);
            questiondone.push(Number(questionId));
          } else {
          }
          // await submitQuestion(questionId);
        } catch (error) {
          console.error(
            `Error submitting question ${questionId}: ${error.message}`,
          );
          if (answer > 1) {
            retryArray.push(questionId); // Push failed question to retry array if attempts left
          } else {
            failedSubmissionsArray.push(questionId); // Push failed question to failed submissions array
          }
        }
      }

      // Retry failed submissions
      for (const questionId of retryArray) {
        try {
          // await submit_inspection_checkpointData(questionId);
          console.log(`Question ${questionId} submitted successfully on retry`);
        } catch (error) {
          console.log(
            `Error submitting question ${questionId} on retry: ${error.message}`,
          );
          failedSubmissionsArray.push(questionId); // Push question to failed submissions array after retry
        }
      }

      console.log('All questions submitted successfully', questiondone);
      setSubmittedQuestions(questiondone);
      console.log('Failed submissions:', failedSubmissionsArray);
    } catch (error) {
      console.log(`Error submitting questions: ${error.message}`);
    }
    setIsLoading(false);
    setFailedArray(failedSubmissionsArray);
    console.log(failedSubmissionsArray, 'failed Submission array');
    if (failedSubmissionsArray.length === 0) {
      setRequestDone(true);
    }
  }

  const handleOptionChange = (selectedValue, questionId) => {
    setSelectedValues(prevValues => ({
      ...prevValues,
      [questionId]: selectedValue,
    }));
  };

  const checkUnansweredQuestions = () => {
    const unansweredQuestion = [];
    fetchedQuestion.forEach(question => {
      if (!selectedValues[question.breakin_inspection_post_question_id]) {
        unansweredQuestion.push(question.breakin_inspection_post_question_id);
      }
    });

    return unansweredQuestion;
  };

  const fetchData = async () => {
    setLoading(true);
    const localstoreddata = await getData('loggedInUser');
    setLocalData(localstoreddata);
    const getfetchedData = await fetch_Checkpoint_inspection_question();
    if (getfetchedData.status) {
      setfetchedQuestion(getfetchedData?.data);
    } else {
      setisErrorVisible(true);
      setErrorMessage('Data Fetch Failed Try Again Later');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    return () => {};
  }, []);

  useEffect(() => {}, [
    submittedQuestions,
    totalQuestions,
    currentQuestion,
    FailedArray,
    unansweredQuestions,
  ]);

  return (
    <View style={styles.container}>
      <CustomLoader visible={loading} />

      <CustomAlert
        visible={isErrorVisible}
        message={ErrorMessage}
        onClose={toggleErrorAlert}
      />
      {fetchedQuestion && (
        <ScrollView>
          <View>
            <RadioButton
              data={fetchedQuestion}
              selectedValues={selectedValues}
              onChange={handleOptionChange}
              labelkey="question"
              submittedQuestions={
                submitQuestions.length > 0 ? submittedQuestions : []
              }
              RequestDone={isRequestDone}
              unansweredQuestions={
                unansweredQuestions.length > 0 ? checkUnansweredQuestions() : []
              }
              valuekey="breakin_inspection_post_question_id"
            />
          </View>

          {/* {true ? ( */}
          {isRequestDone && FailedArray.length === 0 ? (
            <TouchableOpacity
              onPress={openModal}
              disabled={isLoading || isSubmitted}
              style={styles.submitButton}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
                Next
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading || isSubmitted}
              style={styles.submitButton}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
                {isLoading
                  ? 'Submitting....'
                  : isSubmitted
                  ? 'Submitted'
                  : 'Submit Questions'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
      <InspectionModalRules
        isVisible={isModalVisible}
        onClose={closeModal}
        proposalData={proposalInfo}
        isVideo={false}
      />

      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => {}}>
        <View style={styles.modalContainer}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLOR.PRIMARY} />

            <View style={{marginLeft: 12}}>
              <Text style={styles.loaderText}>please wait....</Text>
              <Text style={styles.loaderText}>
                Submitting Question
                {`${currentQuestion}/${Object.keys(totalQuestions).length}`}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      {unansweredQuestions.length !== 0 && (
        <Text style={styles.errorText}>ALl Fields are Required</Text>
      )}
      {console.log(unansweredQuestions)}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loaderContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loaderText: {
    fontSize: 16,
    color: COLOR.LABEL,
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

export default InspectionCheckpoint;
