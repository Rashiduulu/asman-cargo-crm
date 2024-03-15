import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";
import { CustomButton } from "../../components/CustomButton";
import { checkModalResponse } from "../../helpers/helpers";
import {
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { RoutesService } from "../../service/RoutesService";
import "rsuite/DatePicker/styles/index.css";
import moment from "moment";
import { EmployeesService } from "../../service/EmployeesService";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const employeesInitialValues = {
  open: false,
  values: {
    id: "",
    route_id: "",
    country: "",
    exchange_rate: "",
    date: null,
    transport_type: "",
    cargo_status: "",
    status: true,
    control_status: true,
    places_status: true,
    note: "",
    movers: [],
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
      non_field_errors: "",
    },
  },
  requested: false,
};

const RadioSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 108,
  height: 34,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(74px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },

  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 30,
    height: 30,
  },
  "& .MuiSwitch-track": {
    borderRadius: 9999,
    backgroundColor: theme.palette.mode === "light" ? "#D70101" : "#D70101",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export const RoutesPageDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const action = params.get("action");
  const list_of_route_id = params.get("list_of_route_id");

  const getTransportTypeList = RoutesService.GetTransportTypeList();
  const countryList = RoutesService.GetCountryList();
  const cargoStatusList = RoutesService.GetCargoStatusList();
  const employeesListWithoutPagination =
    EmployeesService.GetEmployeesListWithoutPagination({
      groups__name: "Погрузчик",
    });

  const [form, setForm] = useState<any>({
    ...employeesInitialValues,
    action: action,
  });

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setForm({
      ...form,
      requested: true,
    });
    const values = form.values;

    values.date = moment(form.values.date?.$d).format("YYYY-MM-DD").toString();

    switch (form.action) {
      case "add":
        RoutesService.CreateRoute(values)
          .then((res) => {
            setForm(employeesInitialValues);
            navigate({
              pathname: "/routes",
              // search: createSearchParams({
              //   action: "add",
              // }).toString(),
            });
          })
          .catch((err) => {
            checkModalResponse(err.response.data, setForm, form);
          });
        break;

      case "edit":
        RoutesService.UpdateRoute(values)
          .then(() => {
            setForm(employeesInitialValues);
            navigate({
              pathname: "/routes",
              search: createSearchParams({
                action: "edit",
                list_of_route_id: form.values.id,
              }).toString(),
            });
          })
          .catch((err) => {
            checkModalResponse(err.response.data, setForm, form);
          });
        break;
    }
  };

  useEffect(() => {
    if (action === "edit" && list_of_route_id) {
      RoutesService.GetRouteById(list_of_route_id)
        .then((response) => {
          const routesData = response.data;
          setForm({
            ...form,
            values: {
              ...form.values,
              ...routesData,
              transport_type: routesData.transport_type?.id,
              country: routesData.country?.id,
              cargo_status: routesData.cargo_status?.id,
              movers: routesData.movers.map((shipper: any) => shipper.id),
              date: dayjs(routesData.date),
            },
          });
        })
        .catch((err) => {
          console.error("Error fetching employee details:", err);
        });
    }
  }, [action, list_of_route_id]);

  return (
    <section>
      <h1 className="text-[32px] font-bold">
        {action === "add" && "Добавить рейс"}
        {action === "edit" && "Редактировать рейс"}
      </h1>

      <form onSubmit={handleFormSubmit}>
        <div className="mt-[60px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] ">
          <div className="grid grid-cols-3 gap-[50px]">
            <TextField
              fullWidth
              required
              label="Номер рейса"
              variant="standard"
              type={"number"}
              error={form.validation.error.route_id}
              helperText={form.validation.message.route_id}
              value={form.values.route_id}
              onChange={(e) => {
                setForm({
                  ...form,
                  values: {
                    ...form.values,
                    route_id: e.target.value,
                  },
                });
              }}
            />

            <FormControl variant="standard">
              <InputLabel>Страна</InputLabel>
              <Select
                label="Страна"
                // required
                value={form.values.country}
                error={form.validation.error.country}
                onChange={(event: any) => {
                  setForm({
                    ...form,
                    values: {
                      ...form.values,
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
              required
              label="Курс по отношению рубля к сому"
              variant="standard"
              type={"text"}
              error={form.validation.error.exchange_rate}
              helperText={form.validation.message.exchange_rate}
              value={form.values.exchange_rate}
              onChange={(e) => {
                setForm({
                  ...form,
                  values: {
                    ...form.values,
                    exchange_rate: e.target.value,
                  },
                });
              }}
            />

            <DatePicker
              label="Дата"
              value={form.values.date}
              onChange={(value) => {
                setForm({
                  ...form,
                  values: {
                    ...form.values,
                    date: value,
                  },
                });
              }}
              slotProps={{
                textField: {
                  error: form.validation.error.date,
                  helperText: form.validation.message.date,
                  variant: "standard",
                  required: true,
                },
              }}
            />

            <FormControl variant="standard">
              <InputLabel>Тип транспорта</InputLabel>
              <Select
                // required
                value={form.values.transport_type}
                error={form.validation.error.transport_type}
                onChange={(event: any) => {
                  setForm({
                    ...form,
                    values: {
                      ...form.values,
                      transport_type: event.target.value,
                    },
                  });
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {!getTransportTypeList.loading &&
                  !getTransportTypeList.error &&
                  getTransportTypeList.result?.data.map(
                    (transportType: any, index: number) => (
                      <MenuItem key={index} value={transportType.id}>
                        {transportType.name}
                      </MenuItem>
                    )
                  )}
              </Select>
            </FormControl>

            <FormControl variant="standard">
              <InputLabel>Статус груза</InputLabel>
              <Select
                // required
                value={form.values.cargo_status}
                error={form.validation.error.cargo_status}
                onChange={(event: any) => {
                  setForm({
                    ...form,
                    values: {
                      ...form.values,
                      cargo_status: event.target.value,
                    },
                  });
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {!cargoStatusList.loading &&
                  !cargoStatusList.error &&
                  cargoStatusList.result?.data.map(
                    (cargoStatus: any, index: number) => (
                      <MenuItem key={index} value={cargoStatus.id}>
                        {cargoStatus.name}
                      </MenuItem>
                    )
                  )}
              </Select>
            </FormControl>
          </div>
          <div className="flex items-center gap-[56px] text-white mt-[50px]">
            <div className="relative">
              <p className="text-[12px] text-[#636569]">Контрольный статус</p>
              <FormControlLabel
                className="w-[120px] mt-2"
                label=""
                control={
                  <RadioSwitch
                    checked={form.values.control_status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        values: {
                          ...form.values,
                          control_status: event.target.checked,
                        },
                      })
                    }
                  />
                }
                onError={form.validation.error.control_status}
              />
              <div className="absolute top-[50%] cursor-default">
                <span>{form.values.control_status ? "Открыт" : ""}</span>
              </div>
              <span className="absolute top-[50%] right-[31%] cursor-default">
                {form.values.control_status ? "" : "Закрыт"}
              </span>
            </div>

            <div className="relative">
              <p className="text-[12px] text-[#636569]">Статус</p>
              <FormControlLabel
                label=""
                className="mt-2"
                control={
                  <RadioSwitch
                    checked={form.values.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        values: {
                          ...form.values,
                          status: event.target.checked,
                        },
                      })
                    }
                  />
                }
                onError={form.validation.error.status}
              />
              <div className="absolute top-[50%] cursor-default">
                <span>{form.values.status ? "Открыт" : ""}</span>
              </div>
              <span className="absolute top-[50%] right-[25%] cursor-default">
                {form.values.status ? "" : "Закрыт"}
              </span>
            </div>

            <div className="relative">
              <p className="text-[12px] text-[#636569]">
                Статус количества мест
              </p>
              <FormControlLabel
                className="w-[140px] mt-2"
                label=""
                control={
                  <RadioSwitch
                    checked={form.values.places_status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        values: {
                          ...form.values,
                          places_status: event.target.checked,
                        },
                      })
                    }
                  />
                }
                onError={form.validation.error.places_status}
              />
              <div className="absolute top-[50%] cursor-default">
                <span>{form.values.places_status ? "Открыт" : ""}</span>
              </div>
              <span className="absolute top-[50%] right-[40%] cursor-default">
                {form.values.places_status ? "" : "Закрыт"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-[40px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
          <TextField
            fullWidth
            // required
            label="Примечание"
            variant="standard"
            type={"text"}
            error={form.validation.error.note}
            helperText={form.validation.message.note}
            value={form.values.note}
            onChange={(e) => {
              setForm({
                ...form,
                values: {
                  ...form.values,
                  note: e.target.value,
                },
              });
            }}
          />
        </div>

        <div className="mt-[40px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
          <h1 className="text-[20px] font-bold mb-[50px]">
            Список погрузчиков
          </h1>

          {/* {!employeesListWithoutPagination.loading &&
            !employeesListWithoutPagination.error && (
              <FormControl className="w-full" variant="standard">
                <InputLabel id="demo-multiple-checkbox-label">
                  Выбрать
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={form.values.movers}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      values: {
                        ...form.values,
                        movers: e.target.value,
                      },
                    });
                  }}
                  renderValue={(selected) => {
                    const arr = [];
                    const data = employeesListWithoutPagination.result?.data;
                    for (let i = 0; i < selected.length; i++) {
                      for (let j = 0; j < data.length; j++) {
                        if (data[j].id === selected[i]) {
                          arr.push(data[j].full_name);
                        }
                      }
                    }
                    return arr.join(", ");
                  }}
                >
                  {employeesListWithoutPagination.result?.data.map(
                    (employee: any, index: number) => (
                      <MenuItem key={index} value={employee.id}>
                        <ListItemText primary={employee.full_name} />
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            )} */}

          {!employeesListWithoutPagination.loading &&
            !employeesListWithoutPagination.error && (
              <FormControl className="w-full" variant="standard">
                <InputLabel id="demo-multiple-checkbox-label">
                  Выбрать
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={form.values.movers}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      values: {
                        ...form.values,
                        movers: e.target.value,
                      },
                    });
                  }}
                  renderValue={(selected) => {
                    const arr = [];
                    const data = employeesListWithoutPagination.result?.data;
                    for (let i = 0; i < selected.length; i++) {
                      for (let j = 0; j < data.length; j++) {
                        if (data[j].id === selected[i]) {
                          arr.push(data[j].full_name);
                        }
                      }
                    }
                    return arr.join(", ");
                  }}
                >
                  {employeesListWithoutPagination.result?.data.map(
                    (employee: any, index: number) => (
                      <MenuItem key={index} value={employee.id}>
                        <Checkbox
                          checked={form.values.movers.includes(employee.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const value = employee.id;

                            setForm((prevForm: any) => {
                              const movers = prevForm.values.movers;
                              if (checked) {
                                return {
                                  ...prevForm,
                                  values: {
                                    ...prevForm.values,
                                    movers: [...movers, value],
                                  },
                                };
                              } else {
                                return {
                                  ...prevForm,
                                  values: {
                                    ...prevForm.values,
                                    movers: movers.filter(
                                      (mover: any) => mover !== value
                                    ),
                                  },
                                };
                              }
                            });
                          }}
                        />
                        <ListItemText primary={employee.full_name} />
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            )}
        </div>

        <p className="mt-[10px] text-red-500 text-[16px]">
          {form.validation.message?.non_field_errors}
        </p>

        <div className="flex justify-between items-center mt-[60px] pb-[80px]">
          <CustomButton
            onClick={() => navigate(-1)}
            type="button"
            className="py-[12px] px-[80px] bg-transparent border-[2px] border-[#1C61D5] text-[#1C61D5] hover:bg-transparent"
            text="Назад"
          />

          <CustomButton
            type="submit"
            className="py-[12px] px-[80px] text-white"
            text="Готово"
            loading={form.requested}
          />
        </div>
      </form>
    </section>
  );
};
