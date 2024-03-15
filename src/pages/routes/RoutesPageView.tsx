import React from "react";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {Box, Skeleton} from "@mui/material";
import {MdLocalPrintshop} from "react-icons/md";
import {CustomButton} from "../../components/CustomButton";
import {RoutesService} from "../../service/RoutesService";
import {DataGrid} from "@mui/x-data-grid";
import moment from "moment";


export const RoutesPageView: React.FC = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const route = RoutesService.GetRoutes(id)

    return (
        <section>
            <ToastContainer/>
            <h1 className="text-[32px] font-bold mb-[60px]">Просмотр приходника</h1>
            {route.loading
                ?
                <div className='w-full flex flex-col justify-start items-start gap-[50px]'>
                    <Skeleton variant="rectangular" width={'100%'} height={500}/>
                </div>
                : route.error
                    ? 'error'
                    :
                    <div className='w-full bg-white'>
                        <div className='w-full px-[26px] py-[30px] pl-[15px] flex flex-col justify-start items-center'>
                            <h3 className='text-[#252525] text-[20px] font-[700] mb-[50px]'>
                                Рейс №{route.result?.data.route_id} ({route.result?.data.transport_type.name}) {route.result?.data.date}
                            </h3>

                            <div className='w-full grid grid-cols-8'>
                                <p className='text-[#252525] text-[10px] font-[500] pb-[10px] border-b border-b-[#C6CAD0]'>Код</p>
                                <p className='text-[#252525] text-[10px] font-[500] pb-[10px] border-b border-b-[#C6CAD0]'>Рынок</p>
                                <p className='text-[#252525] text-[10px] font-[500] pb-[10px] border-b border-b-[#C6CAD0]'>Получатель</p>
                                <p className='text-[#252525] text-[10px] font-[500] pb-[10px] border-b border-b-[#C6CAD0]'>Наименование</p>
                                <p className='text-[#252525] text-[10px] font-[500] pb-[10px] border-b border-b-[#C6CAD0]'>Количество</p>
                                <p className='text-[#252525] text-[10px] font-[500] pb-[10px] border-b border-b-[#C6CAD0]'>Вес</p>
                                <p className='text-[#252525] text-[10px] font-[500] pb-[10px] border-b border-b-[#C6CAD0]'>№ сумки</p>
                                <p className='text-[#252525] text-[10px] font-[500] pb-[10px] border-b border-b-[#C6CAD0]'>Отправитель</p>

                                {route.result?.data.reception_transmission_route.map((route: any, index: number)=>(
                                    <>
                                        <div className='w-full flex flex-col justify-start items-start gap-[10px] border-b border-b-[#C6CAD0] py-[20px]'></div>
                                        <div className='w-full flex flex-col justify-start items-start gap-[10px] border-b border-b-[#C6CAD0] py-[20px]'></div>
                                        <div className='w-full flex flex-col justify-start items-start gap-[10px] border-b border-b-[#C6CAD0] py-[20px]'>
                                            <p className='text-[#252525] text-[10px] font-[500] whitespace-pre-wrap'>{route.consignee?.full_name}</p>
                                            <p className='text-[#252525] text-[10px] font-[500] whitespace-pre-wrap'>{route.consignee?.phone}</p>
                                        </div>
                                        <div className='w-full flex flex-col justify-start items-start gap-[10px] border-b border-b-[#C6CAD0] py-[20px]'>
                                            {route.product_reception_transmission.map((product: any, index: number)=>(
                                                <p key={index} className='text-[#252525] text-[10px] font-[500] whitespace-pre-wrap'>{product.category?.name}</p>
                                            ))}
                                            <p className='text-[#252525] text-[10px] font-[700] whitespace-pre-wrap mt-[10px]'>Итого:</p>
                                        </div>
                                        <div className='w-full flex flex-col justify-start items-start gap-[10px] border-b border-b-[#C6CAD0] py-[20px]'>
                                            {route.product_reception_transmission.map((product: any, index: number)=>(
                                                <p key={index} className='text-[#252525] text-[10px] font-[500] whitespace-pre-wrap'>{product.quantity}</p>
                                            ))}
                                            <p className='text-[#252525] text-[10px] font-[700] whitespace-pre-wrap mt-[10px]'>{route.product_total_info?.quantity}</p>
                                        </div>
                                        <div className='w-full flex flex-col justify-start items-start gap-[10px] border-b border-b-[#C6CAD0] py-[20px]'>
                                            {route.product_reception_transmission.map((product: any, index: number)=>(
                                                <p key={index} className='text-[#252525] text-[10px] font-[500] whitespace-pre-wrap'>{product.weight} кг</p>
                                            ))}
                                            <p className='text-[#252525] text-[10px] font-[700] whitespace-pre-wrap mt-[10px]'>{route.product_total_info?.weight} кг</p>
                                        </div>
                                        <div className='w-full flex flex-col justify-start items-start gap-[10px] border-b border-b-[#C6CAD0] py-[20px]'>
                                            {route.product_reception_transmission.map((product: any, index: number)=>(
                                                <p key={index} className='text-[#252525] text-[10px] font-[500] whitespace-pre-wrap'>{product.bag_number}</p>
                                            ))}
                                            <p className='text-[#252525] text-[10px] font-[700] whitespace-pre-wrap mt-[10px]'>{route.product_total_info?.bags}</p>
                                        </div>
                                        <div className='w-full flex flex-col justify-start items-start gap-[10px] border-b border-b-[#C6CAD0] py-[20px]'>
                                            <p className='text-[#252525] text-[10px] font-[700] whitespace-pre-wrap'>{route.shipper?.full_name}</p>
                                            <p className='text-[#252525] text-[10px] font-[700] whitespace-pre-wrap'>{route.shipper?.phone}</p>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </div>

                        <div className="flex w-full px-[26px] py-[30px] justify-between">
                            <div></div>

                            <div
                                className="cursor-pointer flex items-center gap-2 py-[8px] px-[20px] bg-[#1C61D5] rounded-[10px]"
                                onClick={() => {
                                    window.open(route.result?.data.file, '_blank')
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
                    </div>

            }
        </section>
    );
};
