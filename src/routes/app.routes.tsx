import React from "react";
import { Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components";

import { Dashboard } from "../screens/Dashboard";
import { Register } from "../screens/Register";
import { Summary } from "../screens/Summary";

export type AppRoutesParamList = {
  Listagem: undefined;
  Cadastrar: undefined;
  Resumo: undefined;
};

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesParamList>();

export const AppRoutes = () => {
  const { colors, fonts } = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: {
          height: 78,
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 14,
          lineHeight: 20,
        },
      }}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="Cadastrar"
        component={Register}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="attach-money" size={size} color={color} />
          ),
        }}
      />
      <Screen
        name="Resumo"
        component={Summary}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="pie-chart" size={size} color={color} />
          ),
        }}
      />
    </Navigator>
  );
};
