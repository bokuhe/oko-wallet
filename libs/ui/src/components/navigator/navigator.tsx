import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';

import { ScreensEnum, ScreensParamList } from '../../enums/sreens.enum';
import { InnerScreen } from '../../screens/inner-screen/inner-screen';
import { TestScreen } from '../../screens/test-screen/test-screen';
import { WelcomeScreen } from '../../screens/welcome-screen/welcome-screen';

const Stack = createNativeStackNavigator<ScreensParamList>();

export const Navigator: FC = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name={ScreensEnum.Welcome} component={WelcomeScreen} />
      <Stack.Screen name={ScreensEnum.Test} component={TestScreen} />
      <Stack.Screen name={ScreensEnum.Inner} component={InnerScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
