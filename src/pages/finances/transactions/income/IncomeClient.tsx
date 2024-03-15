import React, {useEffect, useState} from "react";
import {CustomButton} from "../../../../components/CustomButton";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {useLocation, useNavigate} from "react-router-dom";
import {TransactionsService} from "../../../../service/TransactionsService";
import {FiPlus} from "react-icons/fi";
import {ClientsConsigneesService} from "../../../../service/ClientsConsigneesService";
import {ReceptionTransmissionService} from "../../../../service/ReceptionTransmissionService";


export const IncomeClient: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const action = params.get("action");
    const id = params.get("id");
    const assign_types = params.get("assign_types");


    const initialValues = {
        open: false,
        values: {
            id: "",
            assign_types: assign_types,
            box_office: "",
            currency: "",
            payment_type: "",
            total_sum: "",
            description: "",
            income: [
                {
                    id: "",
                    sum: "",
                    client: "",
                    reception_transmission: "",
                    item: "",
                },
            ],
        },
        validation: {
            error: {
                assign_types: false,
                box_office: false,
                currency: false,
                payment_type: false,
                total_sum: false,
                description: false,
            },
            message: {
                assign_types: "",
                box_office: "",
                currency: "",
                payment_type: "",
                total_sum: "",
                description: "",
            },
        },
        requested: false,
        action: action,
    };

    const [form, setForm] = useState<any>(initialValues);

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setForm({
            ...form,
            requested: true,
        });

        switch (action) {
            case 'add':
                TransactionsService.CreateTransaction(form.values, 'income').then(()=>{
                    navigate(-1)
                })
                break;

            case 'edit':
                TransactionsService.UpdateTransaction(form.values, 'income').then(()=>{
                    navigate(-1)
                })

                break;
        }
    };


    const boxOfficeList = TransactionsService.GetBoxOfficeList()
    const currencyList = TransactionsService.GetCurrencyList()
    const paymentTypeList = TransactionsService.GetPaymentTypeList()
    const transactionItems = TransactionsService.GetTransactionItemsList({assign_types: assign_types})
    const clientsList = ClientsConsigneesService.GetConsigneesListWithoutPagination()
    const routesList = ReceptionTransmissionService.GetReceptionTransmissionAllList()

    useEffect(()=>{
        if(action === 'edit' && id !== undefined){
            TransactionsService.GetTransactionById({id: id}, 'income').then((res: any)=>{
                setForm({
                    ...form,
                    values: {
                        ...form.values,
                        ...res.data,
                        id: id,
                        assign_types: res.data.assign_types?.id,
                        box_office: res.data.box_office?.id,
                        currency: res.data.currency?.id,
                        payment_type: res.data.payment_type?.id,
                    }
                })
            })
        }
    },[])
    return (
        <section>
            <ToastContainer/>
            <h1 className="text-[32px] font-bold">
                {action === 'add' && 'Добавление прихода (клиент)'}
                {action === 'edit' && 'Редактирование прихода (клиент)'}
            </h1>

            <form
                onSubmit={handleFormSubmit}
                className="w-full mt-[60px] pb-[60px]"
            >
                <div className='w-full px-[37px] py-[40px] bg-white rounded-[7px] grid grid-cols-3 gap-[50px]'>
                    <FormControl required variant="standard">
                        <InputLabel>Касса</InputLabel>
                        <Select
                            label="Касса"
                            required
                            value={form.values.box_office}
                            error={form.validation.error.box_office}
                            onChange={(event: any) => {
                                setForm({
                                    ...form,
                                    values: {
                                        ...form.values,
                                        box_office: event.target.value,
                                    },
                                });
                            }}
                        >
                            {!boxOfficeList.loading &&
                                !boxOfficeList.error &&
                                boxOfficeList.result?.data.map((item: any, index: number) => (
                                    <MenuItem key={index} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                        </Select>
                        <FormHelperText>{form.validation.message.box_office}</FormHelperText>
                    </FormControl>

                    <FormControl required variant="standard">
                        <InputLabel>Валюта</InputLabel>
                        <Select
                            label="Валюта"
                            required
                            value={form.values.currency}
                            error={form.validation.error.currency}
                            onChange={(event: any) => {
                                setForm({
                                    ...form,
                                    values: {
                                        ...form.values,
                                        currency: event.target.value,
                                    },
                                });
                            }}
                        >
                            {!currencyList.loading &&
                                !currencyList.error &&
                                currencyList.result?.data.map((item: any, index: number) => (
                                    <MenuItem key={index} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                        </Select>
                        <FormHelperText>{form.validation.message.currency}</FormHelperText>
                    </FormControl>

                    <FormControl required variant="standard">
                        <InputLabel>Тип оплаты</InputLabel>
                        <Select
                            label="Тип оплаты"
                            required
                            value={form.values.payment_type}
                            error={form.validation.error.payment_type}
                            onChange={(event: any) => {
                                setForm({
                                    ...form,
                                    values: {
                                        ...form.values,
                                        payment_type: event.target.value,
                                    },
                                });
                            }}
                        >
                            {!paymentTypeList.loading &&
                                !paymentTypeList.error &&
                                paymentTypeList.result?.data.map((item: any, index: number) => (
                                    <MenuItem key={index} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                        </Select>
                        <FormHelperText>{form.validation.message.payment_type}</FormHelperText>
                    </FormControl>

                    <TextField
                        fullWidth
                        className='col-start-1 col-end-4'
                        label="Описание"
                        variant="standard"
                        type={"text"}
                        value={form.values.description}
                        error={form.validation.error.description}
                        helperText={form.validation.message.description}
                        onChange={(e) => {
                            setForm({
                                ...form,
                                values: {
                                    ...form.values,
                                    description: e.target.value,
                                },
                            });
                        }}
                    />
                </div>

                <div className="w-full mt-[40px] bg-white shadow-block rounded-[7px] py-[40px] px-[37px] gap-[50px]">
                    <h1 className="text-[20px] font-bold mb-[50px]">Расход</h1>

                    {form.values.income.map((income: any, income_index: any) => (
                        <div key={income_index} className="w-full flex items-end gap-[26px] mb-[40px]">
                            <div className="w-full flex gap-[26px]">
                                <TextField
                                    className='flex flex-1'
                                    fullWidth
                                    required
                                    label="Сумма"
                                    variant="standard"
                                    type={"number"}
                                    value={income.sum}
                                    onChange={(event: any) => {
                                        const income = form.values.income;
                                        income[income_index].sum = event.target.value;
                                        setForm({
                                            ...form,
                                            values: {
                                                ...form.values,
                                                income: income,
                                            },
                                        });
                                    }}
                                />

                                <FormControl required className="w-full flex-1" variant="standard">
                                    <InputLabel>Статья</InputLabel>
                                    <Select
                                        value={income.item}
                                        onChange={(event: any) => {
                                            const income = form.values.income;
                                            income[income_index].item = event.target.value;
                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    income: income,
                                                },
                                            });
                                        }}
                                    >
                                        {!transactionItems.loading &&
                                            !transactionItems.error &&
                                            transactionItems.result?.data.map((item: any, index: number) => (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>

                                <FormControl required className="w-full flex-1" variant="standard">
                                    <InputLabel>Клиент</InputLabel>
                                    <Select
                                        value={income.client}
                                        onChange={(event: any) => {
                                            const income = form.values.income;
                                            income[income_index].client = event.target.value;
                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    income: income,
                                                },
                                            });
                                        }}
                                    >
                                        {!clientsList.loading &&
                                            !clientsList.error &&
                                            clientsList.result?.data.map((item: any, index: number) => (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.full_name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>

                                <FormControl required className="w-full flex-1" variant="standard">
                                    <InputLabel>Рейс (прием/передача)</InputLabel>
                                    <Select
                                        value={income.reception_transmission}
                                        onChange={(event: any) => {
                                            const income = form.values.income;
                                            income[income_index].reception_transmission = event.target.value;
                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    income: income,
                                                },
                                            });
                                        }}
                                    >
                                        {!routesList.loading &&
                                            !routesList.error &&
                                            routesList.result?.data.filter((route: any) => route.consignee?.id === form.values.income[income_index].client).map((route: any, index: any)=>(
                                                <MenuItem key={index} value={route.id}>
                                                    {route.route?.route_id} / {route.route?.transport_type?.name} ({route.id})
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>

                            </div>

                            <div>
                                <CustomButton
                                    type="button"
                                    className="py-[8px] px-[30px] text-white bg-[#D70101] hover:bg-[#b41b1b]"
                                    text="Удалить"
                                    onClick={() => {
                                        if(form.values.income.length > 1){
                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    income: [
                                                        ...form.values.income.slice(0, income_index),
                                                        ...form.values.income.slice(income_index + 1),
                                                    ],
                                                },
                                            });
                                        }
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
                                        income: [
                                            ...form.values.income,
                                            {
                                                id: "",
                                                sum: "",
                                                client: "",
                                                reception_transmission: "",
                                                item: "",
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


                <div className="flex justify-between gap-[40px] items-center mt-[20px]">
                    <CustomButton
                        onClick={() => navigate(-1)}
                        type="button"
                        className="py-[12px] px-[80px] bg-transparent border-[2px] border-[#1C61D5] text-[#1C61D5] hover:bg-transparent"
                        text="Отменить"
                    />

                    <CustomButton
                        type="submit"
                        className="py-[12px] px-[80px] text-white"
                        loading={form.requested}
                        text="Готово"
                    />
                </div>
            </form>

        </section>
    );
};
