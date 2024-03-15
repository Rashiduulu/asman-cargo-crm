import {CreateCleanSearchParams, RemoveEmptyObj} from "../helpers/helpers";
import {$axios} from "../https/axiosInstance";
import {useAsync} from "react-async-hook";

export const TrashService = {
    GetRoutesList(searchParams: any) {
        return useAsync(async () => {
            return await $axios.get(
                "/trash/routes/" + CreateCleanSearchParams(searchParams)
            );
        }, [CreateCleanSearchParams(searchParams)]);
    },
    GetReceptionTransmissionList(searchParams: any) {
        return useAsync(async () => {
            return await $axios.get(
                "/trash/reception-transmission/" + CreateCleanSearchParams(searchParams)
            );
        }, [CreateCleanSearchParams(searchParams)]);
    },
    async RestoreFromTrash(parameters: any) {
        return await $axios.post(`/trash/restore/`, RemoveEmptyObj(parameters));
    },
};
