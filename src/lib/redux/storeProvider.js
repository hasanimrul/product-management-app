// "use client";

// import { useRef } from "react";
// import { Provider } from "react-redux";
// import { makeStore } from "./store";

// export default function StoreProvider({ children }) {
//   const storeRef = useRef();

//   if (!storeRef.current) {
//     storeRef.current = makeStore();
//   }

//   return <Provider store={storeRef.current}>{children}</Provider>;
// }

"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { makeStore } from "./store";

export default function StoreProvider({ children }) {
  const storeRef = useRef();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const { store, persistor } = storeRef.current;

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
