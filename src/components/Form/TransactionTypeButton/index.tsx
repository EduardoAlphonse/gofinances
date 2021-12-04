import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, Icon, Title, Button } from "./styles";

type TransactionTypeButtonProps = RectButtonProps & {
  title: string;
  type: "up" | "down";
  isActive: boolean;
  onPress: () => void;
};

const icons = {
  up: "arrow-up-circle",
  down: "arrow-down-circle",
};

export const TransactionTypeButton = ({
  title,
  type,
  isActive,
  style,
  onPress,
  ...rest
}: TransactionTypeButtonProps) => {
  return (
    <Container type={type} isActive={isActive} style={style}>
      <Button onPress={onPress} {...rest}>
        <Icon type={type} name={icons[type]} />
        <Title>{title}</Title>
      </Button>
    </Container>
  );
};
