import React, { FormEvent, useState } from "react";
import { CustomButton } from "../../components/CustomButton";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { DataGrid, GridFooterContainer } from "@mui/x-data-grid";
import { MdLocalPrintshop } from "react-icons/md";
import { RoutesService } from "../../service/RoutesService";
import { DebitsService } from "../../service/DebitsService";
import { EmployeesService } from "../../service/EmployeesService";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IoIosCloseCircleOutline } from "react-icons/io";

const tableInitialValues = {
  rows: [],
  filter: {
    route: "",
    transport_type: "",
    staff: "",
    show_result: false,
    requested: false,
  },
  file: "",
  total_sum: "0",
  total_payed_sum: "0",
  remaining_amount: "0",
};
const modalInitialValues = {
  open: false,
  client_id: "",
  full_name: "",
  rows: [],
  totals: {
    remaining_amount: "",
    total_payed_sum: "",
    total_sum: "",
  },
};

export const DebitsPage: React.FC = () => {
  const [modal, setModal] = useState<any>({
    ...modalInitialValues,
    columns: [
      { field: "id", headerName: "ID", width: 80 },
      {
        field: "route",
        headerName: "Рейс",
        sortable: false,
        flex: 1,
        renderCell: (params: any) => params.row.route?.route_id,
      },
      {
        field: "total_sum_rub",
        headerName: "Сумма",
        sortable: false,
        flex: 1,
      },
      {
        field: "total_payed_sum",
        headerName: "Приход",
        sortable: false,
        flex: 1,
      },
      {
        field: "remaining_amount",
        headerName: "Остаток",
        sortable: false,
        flex: 1,
      },
    ],
  });
  const [table, setTable] = useState<any>({
    ...tableInitialValues,
    columns: [
      { field: "id", headerName: "№", width: 80 },
      {
        field: "client_id",
        headerName: "Код",
        sortable: false,
        flex: 1,
      },
      {
        field: "full_name",
        headerName: "Получатель",
        sortable: false,
        flex: 1,
      },
      {
        field: "market_consignee",
        headerName: "Рынок",
        sortable: false,
        flex: 1,
        renderCell: (params: any) => "",
      },
      {
        field: "market_consignee_container",
        headerName: "Контейнер",
        sortable: false,
        flex: 1,
        renderCell: (params: any) => "",
      },
      {
        field: "total_sum",
        headerName: "Всего (руб.)",
        sortable: false,
        flex: 1,
        renderCell: (params: any) =>
          params.row.reception_transmissions?.totals?.total_sum,
      },
      {
        field: "total_payed_sum",
        headerName: "Приход",
        sortable: false,
        flex: 1,
        renderCell: (params: any) =>
          params.row.reception_transmissions?.totals?.total_payed_sum,
      },
      {
        field: "remaining_amount",
        headerName: "Долг",
        sortable: false,
        flex: 1,
        renderCell: (params: any) =>
          params.row.reception_transmissions?.totals?.remaining_amount,
      },
      {
        field: "action",
        headerName: "",
        sortable: false,
        renderCell: (params: any) => (
          <IconButton
            onClick={() => {
              setModal({
                ...modal,
                open: true,
                client_id: params.row.client_id,
                full_name: params.row.full_name,
                rows: [...params.row.reception_transmissions?.data],
                totals: {
                  remaining_amount:
                    params.row.reception_transmissions?.totals
                      ?.remaining_amount,
                  total_payed_sum:
                    params.row.reception_transmissions?.totals?.total_payed_sum,
                  total_sum:
                    params.row.reception_transmissions?.totals?.total_sum,
                },
              });
            }}
          >
            <MoreVertIcon />
          </IconButton>
        ),
      },
    ],
  });

  const staffList = EmployeesService.GetEmployeesListWithoutPagination();
  const transport_types = RoutesService.GetTransportTypeList();
  const routesList = RoutesService.GetRoutesListByParams({
    transport_type: table.filter.transport_type,
  });

  const handleGetResults = (e: FormEvent) => {
    e.preventDefault();
    setTable((prevState: any) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        requested: true,
        show: false,
      },
    }));

    const filter = table.filter;

    DebitsService.GetDebits(filter).then((res: any) => {
      const data = res.data;
      setTable((prevState: any) => ({
        ...prevState,
        rows: [...data.data],
        filter: {
          ...prevState.filter,
          show: true,
          requested: false,
        },
        file: data.file,
        total_sum: data.total_sum,
        total_payed_sum: data.total_payed_sum,
        remaining_amount: data.remaining_amount,
      }));
    });
  };
  return (
    <section className="advances pb-[60px]">
      <ToastContainer />
      <h1 className="text-[32px] font-bold">Отчет дебиторки</h1>

      <form className="w-full mt-[60px]" onSubmit={handleGetResults}>
        <div className="px-[37px] py-[40px] bg-white rounded-[7px]">
          <div className="w-full  grid grid-cols-3 gap-[50px]">
            <FormControl required fullWidth variant="standard">
              <InputLabel>Направление</InputLabel>
              <Select
                value={table.filter.transport_type}
                onChange={(e) => {
                  setTable((prevTable: any) => ({
                    ...prevTable,
                    filter: {
                      ...prevTable.filter,
                      transport_type: e.target.value,
                      route: "",
                      show: false,
                    },
                  }));
                }}
              >
                {!transport_types.loading &&
                  !transport_types.error &&
                  transport_types.result?.data.map(
                    (item: any, index: number) => (
                      <MenuItem key={index} value={item.id}>
                        {item.name}
                      </MenuItem>
                    )
                  )}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="standard">
              <InputLabel>Рейс</InputLabel>
              <Select
                value={table.filter.route}
                onChange={(e) => {
                  setTable((prevTable: any) => ({
                    ...prevTable,
                    filter: {
                      ...prevTable.filter,
                      route: e.target.value,
                      show: false,
                    },
                  }));
                }}
              >
                {!routesList.loading &&
                  !routesList.error &&
                  routesList.result?.data.map((item: any, index: number) => (
                    <MenuItem key={index} value={item.id}>
                      {`${item.route_id}/${item.transport_type?.name}`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl required={false} fullWidth variant="standard">
              <InputLabel>Контрагент</InputLabel>
              <Select
                value={table.filter.staff}
                onChange={(e) => {
                  setTable((prevTable: any) => ({
                    ...prevTable,
                    filter: {
                      ...prevTable.filter,
                      staff: e.target.value,
                      show: false,
                    },
                  }));
                }}
              >
                {!staffList.loading &&
                  !staffList.error &&
                  staffList.result?.data.map((item: any, index: number) => (
                    <MenuItem key={index} value={item.id}>
                      {item.full_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex w-full justify-end mt-[70px]">
            <CustomButton
              type="submit"
              className="py-[8px] px-[20px] text-white"
              text="Показать"
              disabled={table.filter.requested}
              loading={table.filter.requested}
            />
          </div>
        </div>
      </form>

      {table.filter.show && (
        <div className="mt-[39px]">
          <Box
            className="shadow-block"
            sx={{ width: "100%", padding: "20px 11px" }}
          >
            <DataGrid
              rows={table.rows}
              columns={table.columns}
              checkboxSelection={false}
              keepNonExistentRowsSelected
              disableColumnFilter
              disableColumnMenu
              autoHeight
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#fff",
                  color: "#252525",
                },
              }}
              slots={{
                footer: () => {
                  return (
                    <GridFooterContainer>
                      <div className="w-full flex justify-end px-[20px] gap-[30px]">
                        <p className="text-[14px] text-[#252525] font-[700]">
                          Итоговая сумма: {table.total_sum}
                        </p>
                        <p className="text-[14px] text-[#252525] font-[700]">
                          Оплачено: {table.total_payed_sum}
                        </p>
                        <p className="text-[14px] text-[#252525] font-[700]">
                          Долг: {table.remaining_amount}
                        </p>
                      </div>
                    </GridFooterContainer>
                  );
                },
              }}
            />
            <div className="flex w-full justify-end mt-[40px]">
              <div
                className="cursor-pointer flex items-center gap-2 py-[8px] px-[20px] bg-[#1C61D5] rounded-[10px]"
                onClick={() => {
                  window.open(table.file, "_blank");
                }}
              >
                <MdLocalPrintshop className="text-[20px] text-white" />
                <CustomButton
                  type="button"
                  className=" text-white hover:bg-transparent"
                  text="Печать"
                />
              </div>
            </div>
          </Box>

          {/* Modal */}
          <Modal open={modal.open} onClose={() => setModal(modalInitialValues)}>
            <div className="mainModal relative flex flex-col justify-start items-center">
              <IconButton
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                }}
                onClick={() => setModal(modalInitialValues)}
              >
                <IoIosCloseCircleOutline className="text-[28px] text-[#1C61D5]" />
              </IconButton>

              <h2 className="text-[14px] font-[700] text-[#1E1C2A] mb-[24px]">
                Получатель: {modal.full_name}
              </h2>

              <div className="w-full overflow-y-auto">
                <DataGrid
                  rows={modal.rows}
                  columns={modal.columns}
                  checkboxSelection={false}
                  keepNonExistentRowsSelected
                  disableColumnFilter
                  disableColumnMenu
                  autoHeight
                  disableRowSelectionOnClick
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#fff",
                      color: "#252525",
                    },
                  }}
                  slots={{
                    footer: () => {
                      return (
                        <GridFooterContainer>
                          <div className="w-full flex justify-end px-[20px] gap-[30px]">
                            <p className="text-[14px] text-[#252525] font-[700]">
                              Итоговая сумма: {modal.totals.total_sum}
                            </p>
                            <p className="text-[14px] text-[#252525] font-[700]">
                              Оплачено: {modal.totals.total_payed_sum}
                            </p>
                            <p className="text-[14px] text-[#252525] font-[700]">
                              Долг: {modal.totals.remaining_amount}
                            </p>
                          </div>
                        </GridFooterContainer>
                      );
                    },
                  }}
                />
              </div>
            </div>
          </Modal>
        </div>
      )}
    </section>
  );
};
