import React, { useState } from "react";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppRoutesParamList } from "../../router/app.routes";

import { Header } from "../../components/Header";
import { CategorySelect } from "../CategorySelect";
import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { CategoryData } from "../CategorySelect";

import { COLLECTION_TRANSACTIONS } from "../../config/database";

import { Container, Form, Fields, TransactionTypes } from "./styles";

interface FormData {
  name: string;
  amount: string;
}

type RegisterNavigationProps = BottomTabNavigationProp<
  AppRoutesParamList,
  "Cadastrar"
>;

const schema = Yup.object({
  name: Yup.string().required("Um nome é obrigatório."),
  amount: Yup.number()
    .typeError("Informe um valor numérico, e não use vírgulas.")
    .positive("O valor não pode ser negativo.")
    .required("Um valor é obrigatório."),
}).required();

export const Register = () => {
  const [transactionType, setTransactionType] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState<CategoryData>({} as CategoryData);

  const navigation = useNavigation<RegisterNavigationProps>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleTransactionTypeSelect = (type: "up" | "down") => {
    setTransactionType(type);
  };

  const handleCloseSelectCategoryModal = () => setIsCategoryModalOpen(false);

  const handleOpenSelectCategoryModal = () => setIsCategoryModalOpen(true);

  const handleRegister = async (form: FormData) => {
    if (!transactionType) {
      return Alert.alert("Selecione o tipo da transação.");
    }

    if (!category.key) {
      return Alert.alert("Selecione uma categoria.");
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const data = await AsyncStorage.getItem(COLLECTION_TRANSACTIONS);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [newTransaction, ...currentData];

      await AsyncStorage.setItem(
        COLLECTION_TRANSACTIONS,
        JSON.stringify(dataFormatted)
      );

      reset();
      setTransactionType("");
      setCategory({} as CategoryData);

      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header title="Cadastro" />

        <Form>
          <Fields>
            <InputForm
              placeholder="Nome"
              control={control}
              name="name"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              placeholder="Preço"
              keyboardType="numeric"
              control={control}
              name="amount"
              error={errors.amount && errors.amount.message}
              autoCompleteType="off"
            />

            <TransactionTypes>
              <TransactionTypeButton
                type="up"
                title="Entrada"
                onPress={() => handleTransactionTypeSelect("up")}
                isActive={transactionType === "up"}
                style={{ marginRight: 4 }}
              />
              <TransactionTypeButton
                type="down"
                title="Saída"
                onPress={() => handleTransactionTypeSelect("down")}
                isActive={transactionType === "down"}
                style={{ marginLeft: 4 }}
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal
          visible={isCategoryModalOpen}
          animationType="slide"
          statusBarTranslucent
        >
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
};
