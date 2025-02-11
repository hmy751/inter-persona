import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import chatReducer from "@/_store/redux/features/chat/slice";
import { rootSaga } from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const makeStore = (preloadedState = {}) => {
  const store = configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // FormData와 같은 비직렬화 가능한 값을 허용
          ignoredActions: ["SEND_RECORD"], // SEND_RECORD 액션 무시
          // 또는 특정 경로 무시
          ignoredActionPaths: ["payload.formData"],
        },
      }).concat(sagaMiddleware),
    reducer: {
      chat: chatReducer,
    },
    preloadedState,
    devTools: process.env.NODE_ENV !== "production",
  });

  sagaMiddleware.run(rootSaga);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
