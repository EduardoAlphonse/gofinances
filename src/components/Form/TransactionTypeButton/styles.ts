import styled, { css } from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface IconProps {
  type: "up" | "down";
}

interface TransactionProps {
  isActive: boolean;
  type: "up" | "down";
}

export const Container = styled.View<TransactionProps>`
  flex: 1;
  border-radius: 5px;

  border-width: 1px;
  border-style: solid;
  border-color: transparent;

  ${({ isActive, theme }) =>
    !isActive &&
    css`
      border-color: ${theme.colors.text_light};
      /* border: 1px solid ${theme.colors.text_light}; */
    `}

  ${({ isActive, type, theme }) =>
    isActive &&
    type === "up" &&
    css`
      background-color: ${theme.colors.success_light};
    `};

  ${({ isActive, type, theme }) =>
    isActive &&
    type === "down" &&
    css`
      background-color: ${theme.colors.attention_light};
    `};
`;

export const Button = styled(RectButton)`
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 16px 0;
`;

export const Icon = styled(Feather)<IconProps>`
  margin-right: 12px;

  font-size: ${RFValue(24)}px;
  color: ${({ type, theme }) =>
    type === "up" ? theme.colors.success : theme.colors.attention};
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.title};
`;
