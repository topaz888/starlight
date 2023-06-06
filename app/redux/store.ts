import {configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import {bluetoothSaga} from './bluetooth/bluetooth.sagas';
import { all, fork } from 'redux-saga/effects';
import { rootReducer } from './root.reducer';
import logger from 'redux-logger';
import { useDispatch } from 'react-redux';


const sagaMiddleware = createSagaMiddleware();
const rootSaga = function* rootSaga() {
  yield all([
    fork(bluetoothSaga)
  ])
}

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(sagaMiddleware),
    devTools: process.env.NODE_ENV === 'production'
  });
  
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();