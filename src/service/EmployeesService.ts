import { CreateCleanSearchParams, RemoveEmptyObj } from "../helpers/helpers";
import { $axios } from "../https/axiosInstance";
import { useAsync } from "react-async-hook";

export const EmployeesService = {
  GetEmployeesList(searchParams: any) {
    return useAsync(async () => {
      return await $axios.get(
        "/staffs/" + CreateCleanSearchParams(searchParams)
      );
    }, [CreateCleanSearchParams(searchParams)]);
  },
  GetGroupList() {
    return useAsync(async () => {
      return await $axios.get("/staffs/groups/");
    }, []);
  },

  GetEmployeesListWithoutPagination(searchParams?: any) {
    return useAsync(async () => {
      return await $axios.get(`/staffs/all/` + CreateCleanSearchParams(searchParams));
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
  async UpdateEmployee(staff: any) {
    return await $axios.put(`/staffs/${staff.id}/`, RemoveEmptyObj(staff));
  },
  async CreateEmployee(staff: any) {
    return await $axios.post("/staffs/", RemoveEmptyObj(staff));
  },
  async DeleteEmployee(staff: any) {
    return await $axios.delete(`/staffs/${staff.id}/`);
  },
  async GetEmployeeById(employee_id: string) {
    return await $axios.get(`/staffs/${employee_id}/`);
  },
};
