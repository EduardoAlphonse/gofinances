import React from "react";
import { FlatList } from "react-native";

import { categories } from "../../utils/categories";

import { Header } from "../../components/Header";
import { Button } from "../../components/Form/Button";
import { Container, Category, Icon, Name, Separator, Footer } from "./styles";

export interface CategoryData {
  key: string;
  name: string;
}

interface CategorySelectProps {
  category: CategoryData;
  setCategory: (category: CategoryData) => void;
  closeSelectCategory: () => void;
}

export const CategorySelect = ({
  category,
  setCategory,
  closeSelectCategory,
}: CategorySelectProps) => {
  const handleSetCategory = (category: CategoryData) => {
    setCategory(category);
  };

  return (
    <Container>
      <Header title="Selecionar categoria" />

      <FlatList
        data={categories}
        style={{ flex: 1, width: "100%" }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleSetCategory(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={Separator}
      />

      <Footer>
        <Button title="Selecionar" onPress={closeSelectCategory} />
      </Footer>
    </Container>
  );
};
