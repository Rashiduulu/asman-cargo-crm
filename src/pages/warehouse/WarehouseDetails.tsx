import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {CustomButton} from "../../components/CustomButton";
import {
    Box,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Pagination,
    Select,
    TextField
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {DataGrid, GridRowParams} from "@mui/x-data-grid";
import {MdDeleteForever, MdEdit} from "react-icons/md";
import {WarehouseService} from "../../service/WarehouseService";
import {checkModalResponse} from "../../helpers/helpers";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import moment from "moment/moment";


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
    selected_rows: []
};

export const WarehouseDetails: React.FC = () => {
    const navigate = useNavigate();
    const {id} = useParams()
    const initialValues = {
        open: false,
        values: {
            id: '',
            warehouse: id,
            bag_number: '',
            ended_at: null,
            amount: '',
            payment_status: '',
        },
        validation: {
            error: {
                warehouse: false,
                bag_number: false,
                ended_at: false,
                amount: false,
                payment_status: false,
            },
            message: {
                warehouse: '',
                bag_number: '',
                ended_at: '',
                amount: '',
                payment_status: '',
            },
        },
        requested: false,
        action: '',
    };
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: "id", headerName: "ID"},
            {
                field: "bag_number",
                headerName: "Номер мешка",
                flex: 1,
                sortable: false,
            },
            {
                field: "created_at",
                headerName: "Дата начала",
                sortable: false,
                flex: 1,
            },
            {
                field: "ended_at",
                headerName: "Дата окончания",
                sortable: false,
                flex: 1,
            },
            {
                field: "amount",
                headerName: "Стоимость",
                sortable: false,
                flex: 1,
            },
            {
                field: "status",
                headerName: "Статус",
                valueGetter: (params: any) => {
                    const status = params.value;
                    return status ? "Закрыт" : "Открыт";
                },
                renderCell: (params: any) => {
                    const status = params.value;
                    let cellColor = "";
                    if (status === "Открыт") {
                        cellColor = "bg-[#01D70A19] text-[#01D70A] border-[#01D70A]";
                    } else if (status === "Закрыт") {
                        cellColor = "bg-[#D701011A] text-[#D70101] border-[#D70101]";
                    }
                    return (
                        <div
                            className={`rounded-full px-3 py-1 border-[2px] font-medium ${cellColor}`}
                        >
                            {status}
                        </div>
                    );
                },
                sortable: false,
            },
            {
                field: "payment_status",
                headerName: "Статус оплаты",
                sortable: false,
                flex: 1,
                renderCell: (params: any) => (
                    <FormControl variant="standard">
                        <Select
                            defaultValue={params.row.payment_status === true ? 1 : 0}
                            onChange={(event: any) => {
                                WarehouseService.WarehouseBagPartialUpdate({
                                    id: params.row.id,
                                    payment_status: event.target.value
                                }).then((res) => {
                                    setModal(initialValues);
                                    warehouseInfo.execute()
                                    tableList.execute();
                                })
                            }}
                        >
                            <MenuItem value={1}>
                                Оплачен
                            </MenuItem>
                            <MenuItem value={0}>
                                Не оплачен
                            </MenuItem>
                        </Select>
                    </FormControl>
                ),
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
                                        ended_at: dayjs(params.row.ended_at),
                                        payment_status: params.row.payment_status === true ? 1 : 0,
                                        id: params.row.id,
                                        warehouse: params.row.warehouse,
                                        bag_number: params.row.bag_number,
                                        amount: params.row.amount,
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
                                        ended_at: dayjs(params.row.ended_at),
                                        payment_status: params.row.payment_status === true ? 1 : 0,
                                        id: params.row.id,
                                        warehouse: params.row.warehouse,
                                        bag_number: params.row.bag_number,
                                        amount: params.row.amount,
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

    const tableList = WarehouseService.GetWarehouseBagsList({
        ...table.filter,
        warehouse: id
    });
    const warehouseInfo = WarehouseService.GetWarehouse(id)

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
        const values = {
            ...modal.values,
            ended_at: moment(modal.values.ended_at?.$d).format('DD.MM.YY').toString(),
        }

        switch (modal.action) {
            case 'add':
                WarehouseService.WarehouseBagCreate(values).then((res) => {
                    setModal(initialValues);
                    warehouseInfo.execute()
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                });

                break;

            case 'edit':
                WarehouseService.WarehouseBagUpdate(values).then((res) => {
                    setModal(initialValues);
                    warehouseInfo.execute()
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                });

                break;

            case 'delete':
                WarehouseService.WarehouseBagDelete(values).then((res) => {
                    setModal(initialValues);
                    warehouseInfo.execute()
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                });

                break;

            case 'bulkUpdate':
                WarehouseService.WarehouseBagsUpdate({
                    bag_ids: table.selected_rows
                }).then(()=>{
                    setModal(initialValues);
                    tableList.execute().then(()=>{
                        setTable({
                            ...table,
                            selected_rows: []
                        })
                    });
                })
                break;

        }
    };

    return (
        <section>
            <ToastContainer/>
            <h1 className="text-[32px] font-bold">Просмотр склада</h1>

            <div className='w-full mt-[63px] bg-white py-[20px] px-[40px] shadow-block'>
                {warehouseInfo.loading
                    ? 'loading'
                    : warehouseInfo.error
                        ? 'error'
                        :
                        <div className='w-full flex flex-col items-start justify-start gap-[50px]'>
                            <h4 className='text-[20px] font-[700] text-[#252525]'>Код {warehouseInfo.result?.data.warehouse_code}</h4>

                            <div className='w-full flex items-start justify-start gap-[90px]'>
                                <div className='flex flex-col items-start justify-start gap-[10px]'>
                                    <span className='text-[16px] text-[#252525] font-[700]'>ФИО: </span>
                                    <p className='text-[16px] text-[#252525] font-[400]'>
                                        {warehouseInfo.result?.data.client?.full_name}
                                    </p>
                                </div>
                                <div className='flex flex-col items-start justify-start gap-[10px]'>
                                    <span className='text-[16px] text-[#252525] font-[700]'>Количество: </span>
                                    <p className='text-[16px] text-[#252525] font-[400]'>
                                        {warehouseInfo.result?.data.total_bags}
                                    </p>
                                </div>
                                <div className='flex flex-col items-start justify-start gap-[10px]'>
                                    <span className='text-[16px] text-[#252525] font-[700]'>Сумма: </span>
                                    <p className='text-[16px] text-[#252525] font-[400]'>
                                        {warehouseInfo.result?.data.total_amount}
                                    </p>
                                </div>
                            </div>
                        </div>
                }
            </div>

            <div className="flex items-center justify-between mt-[63px]">
                <div></div>
                <CustomButton
                    type="button"
                    className="py-[12px] px-[20px] text-white"
                    text="Добавить"
                    onClick={() => {
                        setModal({
                            ...modal,
                            open: true,
                            action: 'add',
                            values: initialValues.values
                        })
                    }}
                />
            </div>

            <div className="mt-[39px]">
                <Box className="shadow-block" sx={{width: "100%", padding: '20px 11px'}}>
                    <DataGrid
                        rows={table.rows}
                        columns={table.columns}
                        checkboxSelection={true}
                        onRowSelectionModelChange={(rowSelectionModel) => {
                            setTable({
                                ...table,
                                selected_rows: rowSelectionModel
                            })
                        }}
                        rowSelectionModel={table.selected_rows}
                        isRowSelectable={(params: GridRowParams) => !params.row.status}
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
                <div className="flex justify-center mt-[40px] mb-[80px]">
                    <CustomButton
                        type="button"
                        className="py-[12px] px-[80px] text-white"
                        text="Выдать"
                        disabled={table.selected_rows.length === 0}
                        onClick={()=>{
                            setModal({
                                ...modal,
                                open: true,
                                action: 'bulkUpdate'
                            })
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
                        {modal.action === 'bulkUpdate' && 'Обновить записи?'}
                    </h2>

                    {modal.action !== 'delete' && modal.action !== 'bulkUpdate' &&
                        <div className='w-full grid grid-cols-2 gap-[40px] mb-[40px]'>
                            <TextField
                                fullWidth
                                required
                                label="Номер мешка"
                                variant="standard"
                                type={"number"}
                                error={modal.validation.error.bag_number}
                                helperText={modal.validation.message.bag_number}
                                value={modal.values.bag_number}
                                onChange={(e) => {
                                    setModal({
                                        ...modal,
                                        values: {
                                            ...modal.values,
                                            bag_number: e.target.value,
                                        },
                                    });
                                }}
                            />
                            <DatePicker
                                label="Дата окончания"
                                value={modal.values.ended_at}
                                onChange={(newValue: any) => {
                                    setModal({
                                        ...modal,
                                        values: {
                                            ...modal.values,
                                            ended_at: newValue
                                        }
                                    })
                                }}
                                slotProps={{
                                    textField: {
                                        variant: "standard",
                                        required: true,
                                        error: modal.validation.error.ended_at,
                                        helperText: modal.validation.message.ended_at,
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                required
                                label="Стоимость"
                                variant="standard"
                                type={"number"}
                                error={modal.validation.error.amount}
                                helperText={modal.validation.message.amount}
                                value={modal.values.amount}
                                onChange={(e) => {
                                    setModal({
                                        ...modal,
                                        values: {
                                            ...modal.values,
                                            amount: e.target.value,
                                        },
                                    });
                                }}
                            />

                            <FormControl variant="standard">
                                <InputLabel>Статус оплаты</InputLabel>
                                <Select
                                    label="Статус оплаты"
                                    required
                                    value={modal.values.payment_status}
                                    error={modal.validation.error.payment_status}
                                    onChange={(event: any) => {
                                        setModal({
                                            ...modal,
                                            values: {
                                                ...modal.values,
                                                payment_status: event.target.value,
                                            },
                                        });
                                    }}
                                >
                                    <MenuItem value={1}>
                                        Оплачен
                                    </MenuItem>
                                    <MenuItem value={0}>
                                        Не оплачен
                                    </MenuItem>
                                </Select>
                                <FormHelperText>{modal.validation.message.payment_status}</FormHelperText>
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
