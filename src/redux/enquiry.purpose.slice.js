import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchEnquiryPurpose = createAsyncThunk(
  "enquiryPurpose/fetchEnquiryPurpose",
  async () => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/EnquiryPurposeApi`
      );
      console.log("EnquiryPurpose API", data);
      return data;
    } catch (errors) {
      console.log(errors);
    }
  }
);

export const fetchEnquiryPurposeDetails = createAsyncThunk(
  "enquiryPurpose/fetchEnquiryPurposeDetails",
  async (id) => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/EnquiryPurposeApi/${id}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createEnquiryPurpose = createAsyncThunk(
  "enquiryPurpose/createEnquiryPurpose",
  async (cityData) => {
    try {
      const { data } = await axios.post(
        "https://schoolapi.marwariplus.com/api/EnquiryPurposeApi",
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

export const updateEnquiryPurpose = createAsyncThunk(
  "enquiryPurpose/updateEnquiryPurpose",
  async (updatedData) => {
    console.log("daan: ", updatedData);
    try {
      const { data } = await axios.put(
        `https://schoolapi.marwariplus.com/api/EnquiryPurposeApi`,
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

export const deleteEnquiryPurpose = createAsyncThunk(
  "enquiryPurpose/deleteEnquiryPurpose",
  async (id) => {
    try {
      const { data } = await axios.delete(
        `https://schoolapi.marwariplus.com/api/EnquiryPurposeApi?id=${id}`,

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

const enquiryPurposesSlice = createSlice({
  name: "enquiryPurpose",
  initialState: {
    enquiryPurposes: [],
    loading: "idle",
    error: null,
    message: "",
    enquiryPurposeDetail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get enquiryPurpose
      .addCase(fetchEnquiryPurpose.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchEnquiryPurpose.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.enquiryPurposes = action.payload;
      })
      .addCase(fetchEnquiryPurpose.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get enquiryPurpose Details

      .addCase(fetchEnquiryPurposeDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchEnquiryPurposeDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.enquiryPurposeDetail = action.payload;
      })
      .addCase(fetchEnquiryPurposeDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create enquiryPurpose

      .addCase(createEnquiryPurpose.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createEnquiryPurpose.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.states.push(action?.payload?.data);
      })
      .addCase(createEnquiryPurpose.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update enquiryPurpose

      .addCase(updateEnquiryPurpose.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateEnquiryPurpose.fulfilled, (state, action) => {
        const index = state.enquiryPurposes.findIndex(
          (enquiryPurpose) => enquiryPurpose.id === action?.payload
        );
        if (index !== -1) {
          state.enquiryPurposes[index] = action.payload;
        }
      })
      .addCase(updateEnquiryPurpose.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete enquiryPurpose
      .addCase(deleteEnquiryPurpose.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteEnquiryPurpose.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.enquiryPurposes = state.enquiryPurposes.filter(
          (enquiryPurpose) => enquiryPurpose?.id !== action.payload
        );
      })
      .addCase(deleteEnquiryPurpose.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default enquiryPurposesSlice.reducer;
