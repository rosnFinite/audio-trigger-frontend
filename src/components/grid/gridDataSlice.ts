import {createSlice} from "@reduxjs/toolkit";
import {GridElement} from "./Grid.types";

export const gridDataSlice = createSlice({
  name: "gridData",
  initialState: {
    value:  [[]] as GridElement[][]
  },
  reducers: {
    initializeGrid: (state, action) => {
      state.value = action.payload;
    },
    updateElement: (state, action) => {
      // multi dimensional array -> therefor y first
      state.value[action.payload.y][action.payload.x] = action.payload
    }
  }
})

export const { initializeGrid, updateElement } = gridDataSlice.actions;
export default gridDataSlice.reducer;