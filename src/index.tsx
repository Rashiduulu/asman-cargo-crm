import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";

let persistor = persistStore(store);
export const {dispatch} = store

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
            <PersistGate loading={<>loading...</>} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </LocalizationProvider>
);
