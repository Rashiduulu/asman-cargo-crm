import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import {SignIn} from "./pages/SignInPage";
import {Layout} from "./components/Layout";
import {EmployeesPage} from "./pages/employees/EmployeesPage";
import {ClientsConsigneesPage} from "./pages/clients/ClientsConsigneesPage";
import {ClientsShippersPage} from "./pages/clients/ClientsShippersPage";
import {ReceptionTransmissionPage} from "./pages/receptionTransmission/ReceptionTransmissionPage";
import {BoxOffice} from "./pages/finances/BoxOffice";
import {Transactions} from "./pages/finances/transactions/TransactionsPage";
import {PrepaymentPage} from "./pages/finances/PrepaymentPage";
import {Warehouse} from "./pages/warehouse/Warehouse";
import {FinesPage} from "./pages/finances/FinesPage";
import {DebitsPage} from "./pages/debits/DebitsPage";
import {ClientDebitsPage} from "./pages/debits/ClientDebitsPage";
import {TrashRoutesPage} from "./pages/trash/TrashRoutesPage";
import {TrashReceptionTransmissionPage} from "./pages/trash/TrashReceptionTransmissionPage";
import {TrashOperationsPage} from "./pages/trash/TrashOperationsPage";
import {TrashIncomingGoodsPage} from "./pages/trash/TrashIncomingGoodsPage";
import {EmployeePageDetails} from "./pages/employees/EmployeePageDetails";
import MiddleWare from "./components/Middleware";
import {ClientsConsigneePageDetails} from "./pages/clients/ClientsConsigneePageDetails";
import {RoutesPageDetails} from "./pages/routes/RoutesPageDetails";
import {ReceptionTransmissionDetails} from "./pages/receptionTransmission/ReceptionTransmissionDetails";
import {RoutesPage} from "./pages/routes/RoutesPage";
import {WarehouseDetails} from "./pages/warehouse/WarehouseDetails";
import {IncomeClient} from "./pages/finances/transactions/income/IncomeClient";
import {ExpenseStaff} from "./pages/finances/transactions/expense/ExpenseStaff";
import {ExpenseOther} from "./pages/finances/transactions/expense/ExpenseOther";
import {IncomeClientView} from "./pages/finances/transactions/income/IncomeClientView";
import {ExpenseStaffView} from "./pages/finances/transactions/expense/ExpenseStaffView";
import {ExpenseOtherView} from "./pages/finances/transactions/expense/ExpenseOtherView";
import {RoutesPageView} from "./pages/routes/RoutesPageView";
import {SalariesDetails} from "./pages/finances/salary/SalariesDetails";
import {Salaries} from "./pages/finances/salary/Salaries";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="sign-in"
                    element={
                        <MiddleWare>
                            <SignIn/>
                        </MiddleWare>
                    }
                />

                <Route
                    path="/*"
                    element={
                        <MiddleWare>
                            <Layout/>
                        </MiddleWare>
                    }
                >
                    <Route index path="employee" element={<EmployeesPage/>}/>
                    <Route path="employee/details" element={<EmployeePageDetails/>}/>

                    <Route path="clients/consignee/details" element={<ClientsConsigneePageDetails/>}/>
                    <Route path="clients/consignees" element={<ClientsConsigneesPage/>}/>
                    <Route path="clients/shippers" element={<ClientsShippersPage/>}/>

                    <Route path='routes/*'>
                        <Route index element={<RoutesPage/>}/>
                        <Route path="details" element={<RoutesPageDetails/>}/>
                        <Route path=":id" element={<RoutesPageView/>}/>
                    </Route>

                    <Route path='reception-transmission/*'>
                        <Route index element={<ReceptionTransmissionPage/>}/>
                        <Route path="details" element={<ReceptionTransmissionDetails/>}/>
                    </Route>

                    <Route path="finance/*">
                        <Route path="box-office" element={<BoxOffice/>}/>
                        <Route path="transactions/*">
                            <Route index element={<Transactions/>}/>
                            <Route path='income/client/' element={<IncomeClient/>}/>
                            <Route path='income/client/:id' element={<IncomeClientView/>}/>
                            <Route path='expense/staff/' element={<ExpenseStaff/>}/>
                            <Route path='expense/staff/:id' element={<ExpenseStaffView/>}/>
                            <Route path='expense/other/' element={<ExpenseOther/>}/>
                            <Route path='expense/other/:id' element={<ExpenseOtherView/>}/>
                        </Route>
                        <Route path="prepayment" element={<PrepaymentPage/>}/>
                        <Route path="fines" element={<FinesPage/>}/>
                        <Route path="salaries/*">
                            <Route index element={<Salaries/>}/>
                            <Route path='details' element={<SalariesDetails/>}/>
                        </Route>
                    </Route>

                    <Route path="warehouse/*">
                        <Route index element={<Warehouse/>}/>
                        <Route path=':id' element={<WarehouseDetails/>}/>
                    </Route>

                    <Route path="debits/*">
                        <Route path="debits-report" element={<DebitsPage/>}/>
                        <Route path="client-debits-report" element={<ClientDebitsPage/>}/>
                    </Route>

                    <Route path='trash/*'>
                        <Route path="routes" element={<TrashRoutesPage/>}/>
                        <Route path="reception-transmission" element={<TrashReceptionTransmissionPage/>}/>
                        <Route path="operations" element={<TrashOperationsPage/>}/>
                        <Route path="incoming-goods" element={<TrashIncomingGoodsPage/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
