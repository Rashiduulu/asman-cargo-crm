import React from "react";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {TransactionsService} from "../../../../service/TransactionsService";
import {Skeleton} from "@mui/material";
import {MdLocalPrintshop} from "react-icons/md";
import {CustomButton} from "../../../../components/CustomButton";
import moment from "moment/moment";


export const IncomeClientView: React.FC = () => {
    const {id} = useParams()

    const transaction = TransactionsService.GetTransaction(id, 'income')

    return (
        <section>
            <ToastContainer/>
            <h1 className="text-[32px] font-bold mb-[60px]">Просмотр приходника</h1>
            {transaction.loading
                ?
                <div className='w-full flex flex-col justify-start items-start gap-[50px]'>
                    <Skeleton variant="rectangular" width={'100%'} height={118}/>
                    <Skeleton variant="rectangular" width={'100%'} height={118}/>
                    <Skeleton variant="rectangular" width={'100%'} height={218}/>
                </div>
                : transaction.error
                    ? 'error'
                    :
                    <div className='w-full bg-white'>
                        <div className='w-full flex'>
                            <div
                                className='w-full px-[26px] py-[30px] flex flex-1 flex-col justify-start items-start gap-[50px]'>
                                <h3 className='text-[#252525] text-[20px] font-[700]'>Приходный кассовый ордер</h3>

                                <div className='w-full flex justify-between items-start'>
                                    <div className='flex flex-col justify-start items-start gap-[10px]'>
                                        <p className='text-[#252525] text-[14px] font-[400]'>
                                            Сумма: {transaction.result?.data.total_sum}
                                        </p>
                                        <p className='text-[#252525] text-[14px] font-[400]'>
                                            Валюта: {transaction.result?.data.currency?.name}
                                        </p>
                                        <p className='text-[#252525] text-[14px] font-[400]'>
                                            Описание: {transaction.result?.data.description}
                                        </p>
                                    </div>
                                    <div className='flex items-start gap-[20px]'>
                                        <div className='w-[127px]'>
                                            <div
                                                className='w-full flex justify-center items-center border border-black h-[29px]'>
                                                <p className='text-[#252525] text-[14px] font-[400]'>
                                                    Номер документа
                                                </p>
                                            </div>
                                            <div
                                                className='w-full flex justify-center items-center border border-black h-[29px]'>
                                                <p className='text-[#252525] text-[14px] font-[400]'>
                                                    {transaction.result?.data.id}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='w-[127px] h-[29px]'>
                                            <div
                                                className='w-full flex justify-center items-center border border-black h-[29px]'>
                                                <p className='text-[#252525] text-[14px] font-[400]'>
                                                    Дата составления
                                                </p>
                                            </div>
                                            <div
                                                className='w-full flex justify-center items-center border border-black h-[29px]'>
                                                <p className='text-[#252525] text-[14px] font-[400]'>
                                                    {moment(transaction.result?.data.created_at).format('DD.MM.YY')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='w-full'>
                                    <p className='text-[#252525] text-[14px] font-[700]'>
                                        Принято от
                                    </p>
                                </div>

                                <table className='w-full'>
                                    <thead>
                                    <tr>
                                        <th>
                                            <p className='text-[#252525] text-[14px] font-[700] text-start pb-[30px]'>Код
                                                клиента</p>
                                        </th>
                                        <th>
                                            <p className='text-[#252525] text-[14px] font-[700] text-start  pb-[30px]'>Рейс</p>
                                        </th>
                                        <th>
                                            <p className='text-[#252525] text-[14px] font-[700] text-start  pb-[30px]'>Сумма</p>
                                        </th>
                                        <th>
                                            <p className='text-[#252525] text-[14px] font-[700] text-start  pb-[30px]'>Статья</p>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {transaction.result?.data.income.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td>
                                                <p className='text-[#252525] text-[12px] font-[400] text-start pb-[10px]'>
                                                    {item.client?.client_id}  {item.client?.full_name}
                                                </p>
                                            </td>
                                            <td>
                                                <p className='text-[#252525] text-[12px] font-[400] text-start pb-[10px]'>
                                                    {item.reception_transmission?.route?.route_id}
                                                </p>
                                            </td>
                                            <td>
                                                <p className='text-[#252525] text-[12px] font-[400] text-start pb-[10px]'>
                                                    {item.sum}
                                                </p>
                                            </td>
                                            <td>
                                                <p className='text-[#252525] text-[12px] font-[400] text-start pb-[10px]'>
                                                    {item.item?.name}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                <div className='w-full flex flex-col justify-start items-start gap-[30px]'>
                                    <div className='w-full flex gap-[24px] items-start'>
                                        <p className='text-[#252525] text-[12px] font-[400] '>Главный бухгалтер</p>
                                        <div className='flex-1'>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                        </div>
                                        <div className='flex-1'>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                        </div>
                                    </div>
                                    <div className='w-full flex gap-[24px] items-start'>
                                        <p className='text-[#252525] text-[12px] font-[400] '>Выдал кассир</p>
                                        <div className='flex-1'>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                        </div>
                                        <div className='flex-1'>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className='w-[383px] px-[26px] py-[30px] pl-[15px] flex flex-col justify-start items-center border-l border-l-[#252525]'>
                                <h5 className='text-[#252525] text-[14px] font-[400] mb-[50px]'>ОсОО "Asman Cargo"</h5>
                                <h3 className='text-[#252525] text-[20px] font-[700] mb-[10px]'>Приходный кассовый
                                    ордер</h3>
                                <h6 className='text-[#252525] text-[14px] font-[400] mb-[50px] text-center'>к приходному
                                    кассовому ордеру№{transaction.result?.data.id} от {moment(transaction.result?.data.created_at).format('DD.MM.YY')}</h6>
                                <div className='w-full flex justify-between items-start mb-[50px]'>
                                    <div className='flex flex-col justify-start items-start gap-[10px]'>
                                        <p className='text-[#252525] text-[14px] font-[400]'>
                                            Сумма: {transaction.result?.data.total_sum}
                                        </p>
                                        <p className='text-[#252525] text-[14px] font-[400]'>
                                            Валюта: {transaction.result?.data.currency?.name}
                                        </p>
                                        <p className='text-[#252525] text-[14px] font-[400]'>
                                            Описание: {transaction.result?.data.description}
                                        </p>
                                    </div>
                                </div>

                                <div className='w-full flex flex-col justify-start items-start gap-[30px]'>
                                    <div className='w-full flex gap-[24px] items-start'>
                                        <p className='text-[#252525] text-[12px] font-[400] '>Главный бухгалтер</p>
                                        <div className='flex-1'>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                        </div>
                                        <div className='flex-1'>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                        </div>
                                    </div>
                                    <div className='w-full flex gap-[24px] items-start'>
                                        <p className='text-[#252525] text-[12px] font-[400] '>Выдал кассир</p>
                                        <div className='flex-1'>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                        </div>
                                        <div className='flex-1'>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                            <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full px-[26px] py-[30px] justify-between">
                            <div></div>
                            <div
                                className="cursor-pointer flex items-center gap-2 py-[8px] px-[20px] bg-[#1C61D5] rounded-[10px]"
                                onClick={() => {
                                    window.open(transaction.result?.data.file, '_blank')
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
