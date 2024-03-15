import React, {FormEvent, useState} from "react";
import {CustomButton} from "../../components/CustomButton";
import {Box, FormControl, InputLabel, MenuItem, Select,} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {DataGrid, GridFooterContainer} from "@mui/x-data-grid";
import {MdLocalPrintshop} from "react-icons/md";
import moment from "moment/moment";
import {ClientsConsigneesService} from "../../service/ClientsConsigneesService";
import {RoutesService} from "../../service/RoutesService";
import {DebitsService} from "../../service/DebitsService";

const tableInitialValues = {
    rows: [],
    rows1: [],
    filter: {
        route: '',
        transport_type: '',
        client: "",
        show_result: false,
        requested: false,
    },
    total_remaining_amount: 0,
    file: '',
    client: {
        id: '',
        client_id: '',
        full_name: '',
    },
    date_from: null,
    date_to: null,

};

export const ClientDebitsPage: React.FC = () => {
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: "id", headerName: "№", width: 80},
            {
                field: "date",
                headerName: "Дата",
                sortable: false,
                flex: 1,
                renderCell: (params: any) => moment(params.row.date).format('YYYY-MM-DD').toString()
            },
            {
                field: "weight",
                headerName: "Вес (кг)",
                sortable: false,
                flex: 1,
                renderCell: (params: any) => params.row.product_total_info?.weight
            },
            {
                field: "quantity",
                headerName: "Количество",
                sortable: false,
                flex: 1,
                renderCell: (params: any) => params.row.product_total_info?.quantity
            },
            {
                field: "remaining_amount",
                headerName: "Долг за рейс",
                sortable: false,
                flex: 1,
            },
        ],
        columns1: [
            {field: "id", headerName: "ID"},
            {
                field: "transaction",
                headerName: "Номер приходника",
                sortable: false,
                flex: 1,
                renderCell: (params: any) => params.row.transaction?.id
            },
            {
                field: "route",
                headerName: "Рейс",
                sortable: false,
                flex: 1,
                renderCell: (params: any) => `${params.row.reception_transmission?.route.route_id}/`
            },
            {
                field: "sum",
                headerName: "Погашение",
                sortable: false,
                flex: 1,
            },
            {
                field: "date",
                headerName: "Дата",
                sortable: false,
                width: 90,
                renderCell: (params: any) => moment(params.row.transaction?.created_at).format('YYYY-MM-DD').toString()
            },
        ],
    });

    const clientsList = ClientsConsigneesService.GetConsigneesListWithoutPagination();
    const transport_types = RoutesService.GetTransportTypeList();
    const routesList = RoutesService.GetRoutesListByParams({transport_type: table.filter.transport_type});

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

        DebitsService.GetClientDebits(filter).then((res: any) => {
            const reception_transmission = res.data.reception_transmission.data;
            const transactions = res.data.transactions.data;
            setTable((prevState: any) => ({
                ...prevState,
                rows: [...reception_transmission],
                rows1: [...transactions],
                filter: {
                    ...prevState.filter,
                    show: true,
                    requested: false,
                },
                total_remaining_amount: res.data.reception_transmission.total_remaining_amount,
                file: res.data.file,
                client: {
                    ...res.data.client
                },
                date_from: moment(res.data.date_from).format('DD.MM.YY').toString(),
                date_to: moment(res.data.date_to).format('DD.MM.YY').toString(),
            }));
        })
    }
    return (
        <section className="advances pb-[60px]">
            <ToastContainer/>
            <h1 className="text-[32px] font-bold">Отчет дебиторки по клиентам</h1>

            <form className="w-full mt-[60px]" onSubmit={handleGetResults}>
                <div className="px-[37px] py-[40px] bg-white rounded-[7px]">
                    <div className="w-full  grid grid-cols-3 gap-[50px]">
                        <FormControl required fullWidth variant="standard">
                            <InputLabel>
                                Клиент
                            </InputLabel>
                            <Select
                                value={table.filter.client}
                                onChange={(e) => {
                                    setTable((prevTable: any) => ({
                                        ...prevTable,
                                        filter: {
                                            ...prevTable.filter,
                                            client: e.target.value,
                                            show: false
                                        },
                                    }));
                                }}
                            >
                                {!clientsList.loading && !clientsList.error &&
                                    clientsList.result?.data.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.full_name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <FormControl required fullWidth variant="standard">
                            <InputLabel>
                                Направление
                            </InputLabel>
                            <Select
                                value={table.filter.transport_type}
                                onChange={(e) => {
                                    setTable((prevTable: any) => ({
                                        ...prevTable,
                                        filter: {
                                            ...prevTable.filter,
                                            transport_type: e.target.value,
                                            route: '',
                                            show: false
                                        },
                                    }));
                                }}
                            >
                                {!transport_types.loading && !transport_types.error &&
                                    transport_types.result?.data.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <FormControl fullWidth variant="standard">
                            <InputLabel>
                                Рейс
                            </InputLabel>
                            <Select
                                value={table.filter.route}
                                onChange={(e) => {
                                    setTable((prevTable: any) => ({
                                        ...prevTable,
                                        filter: {
                                            ...prevTable.filter,
                                            route: e.target.value,
                                            show: false
                                        },
                                    }));
                                }}
                            >
                                {!routesList.loading && !routesList.error &&
                                    routesList.result?.data.map((item: any, index: number) => (
                                        <MenuItem key={index} value={item.id}>
                                            {`${item.route_id}/${item.transport_type?.name}`}
                                        </MenuItem>
                                    ))
                                }
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
                        <div className='w-full flex justify-center items-start mb-[50px]'>
                            <p className='text-[17px] font-[700] text-[#252525]'>
                                {table.client?.full_name} с {table.date_from} по {table.date_to}
                            </p>
                        </div>
                        <div className='w-full flex'>
                            <DataGrid
                                rows={table.rows}
                                columns={table.columns}
                                checkboxSelection={false}
                                keepNonExistentRowsSelected
                                disableColumnFilter
                                disableColumnMenu
                                autoHeight={!(table.rows.length > 0)}
                                disableRowSelectionOnClick
                                sx={{
                                    "& .MuiDataGrid-columnHeaders": {
                                        backgroundColor: "#fff",
                                        color: "#252525",
                                    },
                                }}
                                slots={{
                                    footer: ()=>{
                                        return (
                                            <GridFooterContainer>
                                                <div className='w-full flex justify-end px-[20px]'>
                                                    <p className='text-[14px] text-[#252525] font-[700]'>
                                                        Остаток долга: {table.total_remaining_amount}
                                                    </p>
                                                </div>
                                            </GridFooterContainer>
                                        )
                                    }
                                }}
                            />
                            <DataGrid
                                rows={table.rows1}
                                columns={table.columns1}
                                checkboxSelection={false}
                                keepNonExistentRowsSelected
                                disableColumnFilter
                                disableColumnMenu
                                hideFooter
                                autoHeight={!(table.rows1.length > 0)}
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
                        </div>
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