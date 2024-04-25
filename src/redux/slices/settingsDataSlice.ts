import { createSlice } from "@reduxjs/toolkit";
import { initialSettingsState } from "../../utils/stateUtils";

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
      state.values = {
        ...state.values,
        status: action.payload.status,
        save_location: action.payload.save_location,
      };
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
