import {CreateCleanSearchParams, RemoveEmptyObj} from "../helpers/helpers";
import {$axios} from "../https/axiosInstance";
import {useAsync} from "react-async-hook";

export const SalariesService = {
    GetSalaryList(searchParams: any) {
        return useAsync(async () => {
            return await $axios.get(
                "/transactions/salaries/" + CreateCleanSearchParams(searchParams)
            );
        }, [CreateCleanSearchParams(searchParams)]);
    },
    async GetSalaryReportList(searchParams: any) {
        return await $axios.post(
            "/transactions/salaries/report-list/",
            RemoveEmptyObj(searchParams)
        );
    },
    async UpdateSalary(values: any) {
        return await $axios.put(
            `/transactions/salaries/${values.id}/`,
            RemoveEmptyObj(values)
        );
    },
    async CreateSalary(values: any) {
        return await $axios.post(
            "/transactions/salaries/",
            RemoveEmptyObj(values)
        )
    },
    async DeleteSalary(values: any) {
        return await $axios.delete(
            `/transactions/salaries/${values.id}/`
        );
    },
    async GetSalaryById(salary_id: string) {
        return await $axios.get(
            `/transactions/salaries/${salary_id}/`
        );
    },
};
