import React, { useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/core";
import { useTheme } from "styled-components";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardData,
} from "../../components/TransactionCard";
import { COLLECTION_TRANSACTIONS } from "../../config/database";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Avatar,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from "./styles";

export interface DataListProps extends TransactionCardData {
  id: string;
}

interface HighlightProps {
  amount: string;
}
interface HighlightData {
  earnings: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}

export const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const { colors } = useTheme();

  const loadTransactions = async () => {
    const response = await AsyncStorage.getItem(COLLECTION_TRANSACTIONS);
    const transactions = response ? JSON.parse(response) : [];

    let earnings = 0;
    let expenses = 0;

    const formattedTransactions: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === "up") {
          earnings += Number(item.amount);
        } else {
          expenses += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount: amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    setTransactions(formattedTransactions);
    setHighlightData({
      earnings: {
        amount: earnings.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
          compactDisplay: "",
        }),
      },
      expenses: {
        amount: expenses.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      },
      total: {
        amount: (earnings - expenses).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      },
    });

    setIsLoading(false);
  };

  useEffect(() => {
    loadTransactions();
  }, [highlightData]);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator size="large" color={colors.primary} />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Avatar
                  source={{ uri: "https://github.com/EduardoAlphonse.png" }}
                />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Eduardo</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => {}}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.earnings.amount}
              lastTransaction="Última entrada dia 13 de abril"
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={highlightData.expenses.amount}
              lastTransaction="Última saída dia 3 de abril"
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction="01 à 16 de Abril"
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
};
