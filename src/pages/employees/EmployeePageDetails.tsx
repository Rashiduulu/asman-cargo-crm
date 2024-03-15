import React, { useState, useEffect } from "react";
import {useNavigate, useLocation, createSearchParams} from "react-router-dom";
import { CustomButton } from "../../components/CustomButton";
import { EmployeesService } from "../../service/EmployeesService";
import { checkModalResponse } from "../../helpers/helpers";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { FiEye, FiEyeOff } from "react-icons/fi";

const employeesInitialValues = {
  open: false,
  values: {
    id: "",
    full_name: "",
    password: "",
    groups: "",
    group_id: "",
    confirm_password: "",
    phone: "",
    address: "",
    salary: "",
    salary_currency: "",
    country: "",
    note: "",
  },
  validation: {
    error: {
      full_name: false,
      password: false,
      groups: false,
      group_id: false,
      confirm_password: false,
      phone: false,
      address: false,
      salary: false,
      salary_currency: false,
      country: false,
      note: false,
    },
    message: {
      full_name: "",
      password: "",
      confirm_password: "",
      groups: "",
      group_id: "",
      phone: "",
      address: "",
      salary: "",
      salary_currency: "",
      country: "",
      note: "",
    },
  },
  requested: false,
  showPassword: false,
};
export const EmployeePageDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const action = params.get("action");
  const employee_id = params.get("employee_id");

  const groupList = EmployeesService.GetGroupList();
  const currencyList = EmployeesService.GetCurrencyList();
  const countryList = EmployeesService.GetCountryList();

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

    switch (form.action) {
      case "add":
        EmployeesService.CreateEmployee(form.values)
          .then((res) => {
            setForm(employeesInitialValues);
            toast.success("Вы успешно добавили сотдрудника!", {
              position: "top-center",
            });
            navigate({
              pathname: "/employee",
              // search: createSearchParams({
              //   action: "edit",
              //   employee_id: form.values,
              // }).toString(),
            });
          })
          .catch((err) => {
            checkModalResponse(err.response.data, setForm, form);
          });
        break;

      case "edit":
        EmployeesService.UpdateEmployee(form.values)
          .then(() => {
            setForm(employeesInitialValues);
            toast.success("Вы успешно отредактировали сотдрудника!", {
              position: "top-center",
            });
            navigate({
              pathname: "/employee",
              search: createSearchParams({
                action: "edit",
                employee_id: form.values.id,
              }).toString(),
            });
          })
          .catch((err) => {
            checkModalResponse(err.response.data, setForm, form);
          });
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (action === "edit" && employee_id) {
      EmployeesService.GetEmployeeById(employee_id)
        .then((response) => {
          console.log("Employee data:", response.data);
          const employeeData = response.data;
          setForm({
            ...form,
            values: {
              ...form.values,
              ...response.data,
              salary_currency: employeeData.salary_currency?.id,
              country: employeeData.country?.id,
              groups: employeeData.groups?.[0]?.id,
            },
          });
        })
        .catch((err) => {
          console.error("Error fetching employee details:", err);
        });
    }
  }, [action, employee_id]);

  return (
    <section>
      <ToastContainer />
      <h1 className="text-[32px] font-bold">
        {action === "add" && "Добавление сотрудника"}
        {action === "edit" && "Редактирование сотрудника"}
      </h1>

      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-3 mt-[60px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
          <TextField
            fullWidth
            required
            label="Полное имя"
            variant="standard"
            type={"text"}
            error={form.validation.error.full_name}
            helperText={form.validation.message.full_name}
            value={form.values.full_name}
            onChange={(e) => {
              setForm({
                ...form,
                values: {
                  ...form.values,
                  full_name: e.target.value,
                },
              });
            }}
          />

          <TextField
            fullWidth
            required={action === 'add'}
            label="Пароль"
            variant="standard"
            type={form.showPassword ? "text" : "password"}
            value={form.values.password}
            error={form.validation.error.password}
            helperText={form.validation.message.password}
            onChange={(e) =>
              setForm({
                ...form,
                values: { ...form.values, password: e.target.value },
              })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setForm({ ...form, showPassword: !form.showPassword })
                    }
                  >
                    {form.showPassword ? (
                      <FiEyeOff className="text-[18px]" />
                    ) : (
                      <FiEye className="text-[18px]" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            required={action === 'add'}
            label="Подтвердите пароль"
            variant="standard"
            type={form.showPassword ? "text" : "password"}
            value={form.values.confirm_password}
            error={form.validation.error.confirm_password}
            helperText={form.validation.message.confirm_password}
            onChange={(e) =>
              setForm({
                ...form,
                values: { ...form.values, confirm_password: e.target.value },
              })
            }
            InputProps={{
              endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                        onClick={() =>
                            setForm({ ...form, showPassword: !form.showPassword })
                        }
                    >
                      {form.showPassword ? (
                          <FiEyeOff className="text-[18px]" />
                      ) : (
                          <FiEye className="text-[18px]" />
                      )}
                    </IconButton>
                  </InputAdornment>
              ),
            }}
          />

          <FormControl variant="standard">
            <InputLabel>Должность</InputLabel>
            <Select
              label="Должность"
              required
              value={form.values.groups}
              error={form.validation.error.groups}
              onChange={(event: any) => {
                const isEditAction = form.action === "edit";

                setForm({
                  ...form,
                  values: {
                    ...form.values,
                    groups: event.target.value,
                    group_id: isEditAction ? event.target.value : undefined,
                  },
                });
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {!groupList.loading &&
                !groupList.error &&
                groupList.result?.data.map((group: any, index: number) => (
                  <MenuItem key={index} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            label="Телефон"
            variant="standard"
            type={"number"}
            error={form.validation.error.phone}
            helperText={form.validation.message.phone}
            value={form.values.phone}
            onChange={(e) => {
              setForm({
                ...form,
                values: {
                  ...form.values,
                  phone: e.target.value,
                },
              });
            }}
          />

          <TextField
            fullWidth
            required
            label="Адрес"
            variant="standard"
            type={"text"}
            error={form.validation.error.address}
            helperText={form.validation.message.address}
            value={form.values.address}
            onChange={(e) => {
              setForm({
                ...form,
                values: {
                  ...form.values,
                  address: e.target.value,
                },
              });
            }}
          />

          <TextField
            fullWidth
            required
            label="Оклад"
            variant="standard"
            type={"number"}
            error={form.validation.error.salary}
            helperText={form.validation.message.salary}
            value={form.values.salary}
            onChange={(e) => {
              setForm({
                ...form,
                values: {
                  ...form.values,
                  salary: e.target.value,
                },
              });
            }}
          />

          <FormControl variant="standard">
            <InputLabel>Валюта</InputLabel>
            <Select
              label="Валюта"
              // required
              value={form.values.salary_currency}
              error={form.validation.error.salary_currency}
              onChange={(event: any) => {
                setForm({
                  ...form,
                  values: {
                    ...form.values,
                    salary_currency: event.target.value,
                  },
                });
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {!currencyList.loading &&
                !currencyList.error &&
                currencyList.result?.data.map(
                  (currency: any, index: number) => (
                    <MenuItem key={index} value={currency.id}>
                      {currency.name}
                    </MenuItem>
                  )
                )}
            </Select>
          </FormControl>

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
                countryList.result?.data.map((country: any, index: number) => (
                  <MenuItem key={index} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        <div className="mt-[40px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
          <h1 className="text-[20px] font-bold mb-[50px]">
            Дополнительная информация
          </h1>

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
