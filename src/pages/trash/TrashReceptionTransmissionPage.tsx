import React, {useEffect, useState} from "react";
import {createSearchParams, useNavigate} from "react-router-dom";
import {Search} from "../../components/Search";
import {CustomButton} from "../../components/CustomButton";
import {Box, IconButton, Modal, Pagination} from "@mui/material";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {DataGrid} from "@mui/x-data-grid";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import moment from "moment/moment";
import ReplayIcon from '@mui/icons-material/Replay';
import {TrashService} from "../../service/TrashService";


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
export const TrashReceptionTransmissionPage: React.FC = () => {
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
                field: "route",
                headerName: "Рейсы",
                width: 163,
                sortable: false,
                renderCell: (params: any) => params.row.route?.route_id
            },
            {
                field: "date",
                headerName: "Дата создания",
                width: 163,
                sortable: false,
                renderCell: (params: any) => moment(params.row.date).format('DD.MM.YY').toString()
            },
            {
                field: "shippers",
                headerName: "Грузоотправитель",
                width: 163,
                sortable: false,
                renderCell: (params: any) => params.row.shipper?.full_name
            },
            {
                field: "consignee",
                headerName: "Получатель",
                width: 163,
                sortable: false,
                renderCell: (params: any) => params.row.consignee?.full_name
            },
            {
                field: "place_of_registration",
                headerName: "Место оформления",
                width: 163,
                sortable: false,
                renderCell: (params: any) => params.row.place_of_registration?.name
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
                                    values: {
                                        id: params.row.id,
                                    },
                                });
                            }}
                        >
                            <ReplayIcon/>
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

        TrashService.RestoreFromTrash({
            id: modal.values.id,
            slug: 'reception_transmission',
        }).then(() => {
            setModal(initialValues);
            tableList.execute();
        })
    };

    const tableList = TrashService.GetReceptionTransmissionList(table.filter)

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
            <h1 className="text-[32px] font-bold">Корзина - Прием / передача</h1>
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
                        Восстановить запись?
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
                            text="Готово"
                        />
                    </div>
                </form>
            </Modal>
        </section>
    );
};
