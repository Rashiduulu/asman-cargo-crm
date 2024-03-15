import React, { useEffect, useState } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { Search } from "../../components/Search";
import { CustomButton } from "../../components/CustomButton";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Modal,
  Pagination,
  Select,
} from "@mui/material";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { DataGrid } from "@mui/x-data-grid";
import { RoutesService } from "../../service/RoutesService";
import { checkModalResponse } from "../../helpers/helpers";
import moment from "moment";
import { useSelector } from "react-redux";
import { accessRules } from "../../components/Middleware";

const initialValues = {
  open: false,
  values: {
    id: "",
    route_id: "",
    country: "",
    exchange_rate: "",
    date: "",
    transport_type: "",
    cargo_status: "",
    status: "",
    control_status: "",
    places_status: "",
    note: "",
    movers: "",
  },
  validation: {
    error: {
      route_id: false,
      country: false,
      exchange_rate: false,
      date: false,
      transport_type: false,
      cargo_status: false,
      status: false,
      control_status: false,
      places_status: false,
      note: false,
      movers: false,
    },
    message: {
      route_id: "",
      country: "",
      exchange_rate: "",
      date: "",
      transport_type: "",
      cargo_status: "",
      status: "",
      control_status: "",
      places_status: "",
      note: "",
      movers: "",
    },
  },
  requested: false,
  showPassword: false,
};

const tableInitialValues = {
  rows: [],
  status: {
    loading: false,
    error: false,
    message: "",
  },
  filter: {
    search: "",
    start_date: null,
    end_date: null,
    page: 1,
    size: 20,
    total_pages: 1,
  },
};

export const RoutesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userGroup = useSelector((state: any) => state.user.group);

  const [pageAccessRule] = useState(() => {
    let rule: any = {};
    for (const key in accessRules) {
      if (location.pathname.includes(key)) {
        rule = accessRules[key].find(
          (position: any) => position.group === userGroup
        );
      }
    }
    return rule.privileges;
  });

  const [table, setTable] = useState<any>({
    ...tableInitialValues,
    columns: [
      { field: "id", headerName: "ID" },
      {
        field: "route_id",
        headerName: "Номер рейса",
        sortable: false,
      },
      {
        field: "total_weight",
        headerName: "Вес",
        sortable: false,
      },
      {
        field: "total_bags",
        headerName: "Мест",
        sortable: false,
      },
      {
        field: "transport_type",
        headerName: "Тип транспорта",
        renderCell: (params: any) => params.row.transport_type?.name,
        sortable: false,
      },
      {
        field: "country",
        headerName: "Страна",
        renderCell: (params: any) => params.row.country?.name,
        sortable: false,
      },
      {
        field: "date",
        headerName: "Дата",
        valueFormatter: (params: any) => {
          return moment(params.value).format("DD.MM.YY");
        },
        sortable: false,
      },
      {
        field: "status",
        headerName: "Статус",
        valueGetter: (params: any) => {
          const status = params.value;
          return status ? "Открыт" : "Закрыт";
        },
        renderCell: (params: any) => {
          const status = params.value;
          let cellColor = "";
          if (status === "Открыт") {
            cellColor = "bg-[#01D70A19] text-[#01D70A] border-[#01D70A]";
          } else if (status === "Закрыт") {
            cellColor = "bg-[#D701011A] text-[#D70101] border-[#D70101]";
          }
          return (
            <div
              className={`rounded-full px-3 py-1 border-[2px] font-medium ${cellColor}`}
            >
              {status}
            </div>
          );
        },
        sortable: false,
      },
      {
        field: "control_status",
        headerName: "Контрольный статус",
        valueGetter: (params: any) => {
          const status = params.value;
          return status ? "Открыт" : "Закрыт";
        },
        renderCell: (params: any) => {
          const status = params.value;
          let cellColor = "";
          if (status === "Открыт") {
            cellColor = "bg-[#01D70A19] text-[#01D70A] border-[#01D70A]";
          } else if (status === "Закрыт") {
            cellColor = "bg-[#D701011A] text-[#D70101] border-[#D70101]";
          }
          return (
            <div className={`rounded-full px-3 py-1 border-[2px] ${cellColor}`}>
              {status}
            </div>
          );
        },
        sortable: false,
      },

      {
        field: "actions",
        headerName: "",
        sortable: false,
        renderCell: (params: any) => {
          if (params.row.control_status === false) {
            return null;
          }
          return (
            <div className="flex justify-start gap-3 text-[20px] text-[#1C61D5]">
              {pageAccessRule.edit && (
                <IconButton
                  onClick={() => {
                    navigate({
                      pathname: "/routes/details",
                      search: createSearchParams({
                        action: "edit",
                        list_of_route_id: params.row.id,
                      }).toString(),
                    });
                  }}
                >
                  <MdEdit />
                </IconButton>
              )}
              {pageAccessRule.delete && (
                <IconButton
                  onClick={() => {
                    setModal({
                      ...modal,
                      open: true,
                      values: {
                        ...params.row,
                        employee_id: params.row.id,
                      },
                    });
                  }}
                >
                  <MdDeleteForever />
                </IconButton>
              )}
            </div>
          );
        },
      },
    ],
  });

  const [modal, setModal] = useState(initialValues);

  const tableList = RoutesService.GetRoutesList(table.filter);
  const cargoStatusList = RoutesService.GetCargoStatusList();

  useEffect(() => {
    cargoStatusList.execute();
  }, []);

  useEffect(() => {
    if (!cargoStatusList.loading && !cargoStatusList.error) {
      const tableColumns = [...table.columns];
      tableColumns.splice(tableColumns.length - 1, 0, {
        field: "cargo_status",
        headerName: "Статус груза",
        width: 140,
        sortable: false,
        renderCell: (params: any) => {
          return (
            <div className="cargo-status-select w-[130px]">
              <FormControl className="w-[130px]" fullWidth variant="standard">
                <Select
                  defaultValue={params.row.cargo_status?.id}
                  onChange={(event: any) => {
                    RoutesService.UpdateRoute({
                      id: params.row.id,
                      cargo_status: event.target.value,
                    }).then(() => {
                      tableList.execute();
                    });
                  }}
                >
                  {cargoStatusList.result?.data.map(
                    (cargoStatus: any, index: number) => (
                      <MenuItem key={index} value={cargoStatus.id}>
                        {cargoStatus.name}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </div>
          );
        },
      });

      setTable({
        ...table,
        columns: tableColumns,
      });
    }
  }, [
    cargoStatusList.loading,
    cargoStatusList.error,
    cargoStatusList.result?.data,
  ]);

  useEffect(() => {
    if (tableList.loading) {
      setTable((prevState: any) => ({
        ...prevState,
        status: {
          ...prevState.status,
          loading: true,
        },
      }));
    } else if (tableList.error) {
      setTable((prevState: any) => ({
        ...prevState,
        status: {
          ...prevState.status,
          loading: false,
          error: true,
        },
      }));
    } else {
      const data = tableList.result?.data;
      setTable((prevState: any) => ({
        ...prevState,
        rows: data.results,
        status: {
          ...prevState.status,
          loading: false,
          error: false,
        },
        filter: {
          ...prevState.filter,
          page: data.current_page,
          total_pages: data.total_pages,
        },
      }));
    }
  }, [tableList.loading, tableList.error, tableList.result?.data]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setModal({
      ...modal,
      requested: true,
    });
    RoutesService.DeleteRoute(modal.values)
      .then(() => {
        setModal(initialValues);
        tableList.execute();
        toast.success("Удалено!", {
          position: "top-center",
        });
      })
      .catch((err) => {
        checkModalResponse(err.response.data, setModal, modal);
      });
  };

  return (
    <section>
      <ToastContainer />
      <h1 className="text-[32px] font-bold">Рейсы</h1>

      <div className="flex items-center justify-between mt-[63px]">
        <Search
          value={table.filter.search}
          onChange={(e) => {
            setTable({
              ...table,
              filter: {
                ...table.filter,
                search: e.target.value,
              },
            });
          }}
        />
        {pageAccessRule.edit && (
          <CustomButton
            type="button"
            className="py-[12px] px-[20px] text-white"
            text="Добавить"
            onClick={() =>
              navigate({
                pathname: "/routes/details",
                search: createSearchParams({
                  action: "add",
                }).toString(),
              })
            }
          />
        )}
      </div>

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
            hideFooter
            autoHeight
            disableRowSelectionOnClick
            onRowDoubleClick={(params: any) => {
              navigate({
                pathname: `/routes/${params.row.id}`,
              });
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#fff",
                color: "#252525",
              },
            }}
          />
        </Box>

        <div className="flex justify-end mt-[40px] mb-[80px]">
          <Pagination
            color="primary"
            count={table.filter.total_pages}
            page={table.filter.page}
            onChange={(event, value: number) => {
              setTable({
                ...table,
                filter: {
                  ...table.filter,
                  page: value,
                },
              });
            }}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={modal.open}
        onClose={() => setModal(initialValues)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form
          onSubmit={handleFormSubmit}
          className="mainModal relative flex flex-col justify-start items-center"
        >
          <IconButton
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
            onClick={() => setModal(initialValues)}
          >
            <IoIosCloseCircleOutline className="text-[28px] text-[#1C61D5]" />
          </IconButton>

          <h2 className="text-[30px] font-[600] text-[#1E1C2A] mb-[40px]">
            Удалить рейса ?
          </h2>

          <div className="flex justify-between gap-[40px] items-center mt-[20px]">
            <CustomButton
              onClick={() => setModal(initialValues)}
              type="button"
              className="py-[12px] px-[80px] bg-transparent border-[2px] border-[#1C61D5] text-[#1C61D5] hover:bg-transparent"
              text="Отменить"
            />

            <CustomButton
              type="submit"
              className="py-[12px] px-[80px] text-white"
              loading={modal.requested}
              text="Удалить"
            />
          </div>
        </form>
      </Modal>
    </section>
  );
};
