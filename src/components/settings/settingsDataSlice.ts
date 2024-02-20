import {createSlice} from "@reduxjs/toolkit";

export const settingsDataSlice = createSlice({
  name: "settings",
  initialState: {
    value:  {}
  },
  reducers: {
    initialize: (state, action) => {
      state.value = action.payload;
    },
  }
})

export const { initialize } = settingsDataSlice.actions;
export default settingsDataSlice.reducer;