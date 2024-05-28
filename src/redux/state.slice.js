import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchState = createAsyncThunk("state/fetchState", async () => {
  try {
    const { data } = await axios.get(
      `https://schoolapi.marwariplus.com/api/StateApi`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const fetchStateDetails = createAsyncThunk(
  "state/fetchStateDetails",
  async (id) => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/StateApi/${id}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createState = createAsyncThunk(
  "state/createState",
  async (Data) => {
    try {
      const { data } = await axios.post(
        "https://schoolapi.marwariplus.com/api/StateApi",
        Data,
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

export const updateState = createAsyncThunk(
  "state/updateState",
  async (updatedData) => {
    try {
      const { data } = await axios.put(
        `https://schoolapi.marwariplus.com/api/StateApi`,
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

export const deleteState = createAsyncThunk("state/deleteState", async (id) => {
  try {
    const { data } = await axios.delete(
      `https://schoolapi.marwariplus.com/api/StateApi?id=${id}`,

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
});

const stateSlice = createSlice({
  name: "state",
  initialState: {
    states: [],
    loading: "idle",
    error: null,
    message: "",
    stateDetail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get State
      .addCase(fetchState.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchState.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.states = action.payload;
      })
      .addCase(fetchState.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get  State

      .addCase(fetchStateDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchStateDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.stateDetail = action.payload;
      })
      .addCase(fetchStateDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create State

      .addCase(createState.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createState.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.states.push(action?.payload?.data);
      })
      .addCase(createState.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update State

      .addCase(updateState.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateState.fulfilled, (state, action) => {
        const index = state.states.findIndex(
          (state) => state.id === action?.payload
        );
        if (index !== -1) {
          state.states[index] = action.payload;
        }
      })
      .addCase(updateState.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete State
      .addCase(deleteState.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteState.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.states = state.states.filter(
          (state) => state?.id !== action.payload
        );
      })
      .addCase(deleteState.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default stateSlice.reducer;
