import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobData: [],
  },
  reducers: {
    setJobData: (state, action) => {
      state.jobData = action.payload;
    },
    updateJobStatus: (state, action) => {
      const { jobId, status } = action.payload;
      const job = state.jobData.find((j) => j._id === jobId || j.job_id === jobId);
      if (job) {
        job.status = status; 
      }
    },
  },
});

export const { setJobData, updateJobStatus } = jobSlice.actions;
export default jobSlice.reducer;
