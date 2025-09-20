import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screen/auth/SignIn';
import Onboard from '../screen/auth/Onboard';
import SignUp from '../screen/auth/SignUp';
import ForgotPassword from '../screen/auth/ForgotPassword';
import { navigationRef } from '../../utils/navigationRef';
import {TabNav} from './TabNavigation';
import {InstruterTabNav} from './InstructerTabNavigation';
import Form from '../screen/instructer/Form';
import InstructerDetail from '../screen/app/InstructerDetail';
import BookingConfirm from '../screen/app/BookingConfirm';
import AssignedInstructor from '../screen/app/AssignedInstructor';
import Account from '../screen/app/Account';
import Profile from '../screen/app/Profile';




const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const AuthNavigate = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Onboard" component={Onboard} />
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />

    </AuthStack.Navigator>
  );
};



export default function Navigation(props) {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={"Auth"}
      >
        <Stack.Screen name="Auth" component={AuthNavigate} />
        <Stack.Screen name="App" component={TabNav} />
        <Stack.Screen name="InstructerApp" component={InstruterTabNav} />
        <Stack.Screen name="Form" component={Form} />
        <Stack.Screen name="InstructerDetail" component={InstructerDetail} />
        <Stack.Screen name="BookingConfirm" component={BookingConfirm} />
        <Stack.Screen name="AssignedInstructor" component={AssignedInstructor} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Profile" component={Profile} />

      </Stack.Navigator>




    </NavigationContainer>
  );
}


