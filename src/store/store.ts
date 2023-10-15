import {
    configureStore,
    isRejectedWithValue,
    MiddlewareAPI,
    Middleware,
} from "@reduxjs/toolkit";
//   import { productsApi } from "./storeComponent/products/productsApi";
//   import productsReducer from "./storeComponent/products/productsSlice";
//   import { ordersApi } from "./storeComponent/orders/ordersApi";
//   import { authApi } from "./storeComponent/auth/authApi";
import authReducer from "./storeComponent/auth/authSlice";
import toastReducer from "./storeComponent/customDialog/toastSlice";
//   import dialogReducer from "./storeComponent/customDialog/dialogSlice";

/*import authReducer, { userLogout } from "../pages/Auth/authSlice";
import modalReducer from "../storeComponent/customModal/modalSlice";
import { memberApi } from "../pages/MemberManagement/memberApi";
import { settlementApi } from "../pages/SettlementManagement/settlementApi";
import { dispatchApi } from "../pages/DispatchManagement/dispatchApi";
import { notificationApi } from "../pages/NoticeManagement/notificationApi";
import { faqApi } from "../pages/FaqManagement/faqApi";
import { advertisementApi } from "../pages/AdvertisementManagement/advertisementApi"; */
const rootReducer = {
    // [productsApi.reducerPath]: productsApi.reducer,
    // [ordersApi.reducerPath]: ordersApi.reducer,
    auth: authReducer,
    // [authApi.reducerPath]: authApi.reducer,
    //    [memberApi.reducerPath]: memberApi.reducer,
    //     [settlementApi.reducerPath]: settlementApi.reducer,
    //     [dispatchApi.reducerPath]: dispatchApi.reducer,
    //     [notificationApi.reducerPath]: notificationApi.reducer,
    //     [faqApi.reducerPath]: faqApi.reducer,
    //     [advertisementApi.reducerPath]: advertisementApi.reducer,
    //     modal: modalReducer,
    // dialog: dialogReducer,
    // cart: productsReducer,
    toastR: toastReducer,
};
const rtkQueryErrorLogger: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        if (isRejectedWithValue(action)) {
            /*       console.log("rtkQueryErrorLogger", action);
             */ // unauthorized
            if (action.payload.status === 401) {
                /*       api.dispatch(userLogout());
                window.location.href = "/login"; */
            }
        }
        return next(action);
    };

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat([
            rtkQueryErrorLogger,
            // ordersApi.middleware,
            // productsApi.middleware,
            // authApi.middleware,
            /*  memberApi.middleware,
            settlementApi.middleware,
            dispatchApi.middleware,
            notificationApi.middleware,
            faqApi.middleware,
            advertisementApi.middleware, */
        ]),
});

export default store;
