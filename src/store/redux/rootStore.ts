import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import chatReducer from "@/store/redux/features/chat/slice";
import { rootSaga } from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const makeStore = () => {
  const store = configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(sagaMiddleware),
    reducer: {
      chat: chatReducer,
    },
  });

  sagaMiddleware.run(rootSaga);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
