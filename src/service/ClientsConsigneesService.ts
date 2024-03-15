import {CreateCleanSearchParams} from "../helpers/helpers";
import {$axios} from "../https/axiosInstance";
import {useAsync} from "react-async-hook";

export const ClientsConsigneesService = {
  GetConsigneesList(searchParams: any) {
    return useAsync(async () => {
      return await $axios.get(
        "/clients/consignees/" + CreateCleanSearchParams(searchParams)
      );
    }, [CreateCleanSearchParams(searchParams)]);
  },

  GetConsigneesListWithoutPagination() {
    return useAsync(async () => {
      return await $axios.get("/clients/consignees/all/");
    }, []);
  },

  GetCountryList() {
    return useAsync(async () => {
      return await $axios.get("/locations/countries/");
    }, []);
  },
  // GetCityList() {
  //   return useAsync(async () => {
  //     return await $axios.get("/locations/cities/");
  //   }, []);
  // },
  GetCityList(searchParams: any) {
    return useAsync(async () => {
      return await $axios.get(
        "/locations/cities/" +
          CreateCleanSearchParams(searchParams)
      );
    }, [CreateCleanSearchParams(searchParams)]);
  },


  async UpdateConsignee(consignee: any) {
    return await $axios.put(`/clients/consignees/${consignee.id}/`, consignee);
  },
  async CreateConsignee(consignee: any) {
    return await $axios.post("/clients/consignees/", consignee);
  },
  async DeleteConsignee(consignee: any) {
    return await $axios.delete(`clients/consignees/${consignee.id}/`);
  },
  async GetConsigneeById(employee_id: string) {
    return await $axios.get(`clients/consignees/${employee_id}/`);
  },
};
