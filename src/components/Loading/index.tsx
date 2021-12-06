import React from "react";
import { ActivityIndicator, ViewStyle } from "react-native";
import { useTheme } from "styled-components";

import { LoadContainer } from "./styles";

interface LoadingProps {
  style?: ViewStyle;
}

export const Loading = ({ style }: LoadingProps) => {
  const { colors } = useTheme();

  return (
    <LoadContainer style={style}>
      <ActivityIndicator size="large" color={colors.primary} />
    </LoadContainer>
  );
};
