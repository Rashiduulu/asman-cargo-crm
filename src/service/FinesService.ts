import {CreateCleanSearchParams} from "../helpers/helpers";
import {$axios} from "../https/axiosInstance";

export const FinesService = {
  async GetFinesList(searchParams: any) {
    return await $axios.get(`/transactions/fines/` + CreateCleanSearchParams(searchParams));
  },
};
