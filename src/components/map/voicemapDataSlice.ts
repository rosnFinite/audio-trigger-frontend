import {createSlice} from "@reduxjs/toolkit";
import { Series } from "../../types/Voicemap.types";

export const voicemapDataSlice = createSlice({
  name: "voicemap",
  initialState: {
    value:  [{}] as Series[]
  },
  reducers: {
    initialize: (state, action) => {
      state.value = action.payload;
    },
  }
})

export const { initialize } = voicemapDataSlice.actions;
export default voicemapDataSlice.reducer;