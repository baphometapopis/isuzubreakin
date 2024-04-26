import React from 'react';
import {View, Text, TouchableOpacity, Linking, Image} from 'react-native';
import Modal from 'react-native-modal';
import {IconCustomerCare} from '../../Constant/ImageConstant';
import {COLOR} from '../../Constant/color';

const CustomerCareModal = ({isVisible, onClose}) => {
  const customerCareNumbers = [
    {
      label: 'Customer Care 1',
      number: '9137857548',
      image: IconCustomerCare,
    },
    {
      label: 'Customer Care 2',
      number: '9372777632',
      image: IconCustomerCare,
    },
  ];

  const handleCall = number => {
    const url = `tel:${number}`;
    Linking.openURL(url)
      .then(() => console.log(`Successfully dialed ${url}`))
      .catch(err => console.error('Failed to open URL: ', err));
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 4,
        }}>
        <Text style={{fontSize: 18, marginBottom: 20, color: COLOR.LABEL1}}>
          Customer Care
        </Text>
        {customerCareNumbers.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCall(item.number)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLOR.BACKGROUND_COLOR,
              padding: 10,
              borderRadius: 20,
              marginBottom: 10,
              borderWidth: 0.3,
              borderColor: COLOR.BORDER_COLOR,
              elevation: 3, // Adds a shadow on Android
              shadowColor: 'black', // Adds a shadow on iOS
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}>
            <Image
              source={item.image}
              style={{width: 20, height: 20, marginRight: 10}}
            />
            <Text style={{fontSize: 16, color: COLOR.TEXT_COLOR}}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={onClose}>
          <Text style={{fontSize: 16, color: 'red', textAlign: 'right'}}>
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CustomerCareModal;
