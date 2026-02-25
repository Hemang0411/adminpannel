import { createSlice } from '@reduxjs/toolkit';

const employerSlice = createSlice({
  name: 'employers',
  initialState: {
    pendingData: [], // This array powers the front-end table
  },
  reducers: {
    setPendingData: (state, action) => {
      // Direct assignment ensures React detects the state change for the web page
      state.pendingData = action.payload;
      console.log("%c[Redux] Data successfully synced to front-end state.", "color: #10b981; font-weight: bold;");
    },
    updateEmployerStatus: (state, action) => {
      state.pendingData = state.pendingData.filter(emp => emp._id !== action.payload);
      console.log(`%c[Redux] Item ${action.payload} removed from web page view.`, "color: #f59e0b; font-weight: bold;");
    }
  }
});

export const { setPendingData, updateEmployerStatus } = employerSlice.actions;
export default employerSlice.reducer;