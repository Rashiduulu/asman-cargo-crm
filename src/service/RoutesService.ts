import { CreateCleanSearchParams, RemoveEmptyObj } from "../helpers/helpers";
import { $axios } from "../https/axiosInstance";
import { useAsync } from "react-async-hook";

export const RoutesService = {
  GetRoutesList(searchParams: any) {
    return useAsync(async () => {
      return await $axios.get(
        "/routes/" + CreateCleanSearchParams(searchParams)
      );
    }, [CreateCleanSearchParams(searchParams)]);
  },
  GetRoutes(id: any) {
    return useAsync(async () => {
      return await $axios.get(
          `/routes/${id}/detail/`
      );
    }, [id]);
  },

  GetRoutesListByParams(searchParams: any) {
    return useAsync(async () => {
      return await $axios.get(
        "/routes/all/" +
          CreateCleanSearchParams(searchParams)
      );
    }, [CreateCleanSearchParams(searchParams)]);
  },
  
  GetCountryList() {
    return useAsync(async () => {
      return await $axios.get("/locations/countries/");
    }, []);
  },

  GetTransportTypeList() {
    return useAsync(async () => {
      return await $axios.get("/routes/transport-type/");
    }, []);
  },

  GetCargoStatusList() {
    return useAsync(async () => {
      return await $axios.get("/routes/cargo-status/");
    }, []);
  },
  async UpdateRoute(route: any) {
    return await $axios.patch(`/routes/${route.id}/`, RemoveEmptyObj(route));
  },
  async CreateRoute(route: any) {
    return await $axios.post("/routes/", RemoveEmptyObj(route));
  },
  async DeleteRoute(route: any) {
    return await $axios.delete(`/routes/${route.id}/`);
  },
  async GetRouteById(employee_id: string) {
    return await $axios.get(`/routes/${employee_id}/`);
  },
};
