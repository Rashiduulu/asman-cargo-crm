import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { DataGrid } from "@mui/x-data-grid";
import { RoutesService } from "../../service/RoutesService";
import moment from "moment";
import ReplayIcon from "@mui/icons-material/Replay";
import { TrashService } from "../../service/TrashService";

const initialValues = {
  open: false,
  values: { id: "" },
  validation: {
    error: {},
    message: {},
  },
  requested: false,
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

export const TrashRoutesPage: React.FC = () => {
  const navigate = useNavigate();

  const [table, setTable] = useState<any>({
    ...tableInitialValues,
    columns: [
      { field: "id", headerName: "ID" },
      {
        field: "route_id",
        headerName: "Номер рейса",
        flex: 1,
        sortable: false,
      },
      {
        field: "weight",
        headerName: "Вес",
        sortable: false,
        flex: 1,
      },
      {
        field: "asd",
        headerName: "Мест",
        sortable: false,
        flex: 1,
      },
      { field: "note", headerName: "Примечание", width: 100, sortable: false },
      {
        field: "country",
        headerName: "Страна",
        renderCell: (params: any) => params.row.country?.name,
        sortable: false,
        flex: 1,
      },
      {
        field: "date",
        headerName: "Дата",
        valueFormatter: (params: any) => {
          return moment(params.value).format("DD.MM.YY");
        },
        sortable: false,
        flex: 1,
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
        flex: 1,
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
        flex: 1,
      },

      {
        field: "actions",
        headerName: "",
        width: 110,
        sortable: false,
        renderCell: (params: any) => (
          <div className="flex justify-start gap-3 text-[20px] text-[#1C61D5]">
            <IconButton
              onClick={() => {
                setModal({
                  ...modal,
                  open: true,
                  values: {
                    id: params.row.id,
                  },
                });
              }}
            >
              <ReplayIcon />
            </IconButton>
          </div>
        ),
      },
    ],
  });

  const [modal, setModal] = useState(initialValues);

  const tableList = TrashService.GetRoutesList(table.filter);
  const cargoStatusList = RoutesService.GetCargoStatusList();

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
    TrashService.RestoreFromTrash({
      id: modal.values.id,
      slug: "routes",
    }).then(() => {
      setModal(initialValues);
      tableList.execute();
    });
  };

  return (
    <section>
      <ToastContainer />
      <h1 className="text-[32px] font-bold">Корзина - Рейсы</h1>

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
            // onRowDoubleClick={(params: any) => {
            //   navigate({
            //     pathname: "/routes/details",
            //     search: createSearchParams({
            //       action: "edit",
            //       list_of_route_id: params.row.id,
            //     }).toString(),
            //   });
            // }}
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
            Восстановить рейс?
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
              text="Готово"
            />
          </div>
        </form>
      </Modal>
    </section>
  );
};
