import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, Title, Icon } from "./styles";

interface CategorySelectButtonProps extends RectButtonProps {
  title: string;
  onPress: () => void;
}

export const CategorySelectButton = ({
  title,
  ...rest
}: CategorySelectButtonProps) => {
  return (
    <Container {...rest}>
      <Title isCategorySet={!!title}>{title ?? "Categoria"}</Title>
      <Icon name="chevron-down" />
    </Container>
  );
};
