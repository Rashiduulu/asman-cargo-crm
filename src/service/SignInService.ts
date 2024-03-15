import { $axios } from "../https/axiosInstance";
import { RemoveEmptyObj } from "../helpers/helpers";

export const SignInService = {
  async GetToken(data: any) {
    return await $axios.post("/staffs/token/", RemoveEmptyObj(data));
  },
};
