import React, {useState, useEffect} from "react";
import {useNavigate, createSearchParams} from "react-router-dom";
import {Search} from "../../components/Search";
import {CustomButton} from "../../components/CustomButton";
import {Box, Pagination, Modal, IconButton} from "@mui/material";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {DataGrid} from "@mui/x-data-grid";
import {EmployeesService} from "../../service/EmployeesService";
import {MdEdit, MdDeleteForever} from "react-icons/md";
import {checkModalResponse} from "../../helpers/helpers";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";
import {ToastContainer} from "react-toastify";


const initialValues = {
    open: false,
    values: {
        id: "",
        full_name: "",
        password: "",
        confirm_password: "",
        phone: "",
        address: "",
        salary: "",
        salary_currency: "",
        country: "",
        groups: "",
    },
    validation: {
        error: {
            full_name: false,
            password: false,
            confirm_password: false,
            phone: false,
            address: false,
            salary: false,
            salary_currency: false,
            country: false,
            groups: false,
        },
        message: {
            full_name: "",
            password: "",
            confirm_password: "",
            phone: "",
            address: "",
            salary: "",
            salary_currency: "",
            country: "",
            groups: "",
        },
    },
    requested: false,
    showPassword: false,
};
export const EmployeesPage: React.FC = () => {
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
                field: "full_name",
                headerName: "Полное имя",
                sortable: false,
                flex: 1,
            },
            {
                field: "groups",
                headerName: "Должность",
                flex: 1,
                renderCell: (params: any) => params.row.groups?.[0]?.name,
                sortable: false,
            },
            {
                field: "country",
                headerName: "Страна",
                flex: 1,
                renderCell: (params: any) => params.row.country?.name,
                sortable: false,
            },
            {field: "phone", headerName: "Телефон", flex: 1, sortable: false},
            {field: "address", headerName: "Адрес", flex: 1, sortable: false},

            {
                field: "salary",
                headerName: "Оклад",
                flex: 1,
                renderCell: (params: any) => params.row.salary,
                sortable: false,
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
                                    pathname: "/employee/details",
                                    search: createSearchParams({
                                        action: "edit",
                                        employee_id: params.row.id,
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
                                        // employee_id: params.row.group?.id,
                                        employee_id: params.row.id,
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

        EmployeesService.DeleteEmployee(modal.values)
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

    const tableList = EmployeesService.GetEmployeesList(table.filter);

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
            <h1 className="text-[32px] font-bold">Сотрудники</h1>
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
                    text="Добавить сотрудника"
                    onClick={() =>
                        navigate({
                            pathname: "/employee/details",
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
                        Удалить сотрудника?
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
