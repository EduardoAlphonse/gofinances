import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Form = styled.View`
  flex: 1;
  padding: 24px;
`;

export const Fields = styled.View`
  flex: 1;
`;

export const TransactionTypes = styled.View`
  flex-direction: row;
  margin: 8px 0 16px;
`;
