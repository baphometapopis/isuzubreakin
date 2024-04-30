import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {COLOR} from '../Constant/color';
import {NoInternet} from '../Constant/ImageConstant';

export const NoInternetPage = ({onRetry}) => {
  return (
    <View style={styles.container}>
      <Image
        source={NoInternet} // Add your own image source
        style={styles.image}
      />
      <Text style={styles.text}>No Internet Connection</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: COLOR.TEXT_COLOR,
  },
  retryButton: {
    marginTop: 30,
    backgroundColor: COLOR.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default NoInternetPage;
