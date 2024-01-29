import {createSlice} from "@reduxjs/toolkit";

interface GridElement {
  x: number,
  y: number,
  fill: string
}

export const gridDataSlice = createSlice({
  name: "gridData",
  initialState: {
    value:  [[]] as GridElement[][]
  },
  reducers: {
    initializeGrid: (state, action) => {
      state.value = action.payload;
    },
    updateElementColor: (state, action) => {
      state.value[action.payload.x][action.payload.y] = action.payload
    }
  }
})

export const { initializeGrid, updateElementColor } = gridDataSlice.actions;
export default gridDataSlice.reducer;