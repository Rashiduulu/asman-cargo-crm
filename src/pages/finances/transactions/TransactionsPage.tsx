import React, {useEffect, useState} from "react";
import {createSearchParams, useNavigate} from "react-router-dom";
import {Search} from "../../../components/Search";
import {CustomButton} from "../../../components/CustomButton";
import {
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Modal,
    Pagination,
} from "@mui/material";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {DataGrid} from "@mui/x-data-grid";
import {MdDeleteForever, MdEdit} from "react-icons/md";
import {checkModalResponse} from "../../../helpers/helpers";
import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from "react-toastify";
import {TransactionsService} from "../../../service/TransactionsService";
import moment from "moment/moment";

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
export const Transactions: React.FC = () => {
    const navigate = useNavigate();

    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: "id", headerName: "ID"},
            {
                field: "date",
                headerName: "Дата",
                sortable: false,
                renderCell: (params: any) =>
                    moment(params.row.date).format("DD.MM.YY").toString(),
                flex: 1,
            },
            {
                field: "box_office",
                headerName: "Касса",
                sortable: false,
                renderCell: (params: any) => params.row.box_office?.name,
                flex: 1,
            },
            {
                field: "transaction_type",
                headerName: "Тип операций",
                sortable: false,
                renderCell: (params: any) =>
                    params.row.assign_types?.transaction_type?.name,
                flex: 1,
            },
            {
                field: "assign_types",
                headerName: "Тип назначения",
                sortable: false,
                renderCell: (params: any) => params.row.assign_types?.name,
                flex: 1,
            },
            {
                field: "total_sum",
                headerName: "Сумма",
                sortable: false,
                renderCell: (params: any) => params.row.total_sum,
                flex: 1,
            },
            {
                field: "currency",
                headerName: "Валюта",
                sortable: false,
                renderCell: (params: any) => params.row.currency?.name,
                flex: 1,
            },
            {
                field: "description",
                headerName: "Описание",
                sortable: false,
                renderCell: (params: any) => params.row.description,
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
                                navigate({
                                    pathname: `${params.row.assign_types?.transaction_type?.slug}/${params.row.assign_types?.slug}`,
                                    search: createSearchParams({
                                        action: "edit",
                                        id: params.row.id,
                                        assign_types: params.row.assign_types?.id,
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

        TransactionsService.DeleteTransaction(modal.values)
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

    const tableList = TransactionsService.GetTransactionList(table.filter);
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

    const transaction_types = TransactionsService.GetTransactionTypes();
    const [anchorElArray, setAnchorElArray] = React.useState<Array<HTMLElement | null>>(
        Array(
            !transaction_types.loading && !transaction_types.error
                ? transaction_types.result?.data.length
                : [].length
        ).fill(null)
    );
    const handleClick = (event: any, index: number) => {
        const newAnchorElArray = [...anchorElArray];
        newAnchorElArray[index] = event.currentTarget;
        setAnchorElArray(newAnchorElArray);
    };
    const handleClose = (index: number) => {
        const newAnchorElArray = [...anchorElArray];
        newAnchorElArray[index] = null;
        setAnchorElArray(newAnchorElArray);
    };

    return (
        <section>
            <ToastContainer/>
            <h1 className="text-[32px] font-bold">Операции</h1>
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

                <div className="flex items-center gap-[20px]">
                    {!transaction_types.loading &&
                        !transaction_types.error &&
                        transaction_types.result?.data.map((type: any, index: any) => (
                            <div key={index}>
                                <Button
                                    id={`${type.slug}-button`}
                                    variant="contained"
                                    aria-controls={
                                        anchorElArray[index] ? `${type.slug}-menu` : undefined
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={Boolean(anchorElArray[index])}
                                    onClick={(event: any) => handleClick(event, index)}
                                >
                                    {type.name}
                                </Button>
                                <Menu
                                    id={`${type.slug}-menu`}
                                    anchorEl={anchorElArray[index]}
                                    open={Boolean(anchorElArray[index])}
                                    onClose={() => handleClose(index)}
                                    MenuListProps={{
                                        "aria-labelledby": `${type.slug}-button`,
                                    }}
                                >
                                    {type.assign_types.map(
                                        (assign_type: any, assignIndex: number) => (
                                            <MenuItem
                                                key={assignIndex}
                                                onClick={() => {
                                                    handleClose(index);
                                                    navigate({
                                                        pathname: `${type.slug}/${assign_type.slug}`,
                                                        search: createSearchParams({
                                                            action: "add",
                                                            assign_types: assign_type.id,
                                                        }).toString(),
                                                    });
                                                }}
                                            >
                                                {assign_type.name}
                                            </MenuItem>
                                        )
                                    )}
                                </Menu>
                            </div>
                        ))}
                </div>
            </div>
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
                        onRowDoubleClick={(params: any) => {
                            navigate({
                                pathname: `${params.row.assign_types?.transaction_type?.slug}/${params.row.assign_types?.slug}/${params.row.id}`,
                            });
                        }}
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
