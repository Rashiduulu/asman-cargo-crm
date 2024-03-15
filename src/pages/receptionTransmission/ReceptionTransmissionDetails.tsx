import React, {useEffect, useState} from "react";
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import {CustomButton} from "../../components/CustomButton";
import {EmployeesService} from "../../service/EmployeesService";
import {checkModalResponse} from "../../helpers/helpers";
import {FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, Select, TextField,} from "@mui/material";
import {ReceptionTransmissionService} from "../../service/ReceptionTransmissionService";
import {FiPlus} from "react-icons/fi";
import {DatePicker} from "@mui/x-date-pickers";
import "rsuite/DatePicker/styles/index.css";
import moment from "moment";
import {ClientsConsigneesService} from "../../service/ClientsConsigneesService";
import {RoutesService} from "../../service/RoutesService";
import {ClientsShippersService} from "../../service/ClientsShippersService";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import dayjs from "dayjs";

const employeesInitialValues = {
    open: false,
    values: {
        id: "",
        route: "",
        transport_type: "",
        exchange_rate: 0,
        date: dayjs(moment(new Date()).format('DD.MM.YY').toString()),
        shipper: "",
        consignee: "",
        place_of_registration: "",
        inspectors: [],
        packers: [],
        note: "",
        product_reception_transmission: [
            {
                id: "",
                category: "",
                bag_number: "",
                quantity: "",
                weight: "",
            },
        ],
        services: [],
    },
    validation: {
        error: {
            route: false,
            date: false,
            shipper: false,
            consignee: false,
            place_of_registration: false,
            inspectors: false,
            note: false,
            packers: false,
            product_reception_transmission: false,
            services: false,
        },
        message: {
            route: "",
            date: "",
            shipper: "",
            consignee: "",
            place_of_registration: "",
            inspectors: "",
            note: "",
            packers: "",
            product_reception_transmission: "",
            services: "",
        },
    },
    requested: false,
};

export const ReceptionTransmissionDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const action = params.get("action");
    const reception_transmission_id = params.get("reception_transmission_id");

    const [form, setForm] = useState<any>({
        ...employeesInitialValues,
        action: action,
    });

    const placeOfRegistrationList = ReceptionTransmissionService.GetPlaceOfRegistrationList();

    const shippersListWithoutPagination = ClientsShippersService.GetShippersListWithoutPagination();

    const consigneesListWithoutPagination = ClientsConsigneesService.GetConsigneesListWithoutPagination();

    const employeesInspectorsList = EmployeesService.GetEmployeesListWithoutPagination({
        groups__name: 'Досмотрщик'
    });

    const employeesPackersList = EmployeesService.GetEmployeesListWithoutPagination({
        groups__name: 'Упаковщик'
    });

    const routesList = RoutesService.GetRoutesListByParams({control_status: true,});

    const serviceColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
        },
        {
            field: 'service_type',
            headerName: 'Сервис',
            flex: 1,
            editable: false,
            sortable: false,
            renderCell: (params: any) => params.row.service_type?.name
        },
        {
            field: 'quantity',
            headerName: 'Количество',
            flex: 1,
            sortable: false,
            renderCell: (params: any) => {
                if (params.row.service_type?.name !== 'За вес (кг)' && params.row.service_type?.name !== 'Погрузка') {
                    return (
                        <TextField
                            fullWidth
                            value={params.row.quantity}
                            variant="standard"
                            type={"number"}
                            onChange={(e) => {
                                const services = form.values.services
                                const service = services.find((item: any) => item.service_type?.id === params.row.service_type?.id)

                                if (service) {
                                    const index = services.indexOf(service)
                                    services[index].quantity = e.target.value
                                    handleChangeServiceList(services)
                                }
                            }}
                        />
                    )
                } else {
                    return params.row.quantity
                }
            }
        },
        {
            field: 'price_rub',
            headerName: 'Цена (руб)',
            flex: 1,
            sortable: false,
            renderCell: (params: any) => {
                return (
                    <TextField
                        fullWidth
                        value={params.row.price_rub}
                        variant="standard"
                        type={"number"}
                        onChange={(e) => {
                            const services = form.values.services
                            const service = services.find((item: any) => item.service_type?.id === params.row.service_type?.id)

                            if (service) {
                                const index = services.indexOf(service)
                                services[index].price_rub = e.target.value
                                handleChangeServiceList(services)
                            }
                        }}
                    />
                )
            }
        },
        {field: 'price_kgs', headerName: 'Цена (сом)', flex: 1, sortable: false,},
        {field: 'sum_rub', headerName: 'Сумма (руб)', flex: 1, sortable: false,},
        {field: 'sum_kgs', headerName: 'Сумма (сом)', flex: 1, sortable: false,},
        {
            field: 'paid',
            headerName: 'Статус',
            flex: 1,
            sortable: false,
            renderCell: (params: any) => {
                return (
                    <FormControl variant="standard">
                        <Select
                            value={params.row.paid === true ? '1' : '0'}
                            onChange={(e: any) => {
                                const services = form.values.services
                                const service = services.find((item: any) => item.service_type?.id === params.row.service_type?.id)

                                if (service) {
                                    const index = services.indexOf(service)
                                    services[index].paid = e.target.value === '1'
                                    handleChangeServiceList(services)
                                }
                            }}
                        >
                            <MenuItem value={'1'}>
                                Оплачен
                            </MenuItem>
                            <MenuItem value={'0'}>
                                Не оплачен
                            </MenuItem>
                        </Select>
                    </FormControl>
                )
            }
        },
    ];

    const serviceList = ReceptionTransmissionService.GetInitialServiceList({transport_type: form.values.transport_type});

    const productCategoryList = ReceptionTransmissionService.GetProductCategoryList()

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setForm({
            ...form,
            requested: true,
        });

        switch (form.action) {
            case "add":
                ReceptionTransmissionService.CreateReceptionTransmission(form.values)
                    .then((res) => {
                        setForm(employeesInitialValues);
                        navigate({
                            pathname: "/reception-transmission",
                            // search: createSearchParams({
                            //     action: "edit",
                            //     reception_transmission_id: res.data.id,
                            // }).toString(),
                        });
                    })
                    .catch((err) => {
                        checkModalResponse(err.response.data, setForm, form);
                    });
                break;

            case "edit":
                ReceptionTransmissionService.UpdateReceptionTransmission(form.values)
                    .then(() => {
                        setForm(employeesInitialValues);
                        // toast.success("Вы успешно отредактировали сотдрудника!", {
                        //   position: "top-center",
                        // });
                        navigate({
                            pathname: "/reception-transmission",
                            search: createSearchParams({
                                action: "edit",
                                reception_id: form.values.id,
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

    const handleChangeProductList = (productList: any) => {
        const services = [...form.values.services].map((service: any) => {
            if (service.service_type?.name === 'За вес (кг)') {
                const newQuantity = [...productList].reduce((acc: any, num: any) => {
                    return acc + (Number(num.weight) || 0);
                }, 0)
                return {
                    ...service,
                    quantity: newQuantity,
                    sum_rub: service.price_rub * newQuantity,
                    sum_kgs: service.price_kgs * newQuantity,

                }
            } else if (service.service_type?.name === 'Погрузка') {
                const result = [...productList].reduce((acc: any, item: any) => {
                    if (item.bag_number !== '' && !acc.includes(item.bag_number)) {
                        return [...acc, item.bag_number];
                    }
                    return acc;
                }, []);

                return {
                    ...service,
                    quantity: result.length,
                    sum_rub: service.price_rub * result.length,
                    sum_kgs: service.price_kgs * result.length,
                };
            } else {
                return service
            }
        })
        setForm({
            ...form,
            values: {
                ...form.values,
                product_reception_transmission: [...productList],
                services: services,
            },
        });
    }

    const handleGetUpdatedServices = (serviceList: any, changedField?: string, value?: any) => {
        if (changedField === 'exchange_rate') {
            return [...serviceList].map((service: any) => ({
                ...service,
                price_kgs: service.price_rub * value,
                sum_rub: service.price_rub * service.quantity,
                sum_kgs: (service.price_rub * value) * service.quantity,
            }))
        } else {
            return [...serviceList].map((service: any) => ({
                ...service,
                price_kgs: service.price_rub * form.values.exchange_rate,
                sum_rub: service.price_rub * service.quantity,
                sum_kgs: service.price_rub * form.values.exchange_rate * service.quantity,
            }))
        }
    }

    const handleChangeServiceList = (newArray: any) => {

        setForm({
            ...form,
            values: {
                ...form.values,
                services: handleGetUpdatedServices(newArray, '', 0),
            },
        });
    }

    useEffect(() => {
        if (action === "edit" && reception_transmission_id) {
            ReceptionTransmissionService.GetReceptionTransmissionById(reception_transmission_id)
                .then((response) => {
                    const values = response.data;
                    setForm({
                        ...form,
                        values: {
                            ...form.values,
                            ...values,
                            date: dayjs(values.date),
                            consignee: values.consignee?.id,
                            inspectors: [...values.inspectors].map((item: any) => item.id),
                            note: values.note,
                            packers: [...values.packers].map((item: any) => item.id),
                            place_of_registration: values.place_of_registration?.id,
                            product_reception_transmission: [...values.product_reception_transmission].map((item: any, index: number) => ({
                                ...item,
                                category: item.category?.id,
                            })),
                            services: [...values.reception_transmission_services].map((item: any, index: number) => ({
                                ...item,
                                id: index,
                                service_type: item.service,
                                service: item.service?.id,
                            })),
                            route: values.route?.id,
                            transport_type: values.route?.transport_type?.id,
                            exchange_rate: values.route?.exchange_rate,
                            shipper: values.shipper?.id,
                        },
                    });
                })
                .catch((err) => {
                    console.error("Error fetching employee details:", err);
                });
        }
    }, [action, reception_transmission_id]);

    useEffect(() => {
        if (!serviceList.loading && !serviceList.error) {
            const services = serviceList.result?.data
            if (form.values.transport_type === '') {
                handleChangeServiceList(services.map((service: any) => ({
                    ...service,
                    service: service.service_type?.id,
                    price_rub: service.price,
                    quantity: 0,
                    price_kgs: 0,
                    sum_rub: 0,
                    sum_kgs: 0,
                })))
            } else {
                let formServiceList = form.values.services

                for (let i = 0; i < formServiceList.length; i++) {
                    const itemFound = services.find((item: any) => item.service_type?.id === formServiceList[i].service_type?.id)
                    if (itemFound) {
                        formServiceList[i].price_rub = itemFound.price
                    }
                }

                handleChangeServiceList(formServiceList)
            }
        }
    }, [serviceList.loading, serviceList.error]);

    return (
        <section>
            <h1 className="text-[32px] font-bold">
                {action === "add" && "Добавить прием / передачу"}
                {action === "edit" && "Редактирование добавление приема / передачу"}
            </h1>

            <form onSubmit={handleFormSubmit}>

                <div
                    className="grid grid-cols-3 mt-[60px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
                    <FormControl variant="standard">
                        <InputLabel>Номер рейса / Тип транспорта</InputLabel>
                        <Select
                            label="Номер рейса / Тип транспорта"
                            required
                            value={form.values.route}
                            error={form.validation.error.route}
                            onChange={(event: any, child: any) => {
                                setForm({
                                    ...form,
                                    values: {
                                        ...form.values,
                                        route: event.target.value,
                                        transport_type: child.props['data-transport'],
                                        exchange_rate: child.props['data-exchange'],
                                        services: handleGetUpdatedServices([...form.values.services], 'exchange_rate', child.props['data-exchange'])
                                    }
                                })
                            }}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {(!routesList.loading && !routesList.error) &&
                                routesList.result?.data.map((route: any, index: number) =>
                                    <MenuItem key={index} value={route.id} data-transport={route.transport_type?.id}
                                              data-exchange={route.exchange_rate}>
                                        {route.route_id} / {route.transport_type?.name}
                                    </MenuItem>
                                )
                            }
                        </Select>
                        <FormHelperText>{form.validation.message.route}</FormHelperText>
                    </FormControl>

                    <DatePicker
                        label="Дата"
                        value={form.values.date}
                        onChange={(newValue: any) => {
                            setForm({
                                ...form,
                                values: {
                                    ...form.values,
                                    date: newValue
                                }
                            })
                        }}
                        slotProps={{
                            textField: {
                                variant: "standard",
                                required: true,
                                error: form.validation.error.date,
                                helperText: form.validation.message.date,
                            }
                        }}
                    />

                    <FormControl variant="standard">
                        <InputLabel>Место оформления</InputLabel>
                        <Select
                            label="Место оформления"
                            required
                            value={form.values.place_of_registration}
                            error={form.validation.error.place_of_registration}
                            onChange={(event: any) => {
                                setForm({
                                    ...form,
                                    values: {
                                        ...form.values,
                                        place_of_registration: event.target.value,
                                    },
                                });
                            }}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {(!placeOfRegistrationList.loading && !placeOfRegistrationList.error) &&
                                placeOfRegistrationList.result?.data.map((place: any, index: number) =>
                                    <MenuItem key={index} value={place.id}>{place.name}</MenuItem>
                                )
                            }
                        </Select>
                        <FormHelperText>{form.validation.message.place_of_registration}</FormHelperText>
                    </FormControl>

                    <FormControl variant="standard">
                        <InputLabel>Грузополучатель</InputLabel>
                        <Select
                            required
                            value={form.values.consignee}
                            error={form.validation.error.consignee}
                            onChange={(event: any) => {
                                setForm({
                                    ...form,
                                    values: {
                                        ...form.values,
                                        consignee: event.target.value,
                                    },
                                });
                            }}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {(!consigneesListWithoutPagination.loading && !consigneesListWithoutPagination.error) &&
                                consigneesListWithoutPagination.result?.data.map((consignee: any, index: number) =>
                                    <MenuItem key={index} value={consignee.id}>{consignee.full_name}</MenuItem>
                                )
                            }
                        </Select>
                        <FormHelperText>{form.validation.message.consignee}</FormHelperText>
                    </FormControl>

                    <FormControl variant="standard">
                        <InputLabel>Грузоотправитель</InputLabel>
                        <Select
                            required
                            value={form.values.shipper}
                            error={form.validation.error.shipper}
                            onChange={(event: any) => {
                                setForm({
                                    ...form,
                                    values: {
                                        ...form.values,
                                        shipper: event.target.value,
                                    },
                                });
                            }}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {(!shippersListWithoutPagination.loading && !shippersListWithoutPagination.error) &&
                                shippersListWithoutPagination.result?.data.map((shipper: any, index: number) =>
                                    <MenuItem key={index} value={shipper.id}>{shipper.full_name}</MenuItem>
                                )
                            }
                        </Select>
                        <FormHelperText>{form.validation.message.shipper}</FormHelperText>
                    </FormControl>
                </div>

                <div className="mt-[40px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
                    <h1 className="text-[20px] font-bold mb-[50px]">Примечание</h1>

                    <TextField
                        fullWidth
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
                        Досмотр / Упаковка
                    </h1>

                    <div className="grid grid-cols-2 gap-[50px]">
                        {(!employeesInspectorsList.loading && !employeesInspectorsList.error) &&
                            <FormControl className="w-full" variant="standard">
                                <InputLabel id="demo-multiple-checkbox-label">
                                    Досмотрщик
                                </InputLabel>
                                <Select
                                    multiple
                                    value={form.values.inspectors}
                                    onChange={(e) => {
                                        setForm({
                                            ...form,
                                            values: {
                                                ...form.values,
                                                inspectors: e.target.value,
                                            },
                                        });
                                    }}
                                    renderValue={(selected) => {
                                        const arr = [];
                                        const data = employeesInspectorsList.result?.data;
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
                                    {employeesInspectorsList.result?.data.map((employee: any, index: number) =>
                                        <MenuItem key={index} value={employee.id}>
                                            <ListItemText primary={employee.full_name}/>
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        }

                        {!employeesPackersList.loading && !employeesPackersList.error && (
                            <FormControl className="w-full" variant="standard">
                                <InputLabel id="demo-multiple-checkbox-label">
                                    Упаковщик
                                </InputLabel>
                                <Select
                                    multiple
                                    value={form.values.packers}
                                    onChange={(e) => {
                                        setForm({
                                            ...form,
                                            values: {
                                                ...form.values,
                                                packers: e.target.value,
                                            },
                                        });
                                    }}
                                    renderValue={(selected) => {
                                        const arr = [];
                                        const data = employeesPackersList.result?.data;
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
                                    {employeesPackersList.result?.data.map((employee: any, index: number) =>
                                        <MenuItem key={index} value={employee.id}>
                                            <ListItemText primary={employee.full_name}/>
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        )}
                    </div>
                </div>

                <div className="mt-[40px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
                    <div className="flex items-center justify-between mb-[50px]">
                        <h1 className="text-[20px] font-bold ">Список товаров</h1>

                        <div className="flex gap-4">
                            <CustomButton
                                type="button"
                                className="py-[9px] px-[30px] text-white"
                                text="Дублировать товар"
                                onClick={() => {
                                    let goods = form.values.product_reception_transmission
                                    let lastElem = [...goods].pop()
                                    goods.push({
                                        id: "",
                                        category: lastElem.category,
                                        bag_number: "",
                                        quantity: "",
                                        weight: "",
                                    })
                                    handleChangeProductList(goods)
                                }}
                            />

                            <CustomButton
                                type="button"
                                className="py-[9px] px-[30px] text-white"
                                text="Дублировать сумку"
                                onClick={() => {
                                    let goods = form.values.product_reception_transmission
                                    let lastElem = [...goods].pop()
                                    goods.push({
                                        id: "",
                                        category: '',
                                        bag_number: lastElem.bag_number,
                                        quantity: "",
                                        weight: "",
                                    })
                                    handleChangeProductList(goods)
                                }}
                            />
                        </div>
                    </div>

                    {form.values.product_reception_transmission.map(
                        (market: any, index: any) => (
                            <div key={index} className="flex items-end gap-[26px] mb-[40px]">
                                <div className="w-full flex gap-[26px]">
                                    <FormControl className='flex flex-1' variant="standard">
                                        <InputLabel>Наименование товара</InputLabel>
                                        <Select
                                            required
                                            label='Наименование товара'
                                            value={market.category}
                                            onChange={(event: any) => {
                                                const goods = form.values.product_reception_transmission;
                                                goods[index].category = event.target.value;

                                                handleChangeProductList(goods)
                                            }}
                                        >
                                            {(!productCategoryList.loading && !productCategoryList.error) &&
                                                productCategoryList.result?.data.map((category: any, index: number) =>
                                                    <MenuItem key={index} value={category.id}>
                                                        {category.name}
                                                    </MenuItem>
                                                )}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        fullWidth
                                        required
                                        className='flex-1'
                                        label="№ сумки"
                                        variant="standard"
                                        type={"number"}
                                        value={market.bag_number}
                                        onChange={(event: any) => {
                                            const goods = form.values.product_reception_transmission;
                                            goods[index].bag_number = event.target.value;
                                            handleChangeProductList(goods)
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        required
                                        className='flex-1'
                                        label="Количество"
                                        variant="standard"
                                        type={"number"}
                                        value={market.quantity}
                                        onChange={(event: any) => {
                                            const goods = form.values.product_reception_transmission;
                                            goods[index].quantity = event.target.value;
                                            handleChangeProductList(goods)
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        required
                                        className='flex-1'
                                        label="Вес"
                                        variant="standard"
                                        type={"number"}
                                        value={market.weight}
                                        onChange={(event: any) => {
                                            const goods = form.values.product_reception_transmission;
                                            goods[index].weight = event.target.value;
                                            handleChangeProductList(goods)
                                        }}
                                    />
                                </div>

                                <div>
                                    <CustomButton
                                        type="button"
                                        className="py-[8px] px-[30px] text-white bg-[#D70101] hover:bg-[#b41b1b]"
                                        text="Удалить"
                                        onClick={() => {
                                            handleChangeProductList([
                                                ...form.values.product_reception_transmission.slice(
                                                    0,
                                                    index
                                                ),
                                                ...form.values.product_reception_transmission.slice(
                                                    index + 1
                                                ),
                                            ],)
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    )}

                    <div className="flex justify-center mt-[70px]">
                        <div
                            onClick={() => {
                                setForm({
                                    ...form,
                                    values: {
                                        ...form.values,
                                        product_reception_transmission: [
                                            ...form.values.product_reception_transmission,
                                            {
                                                id: "",
                                                category: "",
                                                bag_number: "",
                                                quantity: "",
                                                weight: "",
                                            },
                                        ],
                                    },
                                });
                            }}
                            className="flex cursor-pointer items-center gap-[10px] py-[6px] px-[10px] rounded-full border-[2px] border-[#1C61D5] text-[#1C61D5]"
                        >
                            <FiPlus/>
                            <CustomButton
                                type="button"
                                className="text-[14px] text-[#1C61D5] bg-transparent hover:bg-transparent"
                                text="Добавить еще"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-[40px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
                    <div className="flex items-center justify-between mb-[50px]">
                        <h1 className="text-[20px] font-bold ">Услуги</h1>

                        {/*<Button*/}
                        {/*    type="submit"*/}
                        {/*    className="py-[9px] px-[30px] text-white"*/}
                        {/*    text="Выставить счет"*/}
                        {/*/>*/}
                    </div>

                    <div className="flex gap-[40px] mb-[70px]">
                        <div className='flex gap-[20px] pb-[2px] border-b-[1px] border-b-gray-800'>
                            <p>Курс по отношению к сому:</p>
                            <p className='font-[600]'>{form.values.exchange_rate}</p>
                        </div>
                    </div>

                    <div className='mt-[78px]'>
                        <DataGrid
                            rows={form.values.services}
                            columns={serviceColumns}
                            loading={serviceList.loading}
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
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-[40px] mt-[50px]">
                        <div></div>
                        <p>Итого к оплате(руб): {form.values.services.reduce((acc: any, item: any)=> acc + item.sum_rub, 0)}</p>
                        <p>Остаток(руб): {form.values.services.filter((item: any)=> item.paid === false).reduce((acc: any, item: any)=> acc + item.sum_rub, 0)}</p>
                    </div>
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
