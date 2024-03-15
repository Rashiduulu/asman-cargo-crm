import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search } from "../../components/Search";
import { CustomButton } from "../../components/CustomButton";
import {
  Box,
  Pagination,
  Modal,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { DataGrid } from "@mui/x-data-grid";
import { ClientsShippersService } from "../../service/ClientsShippersService";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { checkModalResponse } from "../../helpers/helpers";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const modalInitialValues = {
  open: false,
  values: {
    id: "",
    full_name: "",
    okpo: "",
    country: "",
    phone: "",
    inn: "",
    address: "",
  },
  validation: {
    error: {
      full_name: false,
      okpo: false,
      country: false,
      phone: false,
      inn: false,
      address: false,
    },
    message: {
      full_name: "",
      okpo: "",
      country: "",
      phone: "",
      inn: "",
      address: "",
    },
  },
  requested: false,
  action: "",
};

export const ClientsShippersPage: React.FC = () => {
  const [table, setTable] = useState<any>({
    ...tableInitialValues,
    columns: [
      { field: "id", headerName: "ID" },
      {
        field: "full_name",
        headerName: "Полное имя",
        sortable: false,
        flex: 1
      },
      {
        field: "okpo",
        headerName: "ОГРНИП | ОКПО, № патента",
        sortable: false,
        flex: 1
      },
      {
        field: "country",
        headerName: "Страна",
        renderCell: (params: any) => params.row.country?.name,
        sortable: false,
        flex: 1
      },
      { field: "phone", headerName: "Телефон", flex: 1, sortable: false },
      { field: "inn", headerName: "ИНН", flex: 1, sortable: false },
      { field: "address", headerName: "Адрес", flex: 1, sortable: false },
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
                  action: "edit",
                  values: {
                    ...params.row,
                    country: params.row.country?.id,
                  },
                });
              }}
            >
              <MdEdit />
            </IconButton>
            <IconButton
              onClick={() => {
                setModal({
                  ...modal,
                  open: true,
                  action: "delete",
                  values: {
                    ...params.row,
                    country: params.row.country?.id,
                  },
                });
              }}
            >
              <MdDeleteForever />
            </IconButton>
          </div>
        ),
      },
    ],
  });

  const [modal, setModal] = useState(modalInitialValues);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setModal({
      ...modal,
      requested: true,
    });

    switch (modal.action) {
      case "add":
        ClientsShippersService.CreateShipper(modal.values)
          .then(() => {
            setModal(modalInitialValues);
            tableList.execute();

            toast.success("Вы успешно добавили грузоотправителя!", {
              position: "top-center",
            });
          })
          .catch((err) => {
            checkModalResponse(err.response.data, setModal, modal);
          });
        break;
      case "edit":
        ClientsShippersService.UpdateShipper(modal.values)
          .then(() => {
            setModal(modalInitialValues);
            tableList.execute();
            toast.success("Вы успешно отредактировали грузоотправителя!", {
              position: "top-center",
            });
          })

          .catch((err) => {
            checkModalResponse(err.response.data, setModal, modal);
          });
        break;
      case "delete":
        ClientsShippersService.DeleteShipper(modal.values)
          .then(() => {
            setModal(modalInitialValues);
            tableList.execute();
            toast.success("Удалено!", {
              position: "top-center",
            });
          })
          .catch((err) => {
            checkModalResponse(err.response.data, setModal, modal);
          });
        break;
    }
  };

  const tableList = ClientsShippersService.GetShippersList(table.filter);
  const countryList = ClientsShippersService.GetCountryList();

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

  return (
    <section>
      <ToastContainer />
      <h1 className="text-[32px] font-bold">Грузоотправитель</h1>
      <div className="flex items-center justify-between mt-[63px]">
        <div className="flex items-center gap-[30px]">
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
          <FormControl variant="standard" className="select-cargo">
            <InputLabel>Грузоотправитель</InputLabel>
            <Select>
              <Link to="/clients/shippers">
                <MenuItem>Грузоотправитель</MenuItem>
              </Link>
              <Link to="/clients/consignees">
                <MenuItem>Грузополучатель</MenuItem>
              </Link>
            </Select>
          </FormControl>
        </div>
        <CustomButton
          type="button"
          className="py-[12px] px-[55px] text-white"
          text="Добавить"
          onClick={() => setModal({ ...modal, open: true, action: "add" })}
        />
      </div>
      <div className="mt-[39px]">
        <Box className="shadow-block" sx={{ width: "100%", padding: '20px 11px' }}>
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
        onClose={() => setModal(modalInitialValues)}
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
            onClick={() => setModal(modalInitialValues)}
          >
            <IoIosCloseCircleOutline className="text-[28px] text-[#1C61D5]" />
          </IconButton>
          <h2 className="text-[30px] font-[600] text-[#1E1C2A] mb-[40px]">
            {modal.action === "add" && "Добавить грузоотправителя"}
            {modal.action === "edit" && "Редактирование грузоотправителя"}
            {modal.action === "delete" && "Удалить грузоотправителя?"}
          </h2>
          {modal.action !== "delete" && (
            <div className="w-full grid grid-cols-2 gap-[30px] mb-[50px]">
              <TextField
                fullWidth
                label="Полное имя"
                variant="standard"
                type={"text"}
                value={modal.values.full_name}
                error={modal.validation.error.full_name}
                helperText={modal.validation.message.full_name}
                onChange={(e) => {
                  setModal({
                    ...modal,
                    values: {
                      ...modal.values,
                      full_name: e.target.value,
                    },
                  });
                }}
              />
              <TextField
                fullWidth
                label="ОГРНИП | ОКПО, № патента"
                variant="standard"
                type={"text"}
                value={modal.values.okpo}
                error={modal.validation.error.okpo}
                helperText={modal.validation.message.okpo}
                onChange={(e) => {
                  setModal({
                    ...modal,
                    values: {
                      ...modal.values,
                      okpo: e.target.value,
                    },
                  });
                }}
              />
              <FormControl variant="standard">
                <InputLabel>Страна</InputLabel>
                <Select
                  label="Страна"
                  value={modal.values.country}
                  error={modal.validation.error.country}
                  onChange={(event: any) => {
                    setModal({
                      ...modal,
                      values: {
                        ...modal.values,
                        country: event.target.value,
                      },
                    });
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {!countryList.loading &&
                    !countryList.error &&
                    countryList.result?.data.map(
                      (country: any, index: number) => (
                        <MenuItem key={index} value={country.id}>
                          {country.name}
                        </MenuItem>
                      )
                    )}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Телефон"
                variant="standard"
                type={"text"}
                error={modal.validation.error.phone}
                helperText={modal.validation.message.phone}
                value={modal.values.phone}
                onChange={(e) => {
                  setModal({
                    ...modal,
                    values: {
                      ...modal.values,
                      phone: e.target.value,
                    },
                  });
                }}
              />
              <TextField
                fullWidth
                label="ИНН"
                variant="standard"
                type={"number"}
                error={modal.validation.error.inn}
                helperText={modal.validation.message.inn}
                value={modal.values.inn}
                onChange={(e) => {
                  setModal({
                    ...modal,
                    values: {
                      ...modal.values,
                      inn: e.target.value,
                    },
                  });
                }}
              />
              <TextField
                fullWidth
                label="Адрес"
                variant="standard"
                type={"text"}
                error={modal.validation.error.address}
                helperText={modal.validation.message.address}
                value={modal.values.address}
                onChange={(e) => {
                  setModal({
                    ...modal,
                    values: {
                      ...modal.values,
                      address: e.target.value,
                    },
                  });
                }}
              />
            </div>
          )}
          <div className="flex justify-between gap-[40px] items-center mt-[20px]">
            <CustomButton
              onClick={() => setModal(modalInitialValues)}
              type="button"
              className="py-[12px] px-[80px] bg-transparent border-[2px] border-[#1C61D5] text-[#1C61D5] hover:bg-transparent"
              text="Отменить"
            />

            <CustomButton
              type="submit"
              className="py-[12px] px-[80px] text-white"
              loading={modal.requested}
              text={
                modal.action === "delete"
                  ? "Удалить"
                  : modal.action === "edit"
                  ? "Готово"
                  : modal.action === "add" && "Добавить"
              }
            />
          </div>
        </form>
      </Modal>
    </section>
  );
};
