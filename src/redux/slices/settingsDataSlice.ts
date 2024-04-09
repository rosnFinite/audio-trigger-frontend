import { createSlice } from "@reduxjs/toolkit";
import { initialSettingsState } from "../../utils/initialStates";

export const settingsDataSlice = createSlice({
  name: "settings",
  initialState: {
    values: initialSettingsState as SettingsState,
  },
  reducers: {
    INITIALIZE: (state) => {
      state.values = { ...initialSettingsState };
    },
    UPDATE_SETTINGS: (state, action) => {
      action.payload.sid = state.values.sid;
      state.values = { ...state.values, ...action.payload };
    },
    UPDATE_STATUS: (state, action) => {
      state.values.status = { ...state.values.status, ...action.payload };
    },
    SET_CLIENT_SID: (state, action) => {
      state.values = { ...initialSettingsState };
      console.log("SET_CLIENT_SID", action.payload);
      state.values.sid = action.payload.sid;
    },
  },
});

export const { INITIALIZE, UPDATE_SETTINGS, UPDATE_STATUS, SET_CLIENT_SID } =
  settingsDataSlice.actions;
export default settingsDataSlice.reducer;
