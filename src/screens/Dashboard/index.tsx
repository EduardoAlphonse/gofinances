import React, { useCallback, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from "@react-navigation/core";
import { useAuth } from "../../hooks/auth";

import {
  TransactionCard,
  TransactionCardData,
} from "../../components/TransactionCard";
import { HighlightCard } from "../../components/HighlightCard";
import { Loading } from "../../components/Loading";

import { storage } from "../../config/database";

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
} from "./styles";

export interface DataListProps extends TransactionCardData {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransactionDate: string;
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

  const { signOut, user } = useAuth();

  const getMaxTimestamp = (timestamp: number[]) => {
    return Math.max.apply(Math, timestamp);
  };

  const getFormattedDate = (timestamp: number) => {
    return Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
    }).format(timestamp);
  };

  const getLastTransactionDate = (
    transactions: DataListProps[],
    type?: "up" | "down"
  ) => {
    if (transactions.length === 0) return 0;

    if (!type) {
      const filteredTransactionsTime = transactions.map((transaction) =>
        new Date(transaction.date).getTime()
      );

      const lastTransactionDate = getMaxTimestamp(filteredTransactionsTime);
      const lastTransactionDateFormatted =
        getFormattedDate(lastTransactionDate);

      return lastTransactionDateFormatted;
    }

    const filteredTransactionsTimeByType = transactions
      .filter((transaction) => transaction.type === type)
      .map((transaction) => new Date(transaction.date).getTime());

    if (filteredTransactionsTimeByType.length === 0) {
      return "";
    }

    const lastTransactionDate = getMaxTimestamp(filteredTransactionsTimeByType);
    const lastTransactionsDateFormatted = getFormattedDate(lastTransactionDate);

    return lastTransactionsDateFormatted;
  };

  const loadTransactions = async () => {
    const response = await AsyncStorage.getItem(
      storage.transactionsKey(user.id)
    );
    const transactions: any[] = response ? JSON.parse(response) : [];

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

    const lastEarningTransactionDate = getLastTransactionDate(
      transactions,
      "up"
    );
    const lastExpenseTransactionDate = getLastTransactionDate(
      transactions,
      "down"
    );
    const lastTransactionDateFormatted = getLastTransactionDate(transactions);

    setHighlightData({
      earnings: {
        amount: earnings.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransactionDate: lastEarningTransactionDate
          ? `??ltima entrada dia ${lastEarningTransactionDate}.`
          : "Nenhuma entrada cadastrada.",
      },
      expenses: {
        amount: expenses.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransactionDate: lastExpenseTransactionDate
          ? `??ltima sa??da dia ${lastExpenseTransactionDate}.`
          : "Nenhuma sa??da cadastrada.",
      },
      total: {
        amount: (earnings - expenses).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransactionDate: lastTransactionDateFormatted
          ? `01 ?? ${lastTransactionDateFormatted}.`
          : "Ainda n??o h?? transa????es cadastradas.",
      },
    });

    setIsLoading(false);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Avatar source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Ol??,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.earnings.amount}
              lastTransaction={highlightData.earnings.lastTransactionDate}
            />
            <HighlightCard
              type="down"
              title="Sa??das"
              amount={highlightData.expenses.amount}
              lastTransaction={highlightData.expenses.lastTransactionDate}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransactionDate}
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
