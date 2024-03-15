import React, {useEffect, useState} from "react";
import {createSearchParams, Link, useNavigate} from "react-router-dom";
import {Search} from "../../components/Search";
import {CustomButton} from "../../components/CustomButton";
import {Box, FormControl, IconButton, InputLabel, MenuItem, Modal, Pagination, Select,} from "@mui/material";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {DataGrid} from "@mui/x-data-grid";
import {ClientsConsigneesService} from "../../service/ClientsConsigneesService";
import {MdDeleteForever, MdEdit} from "react-icons/md";
import {checkModalResponse} from "../../helpers/helpers";

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
const modalInitialValues = {
    open: false,
    values: {
        id: "",
        client_id: "",
        full_name: "",
        country: "",
        city: "",
        inn: "",
        okpo: "",
        shppers: "",
        markets: "",
        phone: "",
    },
    validation: {
        error: {
            client_id: false,
            full_name: false,
            country: false,
            city: false,
            inn: false,
            okpo: false,
            shppers: false,
            markets: false,
            phone: false,
        },
        message: {
            client_id: "",
            full_name: "",
            country: "",
            city: "",
            inn: "",
            okpo: "",
            shppers: "",
            markets: "",
            phone: "",
        },
    },
    requested: false,
    showPassword: false,
    action: ''
};
export const ClientsConsigneesPage: React.FC = () => {
    const navigate = useNavigate();


    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: "id", headerName: "Код клиента"},
            {
                field: "client_id",
                headerName: "Код клиента",
                sortable: false,
                flex: 1,
            },
            {
                field: "full_name",
                headerName: "Полное имя",
                sortable: false,
                flex: 1
            },

            {
                field: "country",
                headerName: "Страна",
                renderCell: (params: any) => params.row.country?.name,
                sortable: false,
                flex: 1
            },
            {
                field: "city",
                headerName: "Город",
                renderCell: (params: any) => params.row.city?.name,
                sortable: false,
                flex: 1
            },

            {field: "phone", headerName: "Телефон", flex: 1, sortable: false},

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
                                    pathname: "/clients/consignee/details",
                                    search: createSearchParams({
                                        action: "edit",
                                        client_consignee_id: params.row.id,
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
                                    action: 'delete',
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

    const [modal, setModal] = useState(modalInitialValues);

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setModal({
            ...modal,
            requested: true,
        });
        switch (modal.action){
            case "delete":
                ClientsConsigneesService.DeleteConsignee(modal.values)
                    .then(() => {
                        setModal(modalInitialValues);
                        tableList.execute();
                    })
                    .catch((err) => {
                        checkModalResponse(err.response.data, setModal, modal);
                    });

                break;
        }
    };

    const tableList = ClientsConsigneesService.GetConsigneesList(table.filter);

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
            <h1 className="text-[32px] font-bold">Грузополучатель</h1>
            <div className="flex items-center justify-between mt-[63px]">
                <div className="flex items-center gap-[30px]">
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

                    <FormControl variant="standard" className="select-cargo">
                        <InputLabel>Грузополучатель</InputLabel>
                        <Select>
                            <Link to="/clients/shippers">
                                <MenuItem>Грузоотправитель</MenuItem>
                            </Link>
                            <Link to="/clients/consignees">
                                <MenuItem>Грузополучатель</MenuItem>
                            </Link>
                        </Select>
                    </FormControl>
                </div>

                <CustomButton
                    type="button"
                    className="py-[12px] px-[55px] text-white"
                    text="Добавить"
                    onClick={() =>
                        navigate({
                            pathname: "/clients/consignee/details",
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
                onClose={() => setModal(modalInitialValues)}
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
                        onClick={() => setModal(modalInitialValues)}
                    >
                        <IoIosCloseCircleOutline className="text-[28px] text-[#1C61D5]"/>
                    </IconButton>

                    <h2 className="text-[30px] font-[600] text-[#1E1C2A] mb-[40px]">
                        Удалить грузоотправителя?
                    </h2>

                    <div className="flex justify-between gap-[40px] items-center mt-[20px]">
                        <CustomButton
                            onClick={() => setModal(modalInitialValues)}
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
