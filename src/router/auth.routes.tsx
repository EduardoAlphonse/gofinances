import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { SignIn } from "../screens/SignIn";

export type AuthRoutesParamList = {
  SignIn: undefined;
};

const { Navigator, Screen } = createStackNavigator<AuthRoutesParamList>();

export const AuthRoutes = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="SignIn" component={SignIn} />
    </Navigator>
  );
};
