import rootReducer from './reducers/index';
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { persistReducer,persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'


const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);
export const persistor = persistStore(store);
