import React, {FormEvent, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {CustomButton} from "../../../components/CustomButton";
import {Box, FormControl, InputLabel, MenuItem, Select, TextField,} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import "rsuite/DatePicker/styles/index.css";
import moment from "moment";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {TransactionsService} from "../../../service/TransactionsService";
import {ToastContainer} from "react-toastify";
import {SalariesService} from "../../../service/SalariesService";
import dayjs from "dayjs";

const tableInitialValues = {
    filter: {
        currency: "",
        date_start: null,
        date_end: null,
        price_inspector: "",
        price_packer: "",
        price_loader: "",
        salary_report: [],
        show_result: false,
        requested: false,
        requestedSubmit: false,
    },
};


export const SalariesDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const action = params.get("action");
    const salaries_id = params.get("salaries_id");

    const [table, setTable] = useState<any>(tableInitialValues);

    const reportsColumns: GridColDef[] = [
        {field: "id", headerName: "ID"},
        {
            field: "full_name",
            headerName: "ФИО",
            sortable: false,
            flex: 1,
        },
        {
            field: "debt",
            headerName: "Долг (-) ,(+)",
            sortable: false,
            flex: 1,
            renderCell: (params: any) => (
                <TextField
                    fullWidth
                    value={params.row.debt}
                    variant="standard"
                    type={"number"}
                    onChange={(e) => {
                        const reports = table.filter.salary_report
                        const report = reports.find((item: any) => item.id === params.row.id)
                        if (report) {
                            const index = reports.indexOf(report)
                            reports[index].debt = e.target.value
                            handleChangeServiceList(reports)
                        }
                    }}
                />
            )
        },
        {
            field: "salary",
            headerName: "Оклад",
            sortable: false,
            flex: 1,
            renderCell: (params: any) => (
                <TextField
                    fullWidth
                    value={params.row.salary}
                    variant="standard"
                    type={"number"}
                    onChange={(e) => {
                        const reports = table.filter.salary_report
                        const report = reports.find((item: any) => item.id === params.row.id)

                        if (report) {
                            const index = reports.indexOf(report)
                            reports[index].salary = e.target.value
                            handleChangeServiceList(reports)
                        }
                    }}
                />
            )
        },
        {
            field: "bonus",
            headerName: "Премии",
            sortable: false,
            flex: 1,
            renderCell: (params: any) => (
                <TextField
                    fullWidth
                    value={params.row.bonus}
                    variant="standard"
                    type={"number"}
                    onChange={(e) => {
                        const reports = table.filter.salary_report
                        const report = reports.find((item: any) => item.id === params.row.id)

                        if (report) {
                            const index = reports.indexOf(report)
                            reports[index].bonus = e.target.value
                            handleChangeServiceList(reports)
                        }
                    }}
                />
            )
        },
        {
            field: "other",
            headerName: "Прочее",
            sortable: false,
            flex: 1,
            renderCell: (params: any) => (
                <TextField
                    fullWidth
                    value={params.row.other}
                    variant="standard"
                    type={"number"}
                    onChange={(e) => {
                        const reports = table.filter.salary_report
                        const report = reports.find((item: any) => item.id === params.row.id)

                        if (report) {
                            const index = reports.indexOf(report)
                            reports[index].other = e.target.value
                            handleChangeServiceList(reports)
                        }
                    }}
                />
            )
        },
        {
            field: "percent",
            headerName: "Проценты",
            sortable: false,
            flex: 1,
            renderCell: (params: any) => (
                <TextField
                    fullWidth
                    value={params.row.percent}
                    variant="standard"
                    type={"number"}
                    onChange={(e) => {
                        const reports = table.filter.salary_report
                        const report = reports.find((item: any) => item.id === params.row.id)

                        if (report) {
                            const index = reports.indexOf(report)
                            reports[index].percent = e.target.value
                            handleChangeServiceList(reports)
                        }
                    }}
                />
            )
        },
        {
            field: "inspector_packer_loader_data",
            headerName: "Досм./упак./порг.",
            sortable: false,
            flex: 1,
            renderCell: (params: any)=>params.row.inspector_packer_loader_data?.total
        },
        {
            field: "total_salary",
            headerName: "Итого ЗП",
            sortable: false,
            flex: 1,
        },
        {
            field: "prepayment",
            headerName: "Авансы",
            sortable: false,
            flex: 1,
        },
        {
            field: "fine",
            headerName: "Штрафы",
            sortable: false,
            flex: 1,
        },
        {
            field: "remains",
            headerName: "Остаток",
            sortable: false,
            flex: 1,
        },
        {
            field: "payout",
            headerName: "Выдача",
            sortable: false,
            flex: 1,
            renderCell: (params: any) => (
                <TextField
                    fullWidth
                    value={params.row.payout}
                    variant="standard"
                    type={"number"}
                    onChange={(e) => {
                        const reports = table.filter.salary_report
                        const report = reports.find((item: any) => item.id === params.row.id)

                        if (report) {
                            const index = reports.indexOf(report)
                            reports[index].payout = e.target.value
                            handleChangeServiceList(reports)
                        }
                    }}
                />
            )
        },
        {
            field: "total",
            headerName: "Итого",
            sortable: false,
            flex: 1,
        },
    ]

    const currencyList = TransactionsService.GetCurrencyList();

    const handleGetResults = (e: FormEvent) => {
        e.preventDefault()
        setTable((prevState: any) => ({
            ...prevState,
            filter: {
                ...prevState.filter,
                requested: true,
                show: false,
            },
        }));

        const filter = table.filter
        filter.date_start = moment(table.filter.date_start.$d).format('YYYY-MM-DD')
        filter.date_end = moment(table.filter.date_end.$d).format('YYYY-MM-DD')

        SalariesService.GetSalaryReportList(filter).then((res: any) => {
            const data = res.data;
            setTable((prevState: any) => ({
                ...prevState,
                filter: {
                    ...prevState.filter,
                    salary_report: [...data.data].map((item: any)=>({
                        ...item,
                        staff: item.id
                    })),
                    show: true,
                    requested: false,
                },
            }));
        })
    }

    const handleChangeServiceList = (newArray: any) => {
        setTable({
            ...table,
            filter: {
                ...table.filter,
                salary_report: handleGetUpdatedServices(newArray),
            },
        });
    }

    const handleGetUpdatedServices = (reportList: any) => {
        return [...reportList].map((report: any) => {
            const total_salary = parseInt(report.debt) + parseInt(report.salary) + parseInt(report.bonus) + parseInt(report.percent) + parseInt(report.other)
            const remains = total_salary - parseInt(report.prepayment) - parseInt(report.fine)
            return ({
                ...report,
                total_salary: total_salary,
                remains: remains,
                total: remains - parseInt(report.payout),
            })
        })
    }

    const handleSaveTableChange = () =>{
        setTable((prevState: any) => ({
            ...prevState,
            filter: {
                ...prevState.filter,
                requestedSubmit: true,
            },
        }));

        const filter = table.filter
        filter.date_start = moment(table.filter.date_start.$d).format('YYYY-MM-DD')
        filter.date_end = moment(table.filter.date_end.$d).format('YYYY-MM-DD')

        SalariesService.CreateSalary(filter).then(() => {
            navigate(-1)
        }).catch((err: any)=>{
            setTable((prevState: any) => ({
                ...prevState,
                filter: {
                    ...prevState.filter,
                    requestedSubmit: false,
                },
            }));
        })
    }

    useEffect(()=>{
        if(action === "edit" && salaries_id){
            SalariesService.GetSalaryById(salaries_id).then((res: any)=>{
                setTable({
                    ...table,
                    filter:{
                        ...table.filter,
                        ...res.data,
                        date_start: dayjs(res.data.date_start),
                        date_end: dayjs(res.data.date_end),
                        currency: res.data.currency?.id,
                        salary_report: [...res.data.salary_report].map((item: any)=>({
                            ...item,
                            full_name: item.staff?.full_name,
                        })),
                        show: true
                    }
                })
            })
        }

    },[salaries_id])
    return (
        <section className="advances pb-[60px]">
            <ToastContainer/>
            <h1 className="text-[32px] font-bold">
                {action === 'add' && 'Добавить зарплату'}
                {action === 'edit' && 'Редактировать'}
            </h1>

            <form className="w-full mt-[60px]" onSubmit={handleGetResults}>
                <div className="px-[37px] py-[40px] bg-white rounded-[7px]">
                    <div className="w-full  grid grid-cols-3 gap-[50px]">
                        <FormControl disabled={action === 'edit'} required variant="standard">
                            <InputLabel>Валюта</InputLabel>
                            <Select
                                label="Валюта"
                                required
                                value={table.filter.currency}
                                onChange={(event: any) => {
                                    setTable((prevForm: any) => ({
                                        ...prevForm,
                                        filter: {
                                            ...prevForm.filter,
                                            currency: event.target.value,
                                            show: false
                                        },
                                    }));
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
                        </FormControl>

                        <div className='flex items-center gap-[20px]'>
                            <DatePicker
                                label="Дата от"
                                value={table.filter.date_start}
                                onChange={(newValue: any) => {
                                    setTable({
                                        ...table,
                                        filter: {
                                            ...table.filter,
                                            date_start: newValue,
                                            show: false
                                        }
                                    })
                                }}
                                slotProps={{
                                    textField: {
                                        variant: "standard",
                                        required: true,
                                        disabled: action === 'edit'
                                    }
                                }}
                            />

                            <DatePicker
                                label="Дата до"
                                value={table.filter.date_end}
                                onChange={(newValue: any) => {
                                    setTable({
                                        ...table,
                                        filter: {
                                            ...table.filter,
                                            date_end: newValue,
                                            show: false
                                        }
                                    })
                                }}
                                slotProps={{
                                    textField: {
                                        variant: "standard",
                                        required: true,
                                        disabled: action === 'edit'
                                    }
                                }}
                            />
                        </div>

                        <TextField
                            fullWidth
                            disabled={action === 'edit'}
                            label="Цена - досмотрщик"
                            variant="standard"
                            type={"number"}
                            value={table.filter.price_inspector}
                            onChange={(event: any) => {
                                setTable((prevForm: any) => ({
                                    ...prevForm,
                                    filter: {
                                        ...prevForm.filter,
                                        price_inspector: event.target.value,
                                        show: false
                                    },
                                }));
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Цена - упаковщик"
                            variant="standard"
                            disabled={action === 'edit'}
                            type={"number"}
                            value={table.filter.price_packer}
                            onChange={(event: any) => {
                                setTable((prevForm: any) => ({
                                    ...prevForm,
                                    filter: {
                                        ...prevForm.filter,
                                        price_packer: event.target.value,
                                        show: false
                                    },
                                }));
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Цена - погрузчик"
                            disabled={action === 'edit'}
                            variant="standard"
                            type={"number"}
                            value={table.filter.price_loader}
                            onChange={(event: any) => {
                                setTable((prevForm: any) => ({
                                    ...prevForm,
                                    filter: {
                                        ...prevForm.filter,
                                        price_loader: event.target.value,
                                        show: false
                                    },
                                }));
                            }}
                        />
                    </div>

                    <div className="flex w-full justify-end mt-[70px]">
                        <CustomButton
                            type="submit"
                            className="py-[8px] px-[20px] text-white"
                            text="Показать"
                            disabled={table.filter.requested || action === 'edit'}
                            loading={table.filter.requested}
                        />
                    </div>
                </div>
            </form>

            {table.filter.show && (
                <div className="mt-[39px]">
                    <Box
                        className="shadow-block"
                        sx={{width: "100%", padding: "20px 11px"}}
                    >
                        <DataGrid
                            rows={table.filter.salary_report}
                            columns={reportsColumns}
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
                    <div className="flex w-full justify-between mt-[40px]">
                        <CustomButton
                            onClick={() => navigate(-1)}
                            type="button"
                            className="py-[12px] px-[80px] bg-transparent border-[2px] border-[#1C61D5] text-[#1C61D5] hover:bg-transparent"
                            text="Отменить"
                        />
                        <CustomButton
                            type="button"
                            className="py-[12px] px-[80px] text-white"
                            text="Готово"
                            disabled={table.filter.requestedSubmit}
                            loading={table.filter.requestedSubmit}
                            onClick={(e)=>{
                                e.preventDefault()
                                handleSaveTableChange()
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};
