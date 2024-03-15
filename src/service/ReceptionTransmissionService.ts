import {CreateCleanSearchParams, RemoveEmptyObj} from "../helpers/helpers";
import {$axios} from "../https/axiosInstance";
import {useAsync} from "react-async-hook";

export const ReceptionTransmissionService = {
    GetReceptionTransmissionList(searchParams: any) {
        return useAsync(async () => {
            return await $axios.get(
                "/reception-transmission/" + CreateCleanSearchParams(searchParams)
            );
        }, [CreateCleanSearchParams(searchParams)]);
    },
    GetPlaceOfRegistrationList() {
        return useAsync(async () => {
            return await $axios.get("/reception-transmission/place-of-registration/");
        }, []);
    },
    GetReceptionTransmissionAllList() {
        return useAsync(async () => {
            return await $axios.get("/reception-transmission/all/");
        }, []);
    },
    GetInitialServiceList(searchParams?: any) {
        return useAsync(async () => {
            return await $axios.get(
                "/reception-transmission/services/" + CreateCleanSearchParams(searchParams),
            );
        }, [CreateCleanSearchParams(searchParams)]);
    },
    GetProductCategoryList() {
        return useAsync(async () => {
            return await $axios.get(
                "/reception-transmission/product-category/",
            );
        }, []);
    },
    async UpdateReceptionTransmission(receptionTransmission: any) {
        return await $axios.put(
            `/reception-transmission/${receptionTransmission.id}/`,
            RemoveEmptyObj(receptionTransmission)
        );
    },
    async CreateReceptionTransmission(receptionTransmission: any) {
        return await $axios.post(
            "/reception-transmission/",
            RemoveEmptyObj(receptionTransmission)
        );
    },
    async DeleteReceptionTransmission(receptionTransmission: any) {
        return await $axios.delete(
            `/reception-transmission/${receptionTransmission.id}/`
        );
    },
    async GetReceptionTransmissionById(receptionTransmissionId: string) {
        return await $axios.get(
            `/reception-transmission/${receptionTransmissionId}/`
        );
    },
};
