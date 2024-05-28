import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchSession = createAsyncThunk(
  "session/fetchSession",
  async () => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/SessionApi`
      );
      return data;
    } catch (errors) {
      console.log(errors);
    }
  }
);

export const fetchSessionDetails = createAsyncThunk(
  "session/fetchSessionDetails",
  async (id) => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/SessionApi/${id}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createSession = createAsyncThunk(
  "session/createSession",
  async (cityData) => {
    try {
      const { data } = await axios.post(
        "https://schoolapi.marwariplus.com/api/SessionApi",
        cityData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data?.message) {
        toastSuceess(data?.message);
      }
      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const updateSession = createAsyncThunk(
  "session/updateSession",
  async (updatedData) => {
    console.log("daan: ", updatedData);
    try {
      const { data } = await axios.put(
        `https://schoolapi.marwariplus.com/api/SessionApi`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data?.message) {
        toastSuceess(data?.message);
      }

      return updatedData.id;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const deleteSession = createAsyncThunk(
  "session/deleteSession",
  async (id) => {
    try {
      const { data } = await axios.delete(
        `https://schoolapi.marwariplus.com/api/SessionApi?id=${id}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data?.message) {
        toastSuceess(data?.message);
      }

      return id;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    sessions: [],
    loading: "idle",
    error: null,
    message: "",
    sessionDetail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get SessionApi
      .addCase(fetchSession.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.accounts = action.payload;
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get SessionApi Details

      .addCase(fetchSessionDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchSessionDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.sessionsDetail = action.payload;
      })
      .addCase(fetchSessionDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create SessionApi

      .addCase(createSession.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.states.push(action?.payload?.data);
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update SessionApi

      .addCase(updateSession.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(
          (session) => session.id === action?.payload
        );
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(updateSession.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete SessionApi
      .addCase(deleteSession.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.sessions = state.sessions.filter(
          (session) => session?.id !== action.payload
        );
      })
      .addCase(deleteSession.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default sessionSlice.reducer;
