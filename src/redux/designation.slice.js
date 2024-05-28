import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchDesignation = createAsyncThunk(
  "designation/fetchDesignation",
  async (path = "") => {
    const { data } = await axios.get(
      `https://schoolapi.marwariplus.com/api/DesignationApi?${path}`
    );
    return data;
  }
);

export const fetchDesignationDetails = createAsyncThunk(
  "designation/fetchDesignationDetails",
  async (id) => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/DesignationApi/${id}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createDesignation = createAsyncThunk(
  "designation/createDesignation",
  async (Data) => {
    try {
      const { designationsData } = await axios.post(
        "https://schoolapi.marwariplus.com/api/DesignationApi",
        designationsData,
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

export const updateDesignation = createAsyncThunk(
  "designation/updateDesignation",
  async (updatedData) => {
    try {
      const { data } = await axios.put(
        `https://schoolapi.marwariplus.com/api/DesignationApi`,
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

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const deleteDesignation = createAsyncThunk(
  "designation/deleteDesignation",
  async (sectionData) => {
    console.log("deleteDesignation", sectionData.id);
    console.log("token", localStorage.getItem("token"));
    try {
      const { data } = await axios.delete(
        `https://schoolapi.marwariplus.com/api/DesignationApi?id=${sectionData?.id}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data?.message) {
        toastSuceess(data?.message);
      }

      return sectionData;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const designationSlice = createSlice({
  name: "designation",
  initialState: {
    designations: [],
    loading: "idle",
    error: null,
    message: "",
    designationDetail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get sections
      .addCase(fetchDesignation.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDesignation.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.designations = action.payload;
      })
      .addCase(fetchDesignation.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get sections Details

      .addCase(fetchDesignationDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDesignationDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.designationDetail = action.payload;
      })
      .addCase(fetchDesignationDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create sections

      .addCase(createDesignation.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createDesignation.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.sections.push(action?.payload?.data);
      })
      .addCase(createDesignation.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update sections

      .addCase(updateDesignation.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        const index = state.designations.findIndex(
          (designation) => designation.id === action?.payload?.id
        );
        if (index !== -1) {
          state.designations[index] = action.payload;
        }
      })
      .addCase(updateDesignation.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete sections
      .addCase(deleteDesignation.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.designations = state.designations.filter(
          (designation) => designation?.id !== action.payload
        );
      })
      .addCase(deleteDesignation.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default designationSlice.reducer;
