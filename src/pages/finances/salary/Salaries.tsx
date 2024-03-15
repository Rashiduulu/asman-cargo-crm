import React, {useEffect, useState} from "react";
import {createSearchParams, useNavigate} from "react-router-dom";
import {Search} from "../../../components/Search";
import {CustomButton} from "../../../components/CustomButton";
import {Box, IconButton, Modal, Pagination} from "@mui/material";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {DataGrid} from "@mui/x-data-grid";
import {MdDeleteForever, MdEdit} from "react-icons/md";
import {checkModalResponse} from "../../../helpers/helpers";
import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from "react-toastify";
import moment from "moment/moment";
import {SalariesService} from "../../../service/SalariesService";

const initialValues = {
    open: false,
    values: {
        id: "",
    },
    validation: {
        error: {},
        message: {},
    },
    requested: false,
};

export const Salaries: React.FC = () => {
    const navigate = useNavigate();

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

    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: "id", headerName: "ID"},
            {
                field: "date_start",
                headerName: "Дата начала",
                sortable: false,
                renderCell: (params: any) => moment(params.row.date_start).format('DD.MM.YY').toString(),
                flex: 1
            },
            {
                field: "date_end",
                headerName: "Дата окончания",
                sortable: false,
                renderCell: (params: any) => moment(params.row.date_end).format('DD.MM.YY').toString(),
                flex: 1
            },
            {
                field: "actions",
                headerName: "",
                width: 110,
                sortable: false,
                renderCell: (params: any) => (
                    <div className="flex justify-start gap-3 text-[20px] text-[#1C61D5]">
                        <IconButton
                            onClick={() => {
                                navigate({
                                    pathname: "details",
                                    search: createSearchParams({
                                        action: "edit",
                                        salaries_id: params.row.id,
                                    }).toString(),
                                });
                            }}
                        >
                            <MdEdit/>
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                setModal({
                                    ...modal,
                                    open: true,
                                    values: {
                                        ...params.row,
                                    },
                                });
                            }}
                        >
                            <MdDeleteForever/>
                        </IconButton>
                    </div>
                ),
            },
        ],
    });

    const [modal, setModal] = useState(initialValues);

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setModal({
            ...modal,
            requested: true,
        });

        SalariesService.DeleteSalary(modal.values)
            .then(() => {
                setModal(initialValues);
                tableList.execute();
                toast.success("Удалено!", {
                    position: "top-center",
                });
            })
            .catch((err) => {
                checkModalResponse(err.response.data, setModal, modal);
            });
    };

    const tableList = SalariesService.GetSalaryList(table.filter)

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
            <ToastContainer/>
            <h1 className="text-[32px] font-bold">Зарплаты</h1>
            <div className="flex items-center justify-between mt-[63px]">
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

                <CustomButton
                    type="button"
                    className="py-[12px] px-[20px] text-white"
                    text="Добавить запись"
                    onClick={() =>
                        navigate({
                            pathname: "details",
                            search: createSearchParams({
                                action: "add",
                            }).toString(),
                        })
                    }
                />
            </div>
            <div className="mt-[39px]">
                <Box className="shadow-block" sx={{width: "100%", padding: '20px 11px'}}>
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
                        onRowDoubleClick={(params: any) => {
                            navigate({
                                pathname: "/reception-transmission/details",
                                search: createSearchParams({
                                    action: "edit",
                                    reception_transmission_id: params.row.id,
                                }).toString(),
                            });
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
                onClose={() => setModal(initialValues)}
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
                        onClick={() => setModal(initialValues)}
                    >
                        <IoIosCloseCircleOutline className="text-[28px] text-[#1C61D5]"/>
                    </IconButton>

                    <h2 className="text-[30px] font-[600] text-[#1E1C2A] mb-[40px]">
                        Удалить запись?
                    </h2>

                    <div className="flex justify-between gap-[40px] items-center mt-[20px]">
                        <CustomButton
                            onClick={() => setModal(initialValues)}
                            type="button"
                            className="py-[12px] px-[80px] bg-transparent border-[2px] border-[#1C61D5] text-[#1C61D5] hover:bg-transparent"
                            text="Отменить"
                        />

                        <CustomButton
                            type="submit"
                            className="py-[12px] px-[80px] text-white"
                            loading={modal.requested}
                            text="Удалить"
                        />
                    </div>
                </form>
            </Modal>
        </section>
    );
};
