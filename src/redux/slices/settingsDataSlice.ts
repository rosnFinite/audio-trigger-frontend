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
      console.log("SET_CLIENT_SID", action.payload);
      // when the client sid is set to an empty string, reset the settings state
      if (action.payload.sid === "") {
        state.values = { ...initialSettingsState, sid: "" };
      } else {
        state.values = { ...state.values, sid: action.payload.sid };
      }
    },
  },
});

export const { INITIALIZE, UPDATE_SETTINGS, UPDATE_STATUS, SET_CLIENT_SID } =
  settingsDataSlice.actions;
export default settingsDataSlice.reducer;
