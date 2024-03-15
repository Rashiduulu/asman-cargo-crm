import { CreateCleanSearchParams, RemoveEmptyObj } from "../helpers/helpers";
import { $axios } from "../https/axiosInstance";
import { useAsync } from "react-async-hook";

export const TransactionsService = {
  GetTransactionList(searchParams: any) {
    return useAsync(async () => {
      return await $axios.get(
        "/transactions/" + CreateCleanSearchParams(searchParams)
      );
    }, [CreateCleanSearchParams(searchParams)]);
  },
  GetTransaction(transaction_id: string | undefined, transaction_type: string) {
    return useAsync(async () => {
      return await $axios.get(
          `/transactions/${transaction_type}/${transaction_id}/`
      );
    }, [transaction_id]);
  },
  GetTransactionTypes() {
    return useAsync(async () => {
      return await $axios.get(
          "/transactions/transaction-type/"
      );
    }, []);
  },
  GetBoxOfficeList() {
    return useAsync(async () => {
      return await $axios.get(
          "/transactions/box-office/"
      );
    }, []);
  },
  GetBoxOfficeListWithoutPagination(searchParams: any) {
    return useAsync(async () => {
      return await $axios.get(
          "/transactions/box-office/list/" + CreateCleanSearchParams(searchParams)
      );
    }, [CreateCleanSearchParams(searchParams)]);
  },
  GetCurrencyList() {
    return useAsync(async () => {
      return await $axios.get(
          "/transactions/currency/"
      );
    }, []);
  },
  GetPaymentTypeList() {
    return useAsync(async () => {
      return await $axios.get(
          "/transactions/payment-type/"
      );
    }, []);
  },
  GetTransactionItemsList(searchParams: any) {
    return useAsync(async () => {
      return await $axios.get(
          "/transactions/items/" + CreateCleanSearchParams(searchParams)
      );
    }, [CreateCleanSearchParams(searchParams)]);
  },

  async UpdateTransaction(values: any, transaction_type: string) {
    return await $axios.put(
        `/transactions/update/${transaction_type}/${values.id}/`,
        RemoveEmptyObj(values)
    );
  },
  async CreateTransaction(values: any, transaction_type: string) {
    return await $axios.post(
      `/transactions/create/${transaction_type}/`,
      RemoveEmptyObj(values)
    );
  },
  async DeleteTransaction(values: any) {
    return await $axios.delete(
      `/transactions/delete/${values.id}/`
    );
  },
  async GetTransactionById(values: any, transaction_type: string) {
    return await $axios.get(
        `/transactions/${transaction_type}/${values.id}/`,
        RemoveEmptyObj(values)
    );
  },
};
