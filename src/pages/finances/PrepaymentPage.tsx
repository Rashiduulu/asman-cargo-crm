import React, {FormEvent, useState} from "react";
import {CustomButton} from "../../components/CustomButton";
import {Box, FormControl, InputLabel, ListItemText, MenuItem, Select,} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {TransactionsService} from "../../service/TransactionsService";
import {EmployeesService} from "../../service/EmployeesService";
import {DataGrid} from "@mui/x-data-grid";
import {MdLocalPrintshop} from "react-icons/md";
import {AdvancesService} from "../../service/AdvancesService";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment/moment";

const tableInitialValues = {
    rows: [],
    filter: {
        date_from: null,
        date_to: null,
        currency: "",
        staffs: [],
        show_result: false,
        requested: false,
    },
    file: ''
};

export const PrepaymentPage: React.FC = () => {

    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: "id", headerName: "ID"},
            {
                field: "full_name",
                headerName: "ФИО",
                sortable: false,
                flex: 1,
                renderCell: (params: any)=> params.row.transaction?.staff?.full_name
            },
            {
                field: "date",
                headerName: "Дата",
                sortable: false,
                flex: 1,
                renderCell: (params: any)=> moment(params.row.transaction?.created_at).format('DD.MM.YY').toString()
            },
            {
                field: "sum",
                headerName: "Сумма",
                sortable: false,
                flex: 1,
            },
        ],
    });

    const currencyList = TransactionsService.GetCurrencyList();
    const staffList = EmployeesService.GetEmployeesListWithoutPagination();

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
        filter.date_from = moment(table.filter.date_from.$d).format('YYYY-MM-DD')
        filter.date_to = moment(table.filter.date_to.$d).format('YYYY-MM-DD')
        filter.staffs = [...table.filter.staffs].join(',')

        AdvancesService.GetPrepaymentList(filter).then((res: any) => {
            const data = res.data;
            setTable((prevState: any) => ({
                ...prevState,
                rows: [...data.data],
                filter: {
                    ...prevState.filter,
                    show: true,
                    requested: false,
                },
                file: data.file
            }));
        })
    }
    return (
        <section className="advances pb-[60px]">
            <ToastContainer/>
            <h1 className="text-[32px] font-bold">Авансы</h1>

            <form className="w-full mt-[60px]" onSubmit={handleGetResults}>
                <div className="px-[37px] py-[40px] bg-white rounded-[7px]">
                    <div className="w-full  grid grid-cols-3 gap-[50px]">
                        <FormControl required className="w-full" variant="standard">
                            <InputLabel id="demo-multiple-checkbox-label">
                                Сотрудник
                            </InputLabel>
                            <Select
                                multiple
                                value={table.filter.staffs}
                                onChange={(e) => {
                                    setTable((prevTable: any) => ({
                                        ...prevTable,
                                        filter: {
                                            ...prevTable.filter,
                                            staffs: e.target.value,
                                            show: false
                                        },
                                    }));
                                }}
                                renderValue={(selected) => {
                                    const arr = [];
                                    const data = staffList.result?.data;
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
                                {staffList.result?.data.map((staff: any, index: number) => {
                                    return (
                                        <MenuItem key={index} value={staff.id}>
                                            <ListItemText primary={staff.full_name}/>
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <div className='flex items-center gap-[20px]'>
                            <DatePicker
                                label="Дата от"
                                value={table.filter.date_from}
                                onChange={(newValue: any) => {
                                    setTable({
                                        ...table,
                                        filter: {
                                            ...table.filter,
                                            date_from: newValue,
                                            show: false
                                        }
                                    })
                                }}
                                slotProps={{
                                    textField: {
                                        variant: "standard",
                                        required: true,
                                    }
                                }}
                            />

                            <DatePicker
                                label="Дата до"
                                value={table.filter.date_to}
                                onChange={(newValue: any) => {
                                    setTable({
                                        ...table,
                                        filter: {
                                            ...table.filter,
                                            date_to: newValue,
                                            show: false
                                        }
                                    })
                                }}
                                slotProps={{
                                    textField: {
                                        variant: "standard",
                                        required: true,
                                    }
                                }}
                            />
                        </div>



                        <FormControl required variant="standard">
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
                        sx={{width: "100%", padding: "20px 11px"}}
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
                        <div className="flex w-full justify-end mt-[40px]">
                            <div className="cursor-pointer flex items-center gap-2 py-[8px] px-[20px] bg-[#1C61D5] rounded-[10px]"
                                 onClick={()=>{
                                     window.open(table.file, '_blank')
                                 }}
                            >
                                <MdLocalPrintshop className="text-[20px] text-white"/>
                                <CustomButton
                                    type="button"
                                    className=" text-white hover:bg-transparent"
                                    text="Печать"
                                />
                            </div>
                        </div>
                    </Box>
                </div>
            )}
        </section>
    );
};
