import React, {useEffect, useState} from "react";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {TransactionsService} from "../../service/TransactionsService";
import {DataGrid} from "@mui/x-data-grid";
import {MdLocalPrintshop} from "react-icons/md";
import {CustomButton} from "../../components/CustomButton";
import {Box, Pagination} from "@mui/material";
import moment from "moment";

const tableInitialValues = {
    rows: [],
    status: {
        loading: false,
        error: false,
        message: "",
    },
    filter: {
        page: 1,
        size: 20,
        total_pages: 1,
    },
};

export const BoxOffice: React.FC = () => {
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: "id", headerName: "ID"},
            {
                field: "name",
                headerName: "Наименование",
                sortable: false,
                flex: 1,
            },
            {
                field: "sum_cashless_kgs",
                headerName: "Безналичные (сом)",
                sortable: false,
                flex: 1,
            },
            {
                field: "sum_cashless_rub",
                headerName: "Безналичные (руб)",
                sortable: false,
                flex: 1,
            },
            {
                field: "sum_kgs",
                headerName: "Наличные (сом)",
                sortable: false,
                flex: 1,
            },
            {
                field: "sum_rub",
                headerName: "Наличные (руб)",
                sortable: false,
                flex: 1,
            },
        ],
    });

    const tableList = TransactionsService.GetBoxOfficeListWithoutPagination(table.filter)

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
        <section className="advances pb-[60px]">
            <ToastContainer/>
            <h1 className="text-[32px] font-bold mb-[60px]">Касса</h1>

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
        </section>
    );
};
