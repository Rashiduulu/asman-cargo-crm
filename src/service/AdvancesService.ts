import {CreateCleanSearchParams} from "../helpers/helpers";
import {$axios} from "../https/axiosInstance";
import {useAsync} from "react-async-hook";

export const AdvancesService = {
    async GetPrepaymentList(searchParams: any) {
        return await $axios.get(`/transactions/prepayments/` + CreateCleanSearchParams(searchParams));
    },

    GetGroupList() {
        return useAsync(async () => {
            return await $axios.get("/staffs/groups/");
        }, []);
    },

    GetEmployeesListWithoutPagination(searchParams?: any) {
        return useAsync(async () => {
            return await $axios.get(
                `/staffs/all/` + CreateCleanSearchParams(searchParams)
            );
        }, []);
    },

    GetCountryList() {
        return useAsync(async () => {
            return await $axios.get("/locations/countries/");
        }, []);
    },
    GetCurrencyList() {
        return useAsync(async () => {
            return await $axios.get("/staffs/currencies/");
        }, []);
    },
};
