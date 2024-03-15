import React, { useEffect, useState } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/CustomButton";
import { checkModalResponse } from "../../helpers/helpers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Checkbox,
} from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { ClientsConsigneesService } from "../../service/ClientsConsigneesService";
import { ClientsShippersService } from "../../service/ClientsShippersService";
import { IoIosCloseCircleOutline } from "react-icons/io";

const consigneeInitialValues = {
  values: {
    id: "",
    client_id: "",
    country: "",
    phone: "",
    full_name: "",
    city: "",
    inn: "",
    okpo: "",
    shippers: [],
    markets: [
      {
        id: "",
        city: "",
        row: "",
        container: "",
        name: "",
      },
    ],
  },
  validation: {
    error: {
      client_id: false,
      country: false,
      phone: false,
      full_name: false,
      city: false,
      inn: false,
      okpo: false,
    },
    message: {
      client_id: "",
      country: "",
      phone: "",
      full_name: "",
      city: "",
      inn: "",
      okpo: "",
    },
  },
  requested: false,
};

const shipperInitialValues = {
  open: false,
  values: {
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
export const ClientsConsigneePageDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const action = params.get("action");
  const client_consignee_id = params.get("client_consignee_id");

  const [form, setForm] = useState<any>({
    ...consigneeInitialValues,
    action: action,
  });
  useEffect(() => {
    if (action === "edit" && client_consignee_id) {
      ClientsConsigneesService.GetConsigneeById(client_consignee_id)
        .then((response) => {
          const data = response.data;
          setForm({
            ...form,
            values: {
              ...form.values,
              ...response.data,
              country: data.country?.id,
              city: data.city?.id,
              markets: data.market_consignee,
              shippers: data.shippers.map((shipper: any) => shipper.id),
            },
          });
        })
        .catch((err) => {
          console.error("Error fetching employee details:", err);
        });
    }
  }, [action, client_consignee_id]);

  const cityList = ClientsConsigneesService.GetCityList({
    country: form.values.country,
  });

  const countryList = ClientsConsigneesService.GetCountryList();
  const shippersListWithoutPagination =
    ClientsShippersService.GetShippersListWithoutPagination();

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setForm({
      ...form,
      requested: true,
    });

    switch (form.action) {
      case "add":
        ClientsConsigneesService.CreateConsignee(form.values)
          .then((res) => {
            setForm(consigneeInitialValues);
            toast.success("Вы успешно добавили сотдрудника!", {
              position: "top-center",
            });
            navigate({
              pathname: "/clients/consignees/",
              // search: createSearchParams({
              //   action: "edit",
              //   client_consignee_id: res.data.id,
              // }).toString(),
            });
          })
          .catch((err) => {
            checkModalResponse(err.response.data, setForm, form);
          });
        break;

      case "edit":
        ClientsConsigneesService.UpdateConsignee(form.values)
          .then((res) => {
            setForm(consigneeInitialValues);
            toast.success("Вы успешно отредактировали сотдрудника!", {
              position: "top-center",
            });
            navigate({
              pathname: "/clients/consignee/details",
              search: createSearchParams({
                action: "edit",
                client_consignee_id: res.data.id,
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

  const [modal, setModal] = useState(shipperInitialValues);

  const handleModalSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setModal({
      ...modal,
      requested: true,
    });

    ClientsShippersService.CreateShipper(modal.values)
      .then(() => {
        setModal(shipperInitialValues);
        shippersListWithoutPagination.execute();
        toast.success("Вы успешно добавили грузоотправителя!", {
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
      <h1 className="text-[32px] font-bold">
        {action === "add" && "Добавить грузополучатель"}
        {action === "edit" && "Редактирование грузополучателя"}
      </h1>
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-3 mt-[60px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
          <TextField
            fullWidth
            required
            label="Код клиента"
            variant="standard"
            type={"string"}
            error={form.validation.error.client_id}
            helperText={form.validation.message.client_id}
            value={form.values.client_id}
            onChange={(e) => {
              setForm({
                ...form,
                values: {
                  ...form.values,
                  client_id: e.target.value,
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
                    city: "",
                    show: false,
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
          <TextField
            fullWidth
            required
            label="Телефон"
            variant="standard"
            type={"text"}
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
          <FormControl variant="standard">
            <InputLabel>Город</InputLabel>
            <Select
              // required
              value={form.values.city}
              error={form.validation.error.city}
              onChange={(event: any) => {
                setForm({
                  ...form,
                  values: {
                    ...form.values,
                    city: event.target.value,
                    show: false,
                  },
                });
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {!cityList.loading &&
                !cityList.error &&
                cityList.result?.data.map((item: any, index: number) => (
                  <MenuItem key={index} value={item.id}>
                    {`${item.name}`}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="ИНН"
            variant="standard"
            type={"number"}
            error={form.validation.error.inn}
            helperText={form.validation.message.inn}
            value={form.values.inn}
            onChange={(e) => {
              setForm({
                ...form,
                values: {
                  ...form.values,
                  inn: e.target.value,
                },
              });
            }}
          />
          <TextField
            fullWidth
            required={false}
            label="ОГРНИП | ОКПО, № патента"
            variant="standard"
            type={"text"}
            error={form.validation.error.okpo}
            helperText={form.validation.message.okpo}
            value={form.values.okpo}
            onChange={(e) => {
              setForm({
                ...form,
                values: {
                  ...form.values,
                  okpo: e.target.value,
                },
              });
            }}
          />
        </div>

        <div className="mt-[40px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
          <h1 className="text-[20px] font-bold mb-[50px]">Рынки клиента</h1>

          {form.values.markets.map((market: any, index: any) => (
            <div key={index} className="flex items-end gap-[26px] mb-[40px]">
              <div className="grid grid-cols-4 gap-[26px]">
                <FormControl className="w-full" variant="standard">
                  <InputLabel>Город</InputLabel>
                  <Select
                    // required
                    value={market.city}
                    onChange={(event: any) => {
                      const markets = form.values.markets;
                      markets[index].city = event.target.value;
                      setForm({
                        ...form,
                        values: {
                          ...form.values,
                          markets: markets,
                        },
                      });
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {!cityList.loading &&
                      !cityList.error &&
                      cityList.result?.data.map((city: any, index: number) => (
                        <MenuItem key={index} value={city.id}>
                          {city.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  required
                  label="Ряд"
                  variant="standard"
                  type={"text"}
                  value={market.row}
                  onChange={(event: any) => {
                    const markets = form.values.markets;
                    markets[index].row = event.target.value;
                    setForm({
                      ...form,
                      values: {
                        ...form.values,
                        markets: markets,
                      },
                    });
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Контейнер"
                  variant="standard"
                  type={"text"}
                  value={market.container}
                  onChange={(event: any) => {
                    const markets = form.values.markets;
                    markets[index].container = event.target.value;
                    setForm({
                      ...form,
                      values: {
                        ...form.values,
                        markets: markets,
                      },
                    });
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Рынок"
                  variant="standard"
                  type={"text"}
                  value={market.name}
                  onChange={(event: any) => {
                    const markets = form.values.markets;
                    markets[index].name = event.target.value;
                    setForm({
                      ...form,
                      values: {
                        ...form.values,
                        markets: markets,
                      },
                    });
                  }}
                />
              </div>

              <div>
                <CustomButton
                  type="button"
                  className="py-[8px] px-[30px] text-white bg-[#D70101] hover:bg-[#b41b1b]"
                  text="Удалить"
                  onClick={() => {
                    setForm({
                      ...form,
                      values: {
                        ...form.values,
                        markets: [
                          ...form.values.markets.slice(0, index),
                          ...form.values.markets.slice(index + 1),
                        ],
                      },
                    });
                  }}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-[70px]">
            <div
              onClick={() => {
                setForm({
                  ...form,
                  values: {
                    ...form.values,
                    markets: [
                      ...form.values.markets,
                      {
                        id: "",
                        city: "",
                        row: "",
                        container: "",
                        name: "",
                      },
                    ],
                  },
                });
              }}
              className="flex cursor-pointer items-center gap-[10px] py-[6px] px-[10px] rounded-full border-[2px] border-[#1C61D5] text-[#1C61D5]"
            >
              <FiPlus />
              <CustomButton
                type="button"
                className="text-[14px] text-[#1C61D5] bg-transparent hover:bg-transparent"
                text="Добавить еще"
              />
            </div>
          </div>
        </div>

        <div className="mt-[40px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
          <div className="flex justify-between items-center mb-[50px]">
            <h1 className="text-[20px] font-bold ">Грузоотправитель</h1>

            <div>
              <CustomButton
                type="button"
                className="py-[12px] px-[55px] text-white"
                text="Добавить отправителя"
                onClick={() =>
                  setModal({ ...modal, open: true, action: "add" })
                }
              />
            </div>
          </div>

          {!shippersListWithoutPagination.loading &&
            !shippersListWithoutPagination.error && (
              <FormControl className="w-full" variant="standard">
                <InputLabel id="demo-multiple-checkbox-label">
                  Выбрать
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  required
                  multiple
                  value={form.values.shippers}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      values: {
                        ...form.values,
                        shippers: e.target.value,
                      },
                    });
                  }}
                  renderValue={(selected) => {
                    const arr = [];
                    const data = shippersListWithoutPagination.result?.data;
                    if (data) {
                      for (let i = 0; i < selected.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                          if (data[j].id === selected[i]) {
                            arr.push(data[j].full_name);
                          }
                        }
                      }
                    }

                    return arr.join(", ");
                  }}
                >
                  {shippersListWithoutPagination.result?.data.map(
                    (shipper: any, index: number) => (
                      <MenuItem key={index} value={shipper.id}>
                        <Checkbox
                          checked={form.values.shippers.includes(shipper.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const value = shipper.id;

                            setForm((prevForm: any) => {
                              const shippers = prevForm.values.movers;
                              if (checked) {
                                return {
                                  ...prevForm,
                                  values: {
                                    ...prevForm.values,
                                    shippers: [...shippers, value],
                                  },
                                };
                              } else {
                                return {
                                  ...prevForm,
                                  values: {
                                    ...prevForm.values,
                                    shippers: shippers.filter(
                                      (mover: any) => mover !== value
                                    ),
                                  },
                                };
                              }
                            });
                          }}
                        />

                        <ListItemText primary={shipper.full_name} />
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            )}
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

      {/* Modal */}
      <Modal
        open={modal.open}
        onClose={() => setModal(shipperInitialValues)}
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
            onClick={() => setModal(shipperInitialValues)}
          >
            <IoIosCloseCircleOutline className="text-[28px] text-[#1C61D5]" />
          </IconButton>
          <h2 className="text-[30px] font-[600] text-[#1E1C2A] mb-[40px]">
            Добавить грузоотправителя
          </h2>
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
          <div className="flex justify-between gap-[40px] items-center mt-[20px]">
            <CustomButton
              onClick={() => setModal(shipperInitialValues)}
              type="button"
              className="py-[12px] px-[80px] bg-transparent border-[2px] border-[#1C61D5] text-[#1C61D5] hover:bg-transparent"
              text="Отменить"
            />

            <CustomButton
              type="submit"
              className="py-[12px] px-[80px] text-white"
              loading={modal.requested}
              onClick={handleModalSubmit}
              text={"Добавить"}
            />
          </div>
        </form>
      </Modal>
    </section>
  );
};
