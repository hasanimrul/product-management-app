// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
// import productsReducer from "./slices/productSlice";

// export const makeStore = () => {
//   return configureStore({
//     reducer: {
//       auth: authReducer,
//       products: productsReducer,
//     },
//   });
// };

// export const store = makeStore();

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import productsReducer from "./slices/productSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  const persistor = persistStore(store);

  return { store, persistor };
};
