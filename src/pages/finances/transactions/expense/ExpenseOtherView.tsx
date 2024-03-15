import React from "react";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {TransactionsService} from "../../../../service/TransactionsService";
import {Skeleton} from "@mui/material";
import {MdLocalPrintshop} from "react-icons/md";
import {CustomButton} from "../../../../components/CustomButton";
import moment from "moment/moment";


export const ExpenseOtherView: React.FC = () => {
    const navigate = useNavigate()
    const {id} = useParams()

    const transaction = TransactionsService.GetTransaction(id,'expense')

    return (
        <section>
            <ToastContainer/>
            <h1 className="text-[32px] font-bold">Просмотр расходника</h1>
            <div className='w-full px-[26px] py-[30px] bg-white flex flex-col justify-start items-start mt-[60px]'>
                <h3 className='text-[#252525] text-[20px] font-[700] mb-[50px]'>
                    Расходный кассовый ордер
                </h3>
                {transaction.loading
                    ?
                    <div className='w-full flex flex-col justify-start items-start gap-[50px]'>
                        <Skeleton variant="rectangular" width={'100%'} height={118} />
                        <Skeleton variant="rectangular" width={'100%'} height={118} />
                        <Skeleton variant="rectangular" width={'100%'} height={218} />
                    </div>
                    : transaction.error
                        ? 'error'
                        :
                        <>
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
                                <div className='flex items-start gap-[20px]'>
                                    <div className='w-[127px]'>
                                        <div className='w-full flex justify-center items-center border border-black h-[29px]'>
                                            <p className='text-[#252525] text-[14px] font-[400]'>
                                                Номер документа
                                            </p>
                                        </div>
                                        <div className='w-full flex justify-center items-center border border-black h-[29px]'>
                                            <p className='text-[#252525] text-[14px] font-[400]'>
                                                {transaction.result?.data.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='w-[127px] h-[29px]'>
                                        <div className='w-full flex justify-center items-center border border-black h-[29px]'>
                                            <p className='text-[#252525] text-[14px] font-[400]'>
                                                Дата составления
                                            </p>
                                        </div>
                                        <div className='w-full flex justify-center items-center border border-black h-[29px]'>
                                            <p className='text-[#252525] text-[14px] font-[400]'>
                                                {moment(transaction.result?.data.created_at).format('DD.MM.YY')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className='w-full mb-[50px]'>
                                <tr>
                                    <th>
                                        <p className='text-[#252525] text-[14px] font-[700] text-start pb-[30px]'>Сумма</p>
                                    </th>
                                    <th>
                                        <p className='text-[#252525] text-[14px] font-[700] text-start  pb-[30px]'>Статья</p>
                                    </th>
                                    <th>
                                        <p className='text-[#252525] text-[14px] font-[700] text-start  pb-[30px]'>Описание</p>
                                    </th>
                                </tr>
                                {transaction.result?.data.expense.map((item: any, index: number)=>(
                                    <tr key={index}>
                                        <td>
                                            <p className='text-[#252525] text-[12px] font-[400] text-start pb-[10px]'>
                                                {item.sum}
                                            </p>
                                        </td>
                                        <td>
                                            <p className='text-[#252525] text-[12px] font-[400] text-start pb-[10px]'>
                                                {item.item.name}
                                            </p>
                                        </td>
                                        <td>
                                            <p className='text-[#252525] text-[12px] font-[400] text-start pb-[10px]'>
                                                {item.note}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </table>

                            <div className='w-full'>
                                <div className='w-full flex gap-[24px] items-start mb-[30px]'>
                                    <p className='text-[#252525] text-[12px] font-[400] '>Получил</p>
                                    <div className='flex-1'>
                                        <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                        <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                        <br/>
                                        <p className='h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                        <div className='w-full flex gap-[31px]'>
                                            <div className='flex gap-[10px]'>
                                                <p className='text-[#252525] text-[12px] font-[400] '>“&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;”</p>
                                                <p className='w-[100px] h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                            </div>

                                            <div className='flex gap-[10px]'>
                                                <p className='text-[#252525] text-[12px] font-[400] '>Подпись</p>
                                                <p className='w-[100px] h-[20px] border-b-[1px] border-b-[#C6CAD0] mb-[10px]'></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full flex gap-[24px] items-start mb-[30px]'>
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
                                <div className='w-full flex gap-[24px] items-start mb-[30px]'>
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
                            <div className="flex w-full justify-between mt-[40px]">
                                <div></div>
                                <div className="cursor-pointer flex items-center gap-2 py-[8px] px-[20px] bg-[#1C61D5] rounded-[10px]"
                                     onClick={()=>{
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
                        </>
                }
            </div>
        </section>
    );
};
