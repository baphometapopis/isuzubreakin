// StackNavigation.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {LoginScreen} from '../Screens/LoginScreen';
import {DashboardScreen} from '../Screens/Dashboard';
import CameraScreen from '../Component/CameraScreen';
import ShowinspectionImages from '../Screens/ShowinspectionImages';
import {COLOR} from '../Constant/color';
import {NewInspectionScreen} from '../Screens/NewInspection';
import {ShowProposalInfo} from '../Screens/ShowProposalInfo';
import InspectionCheckpoint from '../Screens/InspectionCheckpoint';
import VideoRecorder from '../Screens/VideoRecorder';
import VideoPreview from '../Screens/VideoPreview';
import AddTextToImage from '../Component/AddTextToImage';
import {ProgressInspectionScreen} from '../Screens/ProgressInspection';
import ShowNonMandatoryFields from '../Screens/ShowNonMandatoryFields';
import {ReferBackInspection} from '../Screens/ReferBackInspection';
import {RejectedInspectionScreen} from '../Screens/RejectedInspection';

const Stack = createStackNavigator();
const headerOptions = {
  headerStyle: {
    backgroundColor: COLOR.PRIMARY, // Set header background color
  },
  headerTintColor: 'white', // Set header text color
};

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={headerOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ReferBackScreen"
        component={ReferBackInspection}
        options={{title: 'ReferBack Inspection'}}
      />

      <Stack.Screen
        name="AddTextToImage"
        component={AddTextToImage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowInspectionImages"
        component={ShowinspectionImages}
        options={{title: 'Inspection Images'}}
      />
      <Stack.Screen
        name="progressInspection"
        component={ProgressInspectionScreen}
        options={{title: 'Progress Inspection'}}
      />
      <Stack.Screen
        name="RejectedInspection"
        component={RejectedInspectionScreen}
        options={{title: 'Rejected Inspection'}}
      />
      <Stack.Screen
        name="ShowNonMandatoryFields"
        component={ShowNonMandatoryFields}
        options={{title: 'Non Mandatory Images'}}
      />

      <Stack.Screen
        name="NewInspection"
        component={NewInspectionScreen}
        options={{title: 'New Inspection'}}
      />
      <Stack.Screen
        name="cameramodule"
        component={CameraScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="videomodule"
        component={VideoRecorder}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="VideoPreview"
        component={VideoPreview}
        options={{title: 'Video Preview'}}
      />

      <Stack.Screen
        name="ShowProposalInfo"
        component={ShowProposalInfo}
        options={{title: 'Proposal Info'}}
      />
      <Stack.Screen
        name="inspectionCheckpoint"
        component={InspectionCheckpoint}
        options={{title: 'Inspection checkpoint'}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
