import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Modal, Text, Image, ToastAndroid} from 'react-native';
import FastImage from 'react-native-fast-image';
import {LOGO, LOGOLoader} from '../Constants/Image_Constant';

const CustomLoader = ({visible, param}) => {
  const [isLoading, setIsLoading] = useState(visible);

  useEffect(() => {
    if (visible) {
      // Set a timer to hide the loader after 1 minute (60000 milliseconds)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 60000);

      return () => clearTimeout(timer);
    }
  }, [visible]);
  
  console.log(
    visible,
    param,
    '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
  );

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.loaderContainer}>
          <View
            style={{backgroundColor: 'white', padding: 10, borderRadius: 8}}>
            <FastImage
              style={styles.loader}
              source={require('../../Assets/loadergif/loader.gif')}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
  },
  loaderContainer: {
    // backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  loader: {
    width: 150,
    height: 150,
  },
  logo: {
    height: 40,
    width: 40,
    position: 'absolute',
    zIndex: 4,
    top: 75,
    // left
    alignSelf: 'center',
  },
});

export default CustomLoader;
