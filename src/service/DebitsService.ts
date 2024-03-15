import {$axios} from "../https/axiosInstance";
import {RemoveEmptyObj} from "../helpers/helpers";

export const DebitsService = {
  async GetClientDebits(params: any) {
    return await $axios.post(`/debits-by-client/`, RemoveEmptyObj(params));
  },
  async GetDebits(params: any) {
    return await $axios.post(`/debits/`, RemoveEmptyObj(params));
  },
};
