import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTheme } from "styled-components";

import { Header } from "../../components/Header";
import { HistoryCard } from "../../components/HistoryCard";
import { Loading } from "../../components/Loading";

import { COLLECTION_TRANSACTIONS } from "../../config/database";
import { categories } from "../../utils/categories";

import {
  Container,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
} from "./styles";
import { useFocusEffect } from "@react-navigation/core";

interface TransactionData {
  type: "up" | "down";
  name: string;
  amount: number;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  totalRaw: number;
  totalCurrency: string;
  color: string;
  percent: string;
}

export const Summary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  const { colors } = useTheme();

  const handleDateChange = (action: "next" | "previous") => {
    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const loadDdata = async () => {
    setIsLoading(true);

    const response = await AsyncStorage.getItem(COLLECTION_TRANSACTIONS);
    const formattedResponse = response ? JSON.parse(response) : [];

    const expenses: TransactionData[] = formattedResponse.filter(
      (expense: TransactionData) =>
        expense.type === "down" &&
        new Date(expense.date).getMonth() === selectedDate.getMonth() &&
        new Date(expense.date).getFullYear() === selectedDate.getFullYear()
    );

    const totalExpenses = expenses.reduce(
      (acumulator: number, expense: TransactionData) => {
        return acumulator + expense.amount;
      },
      0
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expenses.forEach((expensive) => {
        if (expensive.category === category.key) {
          categorySum += expensive.amount;
        }
      });

      const totalCurrency = categorySum.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      if (categorySum > 0) {
        const percent = `${((categorySum * 100) / totalExpenses).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          totalRaw: categorySum,
          totalCurrency,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadDdata();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header title="Resumo por categoria" />

      <Content>
        <MonthSelect>
          <MonthSelectButton onPress={() => handleDateChange("previous")}>
            <SelectIcon name="chevron-left" />
          </MonthSelectButton>

          <Month>{format(selectedDate, "MMMM, yyyy", { locale: ptBR })}</Month>

          <MonthSelectButton onPress={() => handleDateChange("next")}>
            <SelectIcon name="chevron-right" />
          </MonthSelectButton>
        </MonthSelect>

        {isLoading ? (
          <Loading style={{ paddingTop: "50%" }} />
        ) : (
          <>
            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map((category) => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: "bold",
                    fill: colors.shape,
                  },
                }}
                x="percent"
                y="totalRaw"
                labelRadius={50}
              />
            </ChartContainer>

            {totalByCategories.map((item) => (
              <HistoryCard
                key={item.key}
                data={{
                  title: item.name,
                  amount: item.totalCurrency,
                  color: item.color,
                }}
              />
            ))}
          </>
        )}
      </Content>
    </Container>
  );
};
