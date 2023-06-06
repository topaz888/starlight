import {combineReducers} from 'redux'
import bluetoothReducer from './bluetooth/bluetooth.reducer'
import ledReducer from './led/led.reducer';

const rootReducer = combineReducers({
    bluetooth: bluetoothReducer.reducer,
    led:ledReducer.reducer,
  });
  
export {rootReducer}