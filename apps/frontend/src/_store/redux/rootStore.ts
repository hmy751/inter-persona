import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import chatReducer from '@/_store/redux/features/chat/slice';
import { rootSaga } from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const makeStore = (preloadedState = {}) => {
  const ignoredRules = {
    ignoredActions: ['SEND_RECORD', 'chat/startChat', 'chat/triggerContent'],
    ignoredActionPaths: ['payload.formData'],
    ignoredPaths: ['chat.contents.*.timeStamp'],
  };

  const store = configureStore({
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: process.env.NODE_ENV === 'test' ? false : ignoredRules,
      }).concat(sagaMiddleware),
    reducer: {
      chat: chatReducer,
    },
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });

  sagaMiddleware.run(rootSaga);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
