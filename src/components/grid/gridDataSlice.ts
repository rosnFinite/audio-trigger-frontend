import {createSlice} from "@reduxjs/toolkit";

export const gridDataSlice = createSlice({
  name: "gridData",
  initialState: {
    value: [[]]
  },
  reducers: {
    addDatapoint: state => {}
  }
})

export const { addDatapoint } = gridDataSlice.actions;
export default gridDataSlice.reducer;