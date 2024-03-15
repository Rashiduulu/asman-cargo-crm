import { CreateCleanSearchParams, RemoveEmptyObj } from "../helpers/helpers";
import { $axios } from "../https/axiosInstance";
import { useAsync } from "react-async-hook";

export const ClientsShippersService = {
  GetShippersList(searchParams: any) {
    return useAsync(async () => {
      return await $axios.get(
        "/clients/shippers/" + CreateCleanSearchParams(searchParams)
      );
    }, [CreateCleanSearchParams(searchParams)]);
  },

  GetShippersListWithoutPagination() {
    return useAsync(async () => {
      return await $axios.get(
          "/clients/shippers/all/"
      );
    }, []);
  },

  GetCountryList() {
    return useAsync(async () => {
      return await $axios.get("/locations/countries/");
    }, []);
  },

  async UpdateShipper(shipper: any) {
    return await $axios.put(
      `/clients/shippers/${shipper.id}/`,
      RemoveEmptyObj(shipper)
    );
  },
  async CreateShipper(shipper: any) {
    return await $axios.post("/clients/shippers/", RemoveEmptyObj(shipper));
  },
  async DeleteShipper(shipper: any) {
    return await $axios.delete(`/clients/shippers/${shipper.id}/`);
  },
};
