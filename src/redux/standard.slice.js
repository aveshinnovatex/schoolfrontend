import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../util/configuration";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchAllStanderd = createAsyncThunk(
  "standard/fetchAllStanderd",
  async () => {
    const { data } = await axios.get(
      "https://schoolapi.marwariplus.com/api/StandardApi"
    );
    return data;
  }
);

export const fetchStandardDetails = createAsyncThunk(
  "standard/fetchStandardDetails",
  async (id) => {
    console.log("Fetching details for", id);
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/StandardApi/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Fetching data for", data);

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createStandard = createAsyncThunk(
  "standard/createStandard",
  async (studentData) => {
    try {
      const { data } = await axios.post(
        "https://schoolapi.marwariplus.com/api/StandardApi",
        studentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data?.success) {
        toastSuceess(data?.message);
      }
      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const updateStandard = createAsyncThunk(
  "standard/updateStandard",
  async (updatedData) => {
    try {
      const { data } = await axios.put(
        `https://schoolapi.marwariplus.com/api/StandardApi`,
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

export const deleteStandard = createAsyncThunk(
  "standard/deleteStandard",
  async (deletedData) => {
    try {
      const { data } = await axios.delete(
        `https://schoolapi.marwariplus.com/api/StandardApi?id=${deletedData?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data?.message) {
        toastSuceess(data?.message);
      }

      return deletedData;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const standardSlice = createSlice({
  name: "standard",
  initialState: {
    standards: [],
    loading: "idle",
    error: null,
    message: "",
    standardDetail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get Standard
      .addCase(fetchAllStanderd.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAllStanderd.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.standards = action.payload;
      })
      .addCase(fetchAllStanderd.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get fetch Standard Details

      .addCase(fetchStandardDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchStandardDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.standardDetail = action.payload;
      })
      .addCase(fetchStandardDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Standard

      .addCase(createStandard.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createStandard.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.standards.push(action?.payload?.data);
      })
      .addCase(createStandard.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update Standard

      .addCase(updateStandard.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateStandard.fulfilled, (state, action) => {
        const index = state.standards.findIndex(
          (standard) => standard.id === action?.payload?.id
        );
        if (index !== -1) {
          state.standards[index] = action.payload;
        }
      })
      .addCase(updateStandard.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete Standard
      .addCase(deleteStandard.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteStandard.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.standards = state.standards.filter(
          (standard) => standard?.id !== action.payload
        );
      })
      .addCase(deleteStandard.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default standardSlice.reducer;
