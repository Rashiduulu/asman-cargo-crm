import {CreateCleanSearchParams, RemoveEmptyObj} from "../helpers/helpers";
import {$axios} from "../https/axiosInstance";
import {useAsync} from "react-async-hook";

export const WarehouseService = {
    GetWarehouseList(searchParams: any) {
        return useAsync(async () => {
            return await $axios.get(
                "/warehouse/" + CreateCleanSearchParams(searchParams)
            );
        }, [CreateCleanSearchParams(searchParams)]);
    },
    GetWarehouseBagsList(searchParams: any) {
        return useAsync(async () => {
            return await $axios.get(
                "/warehouse/bags/" + CreateCleanSearchParams(searchParams)
            );
        }, [CreateCleanSearchParams(searchParams)]);
    },
    GetWarehouse(id: any) {
        return useAsync(async () => {
            return await $axios.get(
                `/warehouse/${id}/`
            );
        }, []);
    },
    async WarehouseCreate(parameters: any) {
        return await $axios.post(`/warehouse/`, RemoveEmptyObj(parameters));
    },
    async WarehouseUpdate(parameters: any) {
        return await $axios.put(`/warehouse/${parameters.id}/`, RemoveEmptyObj(parameters));
    },
    async WarehouseDelete(parameters: any) {
        return await $axios.delete(`/warehouse/${parameters.id}/`);
    },


    async WarehouseBagCreate(parameters: any) {
        return await $axios.post(`/warehouse/bags/`, RemoveEmptyObj(parameters));
    },
    async WarehouseBagUpdate(parameters: any) {
        return await $axios.put(`/warehouse/bags/${parameters.id}/`, RemoveEmptyObj(parameters));
    },
    async WarehouseBagPartialUpdate(parameters: any) {
        return await $axios.patch(`/warehouse/bags/${parameters.id}/`, RemoveEmptyObj(parameters));
    },
    async WarehouseBagDelete(parameters: any) {
        return await $axios.delete(`/warehouse/bags/${parameters.id}/`);
    },


    async WarehouseBagsUpdate(parameters: any) {
        return await $axios.post(`/warehouse/bags/update-status/`, {
            bag_ids: parameters.bag_ids
        });
    },
};
