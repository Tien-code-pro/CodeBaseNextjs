import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
// import createSagaMiddleware from "redux-saga";
// import rootSaga from "./saga";
import appSlice from "@/app/appSlice";

// page:create imports:start
// page:create imports:end
// const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    // page:create reducers:start
    // page:create reducers:end
    app: appSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: false,
});

// sagaMiddleware.run(rootSaga);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store;
