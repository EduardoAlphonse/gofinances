import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface TypeProps {
  type: "up" | "down" | "total";
}

export const Container = styled.View<TypeProps>`
  background-color: ${({ type, theme }) =>
    type === "total" ? theme.colors.secondary : theme.colors.shape};
  width: ${RFValue(280)}px;
  border-radius: 5px;
  padding: 19px 23px ${RFValue(42)}px;
  margin-right: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text<TypeProps>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ type, theme }) =>
    type === "total" ? theme.colors.shape : theme.colors.title};
`;

export const Icon = styled(Feather)<TypeProps>`
  font-size: ${RFValue(40)}px;
  color: ${({ type, theme }) =>
    type === "up"
      ? theme.colors.success
      : type === "down"
      ? theme.colors.attention
      : theme.colors.shape};
`;

export const Footer = styled.View`
  margin-top: ${RFValue(38)}px;
`;

export const Amount = styled.Text<TypeProps>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(32)}px;
  color: ${({ type, theme }) =>
    type === "total" ? theme.colors.shape : theme.colors.title};
`;

export const LastTransaction = styled.Text<TypeProps>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;
  color: ${({ type, theme }) =>
    type === "total" ? theme.colors.shape : theme.colors.title};
  margin-top: -4px;
`;
