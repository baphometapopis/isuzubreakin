import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {COLOR} from '../Constant/color';
import {IconCheck, IconClose, IconUnChecked} from '../Constant/ImageConstant';

const RadioButton = ({
  data,
  RequestDone,
  unansweredQuestions,
  submittedQuestions,
  onChange,
  labelkey,
  valuekey,
  errors,
  touched,
}) => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionSelect = (value, id) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [id]: value,
    }));
    onChange(value, id);
  };

  const getLabelForValue = value => {
    switch (value) {
      case 1:
        return 'Safe';
      case 2:
        return 'Scratch';
      case 3:
        return 'Pressed';
      case 4:
        return 'Broken';
      case 5:
        return 'Good';
      case 6:
        return 'Not Working';
      case 7:
        return 'Not Available';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      {data.map(item => (
        <View
          style={{marginVertical: 10}}
          key={item.breakin_inspection_post_question_id}>
          <View style={{flexDirection: 'row', gap: 12}}>
            <Text style={styles.header}>{item[labelkey]}</Text>
            {RequestDone && (
              <>
                {submittedQuestions.includes(
                  item.breakin_inspection_post_question_id,
                ) ? (
                  <Image source={IconCheck} style={{height: 25, width: 25}} />
                ) : (
                  <Image
                    source={IconUnChecked}
                    style={{height: 15, width: 15}}
                  />
                )}
              </>
            )}
          </View>
          <View style={styles.optionsContainer}>
            {Object.keys(item.answers_obj).map(key => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.option,
                  selectedOptions[item.breakin_inspection_post_question_id] ===
                    item.answers_obj[key] && styles.selectedOption,
                  // Apply failed option style if question ID exists in failedSubmission array
                ]}
                onPress={() =>
                  handleOptionSelect(
                    item.answers_obj[key],
                    item.breakin_inspection_post_question_id,
                  )
                }>
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions[
                      item.breakin_inspection_post_question_id
                    ] === item.answers_obj[key] && styles.optionTextselected,
                  ]}>
                  {getLabelForValue(item.answers_obj[key])}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Show error message if question is unanswered */}
          {unansweredQuestions.includes(
            item.breakin_inspection_post_question_id,
          ) && <Text style={styles.errorText}>This question is required</Text>}
        </View>
      ))}
      {errors && touched && <Text style={styles.errorText}>{errors}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  container: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
    color: COLOR.TEXT_COLOR,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
  },
  option: {
    backgroundColor: 'white',
    borderRadius: 52,
    borderWidth: 1,
    borderColor: COLOR.PLACEHOLDER,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: COLOR.PRIMARY,
    backgroundColor: COLOR.BACKGROUND_COLOR,
  },
  optionText: {
    color: COLOR.PLACEHOLDER,
    fontSize: 16,
  },
  optionTextselected: {
    color: COLOR.PRIMARY,
    fontSize: 16,
  },
  failedOption: {
    borderColor: 'red', // Change border color to indicate failed submission
  },
});

export default RadioButton;
