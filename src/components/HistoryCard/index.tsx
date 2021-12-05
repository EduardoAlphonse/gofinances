import React from "react";

import { Container, Title, Amount } from "./styles";

interface HistoryCardData {
  title: string;
  amount: string;
  color: string;
}

interface HistoryCardProps {
  data: HistoryCardData;
}

export const HistoryCard = ({ data }: HistoryCardProps) => {
  return (
    <Container color={data.color}>
      <Title>{data.title}</Title>
      <Amount>{data.amount}</Amount>
    </Container>
  );
};
