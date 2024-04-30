import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {COLOR} from '../Constant/color';
import {
  Closedeye,
  LockIcon,
  Logo,
  Openeye,
  UserIcon,
} from '../Constant/ImageConstant';
import {useNavigation} from '@react-navigation/native';
import {getData, storeData} from '../Utils/localStorageData';
import CustomLoader from '../Component/Modal/Loader';
import {loginAPi} from '../Api/loginApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

export const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async values => {
    setLoading(true);
    try {
      const response = await loginAPi(values.username, values.password);

      if (response.status) {
        const isStored = await storeData('loggedInUser', response);
        if (isStored) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Dashboard', params: {data: 'response'}}],
          });
        }
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message,
          ToastAndroid.TOP,
          ToastAndroid.LONG,
          25,
          50,
        );
      }
      setLoading(false);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const toggleEye = () => {
    setShowPassword(!showPassword);
  };

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardStatus(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardStatus(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const autoLogin = async () => {
    setLoading(true);

    try {
      const storedUser = await getData('loggedInUser');
      if (storedUser) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard', params: {data: 'response'}}],
        });
      }
    } catch (error) {
      console.error('Automatic login failed:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    autoLogin();
  }, []); // Run only once when component mounts

  return (
    <View style={styles.container}>
      <CustomLoader visible={isLoading} param={'login'} />

      <Formik
        initialValues={{username: '', password: ''}}
        validationSchema={validationSchema}
        onSubmit={handleLogin}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View
            style={[
              styles.ImageContainer,
              {justifyContent: keyboardStatus ? 'center' : 'flex-start'},
            ]}>
            {!keyboardStatus && (
              <View>
                <Image
                  source={Logo}
                  style={{
                    height: 100,
                    width: 250,
                    alignSelf: 'center',
                    marginTop: 80,
                  }}
                  accessible={true}
                  accessibilityLabel="Company Logo"
                />
                <Text
                  style={[styles.Text, {color: 'blue'}, styles.accessibleText]}
                  accessible={true}
                  accessibilityLabel="Global India Insurance Pvt Ltd">
                  Global India Insurance Pvt Ltd
                </Text>
              </View>
            )}
            <Text
              style={[styles.TitleText, styles.accessibleText]}
              accessible={true}
              accessibilityLabel="App Title">
              MY Breakin Manager
            </Text>
            <Text
              style={[styles.Text, styles.accessibleText]}
              accessible={true}
              accessibilityLabel="Login Instruction">
              Use Your Credentials to access Your account
            </Text>

            <View
              style={[
                styles.textInputContainer,
                touched.username && errors.username && styles.errorBorder,
              ]}>
              <Image
                source={UserIcon}
                style={{height: 30, width: 30}}
                accessible={true}
                accessibilityLabel="Username Icon"
              />
              <TextInput
                style={styles.textInput}
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                placeholder="Username*"
                placeholderTextColor={COLOR.PLACEHOLDER}
                accessible={true}
                accessibilityLabel="Username Input"
              />
            </View>
            {touched.username && errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            <View
              style={[
                styles.textInputContainer,
                touched.password && errors.password && styles.errorBorder,
              ]}>
              <Image
                source={LockIcon}
                style={{height: 30, width: 30}}
                accessible={true}
                accessibilityLabel="Password Icon"
              />
              <TextInput
                style={styles.textInput}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Password*"
                secureTextEntry={showPassword}
                placeholderTextColor={COLOR.PLACEHOLDER}
                accessible={true}
                accessibilityLabel="Password Input"
              />
              <TouchableOpacity onPress={toggleEye}>
                {showPassword ? (
                  <Image
                    source={Closedeye}
                    style={{height: 20, width: 20}}
                    accessible={true}
                    accessibilityLabel="Hide Password Icon"
                  />
                ) : (
                  <Image
                    source={Openeye}
                    style={{height: 20, width: 20}}
                    accessible={true}
                    accessibilityLabel="Show Password Icon"
                  />
                )}
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.loginButton}
              accessible={true}
              accessibilityLabel="Login Button">
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <Text
        style={[styles.footerText, styles.accessibleText]}
        accessible={true}
        accessibilityLabel="Copyright Info">
        Copyright@2024 Indicosmic Infotech Ltd
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.BACKGROUND_COLOR,
    flex: 1,
    alignItems: 'center',
  },
  ImageContainer: {
    flex: 1,
  },
  TitleText: {
    color: COLOR.TEXT_COLOR,
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginVertical: 5,
    marginTop: 20,
  },
  forgotPassword: {
    color: '#27AAE1',
    marginVertical: 25,
    alignSelf: 'flex-end',
  },
  Text: {
    color: COLOR.TEXT_COLOR,
    fontSize: 14,
    fontWeight: '400',
    alignSelf: 'center',
    marginVertical: 10,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: windowWidth - 75,
    height: 46,
    borderColor: '#817B7B',
    borderWidth: 0.6,
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 5,

    borderRadius: 6,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    color: COLOR.TEXT_COLOR,
  },
  loginButton: {
    alignSelf: 'center',
    width: windowWidth - 75,
    backgroundColor: COLOR.BUTTON,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginVertical: 15,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    // marginTop: 4,
    marginHorizontal: 10,
  },
  errorBorder: {
    borderColor: 'red',
  },
  footerText: {
    backgroundColor: COLOR.PRIMARY,
    width: '100%',
    textAlign: 'center',
    color: 'white',
    padding: 4,
  },
  accessibleText: {
    // Add styles for accessibility text if necessary
  },
});
