import React, {useEffect, useState} from "react";
import {createSearchParams, useNavigate} from "react-router-dom";
import {Search} from "../../components/Search";
import {CustomButton} from "../../components/CustomButton";
import {Box, FormControl, IconButton, InputLabel, MenuItem, Modal, Pagination, Select, TextField} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {DataGrid} from "@mui/x-data-grid";
import {MdDeleteForever, MdEdit} from "react-icons/md";
import {WarehouseService} from "../../service/WarehouseService";
import {checkModalResponse} from "../../helpers/helpers";
import {ClientsConsigneesService} from "../../service/ClientsConsigneesService";

const initialValues = {
    open: false,
    values: {
        id: '',
        warehouse_code: '',
        client: ''
    },
    validation: {
        error: {
            warehouse_code: false,
            client: false
        },
        message: {
            warehouse_code: '',
            client: ''
        },
    },
    requested: false,
    action: '',
};

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

export const Warehouse: React.FC = () => {
    const navigate = useNavigate();

    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: "id", headerName: "ID"},
            {
                field: "warehouse_code",
                headerName: "Код",
                width: 130,
                sortable: false,
            },
            {
                field: "client",
                headerName: "ФИО",
                sortable: false,
                flex: 1,
                renderCell: (params: any) => params.row.client?.full_name
            },
            {
                field: "total_bags",
                headerName: "Количество",
                sortable: false,
                flex: 1,
            },
            {
                field: "total_amount",
                headerName: "Сумма",
                renderCell: (params: any) => params.row.country?.name,
                sortable: false,
                flex: 1,
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
                                setModal({
                                    ...modal,
                                    open: true,
                                    action: 'edit',
                                    values: {
                                        id: params.row.id,
                                        client: params.row.client?.id,
                                        warehouse_code: params.row.warehouse_code
                                    },
                                })
                            }}
                        >
                            <MdEdit/>
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                setModal({
                                    ...modal,
                                    open: true,
                                    action: 'delete',
                                    values: {
                                        id: params.row.id,
                                        client: params.row.client?.id,
                                        warehouse_code: params.row.warehouse_code
                                    },
                                })
                            }}
                        >
                            <MdDeleteForever/>
                        </IconButton>
                    </div>
                ),
            },
        ],
    });

    const [modal, setModal] = useState<any>(initialValues);
    const tableList = WarehouseService.GetWarehouseList(table.filter);
    const clientConsignees = ClientsConsigneesService.GetConsigneesListWithoutPagination()

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

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setModal({
            ...modal,
            requested: true,
        });

        switch (modal.action) {
            case 'add':
                WarehouseService.WarehouseCreate(modal.values).then((res) => {
                    setModal(initialValues);
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                });

                break;

            case 'edit':
                WarehouseService.WarehouseUpdate(modal.values).then((res) => {
                    setModal(initialValues);
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                });

                break;

            case 'delete':
                WarehouseService.WarehouseDelete(modal.values).then((res) => {
                    setModal(initialValues);
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                });

                break;

        }
    };

    return (
        <section>
            <ToastContainer/>
            <h1 className="text-[32px] font-bold">Склад</h1>

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
                    text="Добавить"
                    onClick={() => {
                        setModal({
                            ...modal,
                            open: true,
                            action: 'add',
                            values: {
                                id: '',
                                client: '',
                                warehouse_code: ''
                            },
                        })
                    }}
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
                        onRowDoubleClick={(params: any) => navigate(`/warehouse/${params.row.id}`)}
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
                        {modal.action === 'add' && 'Добавление записи'}
                        {modal.action === 'edit' && 'Редактирование записи'}
                        {modal.action === 'delete' && 'Удалить запись?'}
                    </h2>

                    {modal.action !== 'delete' &&
                        <div className='w-full grid grid-cols-2 gap-[40px] mb-[40px]'>
                            <TextField
                                fullWidth
                                required
                                label="Код"
                                variant="standard"
                                type={"number"}
                                error={modal.validation.error.warehouse_code}
                                helperText={modal.validation.message.warehouse_code}
                                value={modal.values.warehouse_code}
                                onChange={(e) => {
                                    setModal({
                                        ...modal,
                                        values: {
                                            ...modal.values,
                                            warehouse_code: e.target.value,
                                        },
                                    });
                                }}
                            />

                            <FormControl variant="standard">
                                <InputLabel>Клиент (грузополучатель)</InputLabel>
                                <Select
                                    label="Клиент (грузополучатель)"
                                    required
                                    value={modal.values.client}
                                    error={modal.validation.error.client}
                                    onChange={(event: any) => {
                                        setModal({
                                            ...modal,
                                            values: {
                                                ...modal.values,
                                                client: event.target.value,
                                            },
                                        });
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {!clientConsignees.loading &&
                                        !clientConsignees.error &&
                                        clientConsignees.result?.data.map((client: any, index: number) => (
                                            <MenuItem key={index} value={client.id}>
                                                {client.full_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </div>
                    }

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
                            text="Готово"
                        />
                    </div>
                </form>
            </Modal>
        </section>
    );
};
