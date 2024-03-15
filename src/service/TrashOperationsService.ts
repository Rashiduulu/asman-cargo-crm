import { CreateCleanSearchParams, RemoveEmptyObj } from "../helpers/helpers";
import { $axios } from "../https/axiosInstance";
import { useAsync } from "react-async-hook";

export const TrashOperationsService = {
  GetTrashOperationList(searchParams: any) {
    return useAsync(async () => {
      return await $axios.get(
        "/trash/transactions/" + CreateCleanSearchParams(searchParams)
      );
    }, [CreateCleanSearchParams(searchParams)]);
  },
  async RestoreFromTrash(parameters: any) {
    return await $axios.post(`/trash/restore/`, RemoveEmptyObj(parameters));
  },
};
