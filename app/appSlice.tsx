import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

interface ModalItem {
  id: string;
  content: ReactNode;
  closeOnClickOutside?: boolean; // Tùy chọn có đóng khi click outside không
  onClose?: () => void; // Callback when modal closes
}
interface reducerState {
  modals: ModalItem[]; // Thay đổi từ modal: any thành modals: ModalItem[]
  refresh: boolean;
  isLogin: boolean;
  loadingLogin: boolean;
  loading: number;
}

const initialState: reducerState = {
  modals: [], // Array rỗng thay vì null
  refresh: true,
  isLogin: false,
  loadingLogin: true,
  loading: 0,
};

let setTime1: any;
let setTime2: any;
let setTime3: any;
let setTime4: any;
let setTime5: any;
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalItem>) => {
      // Kiểm tra xem modal ID đã tồn tại chưa
      const exists = state.modals.find((m) => m.id === action.payload.id);
      if (!exists) {
        state.modals.push(action.payload);
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter((m) => m.id !== action.payload);
    },
    // Đóng modal trên cùng (modal cuối cùng trong array)
    closeTopModal: (state) => {
      if (state.modals.length > 0) {
        state.modals.pop();
      }
    },
    // Đóng tất cả modals
    closeAllModals: (state) => {
      state.modals = [];
    },
    closeIndexModal: (state, action: PayloadAction<number>) => {
      if (state.modals.length < action.payload) {
        state.modals = [];
      } else {
        state.modals = state.modals.slice(0, -action.payload);
      }
    },
    // loadingCallAPI: (state) => {
    //   setTime1 = setTimeout(() => {
    //     state.loading = 25;
    //   }, 200);
    //   setTime2 = setTimeout(() => {
    //     state.loading = 50;
    //   }, 400);
    //   setTime3 = setTimeout(() => {
    //     state.loading = 75;
    //   }, 600);
    //   setTime4 = setTimeout(() => {
    //     state.loading = 90;
    //   }, 800);
    //   setTime5 = setTimeout(() => {
    //     state.loading = 100;
    //   }, 20000);
    // },
    finishLoad: (state) => {
      clearTimeout(setTime1);
      clearTimeout(setTime2);
      clearTimeout(setTime3);
      clearTimeout(setTime4);
      clearTimeout(setTime5);
      state.loading = 100;
    },
    setLogin: (state) => {
      state.isLogin = true;
    },
    setLogout: (state) => {
      state.isLogin = false;
    },
    loadingLoginAPI: (state, action: PayloadAction<boolean>) => {
      state.loadingLogin = action.payload;
    },
  },
});

export default appSlice;
