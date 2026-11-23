import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

interface reducerState {}

const initialState: reducerState = {};
//title động theo tên page
export const titleSlice = createSlice({
  name: "title",
  initialState,
  reducers: {},
});

export default titleSlice;
