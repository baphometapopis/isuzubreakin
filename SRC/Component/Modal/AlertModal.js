import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {COLOR} from '../../Constant/color';
import {Image} from 'react-native-animatable';
import {IconError} from '../../Constant/ImageConstant';

const CustomAlert = ({visible, message, onClose}) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.alertBox}>
          <Image
            source={IconError}
            style={{height: 55, width: 55, marginBottom: 20}}
          />
          <Text style={styles.messageText}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
  },
  messageText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: COLOR.TEXT_COLOR,
  },
  okButton: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: 50,

    borderRadius: 5,
    marginTop: 10,
  },
  okButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 10,
  },
});

export default CustomAlert;
