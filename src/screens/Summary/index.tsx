import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Header } from "../../components/Header";
import { HistoryCard } from "../../components/HistoryCard";

import { COLLECTION_TRANSACTIONS } from "../../config/database";
import { categories } from "../../utils/categories";

import { Container, CategoryList } from "./styles";

interface TransactionData {
  type: "up" | "down";
  name: string;
  amount: number;
  category: string;
  data: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: string;
  color: string;
}

export const Summary = () => {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  const loadDdata = async () => {
    const response = await AsyncStorage.getItem(COLLECTION_TRANSACTIONS);
    const formattedResponse = response ? JSON.parse(response) : [];

    const expensives: TransactionData[] = formattedResponse.filter(
      (item: TransactionData) => item.type === "down"
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive) => {
        if (expensive.category === category.key) {
          categorySum += expensive.amount;
        }
      });

      const total = categorySum.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      if (categorySum > 0) {
        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total,
        });
      }
    });

    setTotalByCategories(totalByCategory);
  };

  useEffect(() => {
    loadDdata();
  }, []);

  return (
    <Container>
      <Header title="Resumo por categoria" />

      <CategoryList>
        {totalByCategories.map((item) => (
          <HistoryCard
            key={item.key}
            data={{
              title: item.name,
              amount: item.total,
              color: item.color,
            }}
          />
        ))}
      </CategoryList>
    </Container>
  );
};
