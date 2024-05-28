import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchSection = createAsyncThunk(
  "section/fetchSection",
  async (path = "") => {
    const { data } = await axios.get(
      `https://schoolapi.marwariplus.com/api/DivisionApi?${path}`
    );
    return data;
  }
);

export const fetchSectionDetails = createAsyncThunk(
  "section/fetchSectionDetails",
  async (id) => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/DivisionApi/${id}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createSections = createAsyncThunk(
  "section/createSections",
  async (SectionData) => {
    try {
      const { data } = await axios.post(
        "https://schoolapi.marwariplus.com/api/DivisionApi",
        SectionData,
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

export const updateSections = createAsyncThunk(
  "section/updateSections",
  async (updatedData) => {
    try {
      const { data } = await axios.put(
        `https://schoolapi.marwariplus.com/api/DivisionApi`,
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

export const deleteSections = createAsyncThunk(
  "section/deleteSections",
  async (sectionData) => {
    console.log("deleteSections", sectionData.id);
    console.log("token", localStorage.getItem("token"));
    try {
      const { data } = await axios.delete(
        `https://schoolapi.marwariplus.com/api/DivisionApi?id=${sectionData?.id}`,

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

const sectionSlice = createSlice({
  name: "section",
  initialState: {
    sections: [],
    loading: "idle",
    error: null,
    message: "",
    sectionDetail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get sections
      .addCase(fetchSection.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchSection.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.sections = action.payload;
      })
      .addCase(fetchSection.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get sections Details

      .addCase(fetchSectionDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchSectionDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.sectionDetail = action.payload;
      })
      .addCase(fetchSectionDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create sections

      .addCase(createSections.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createSections.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.sections.push(action?.payload?.data);
      })
      .addCase(createSections.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update sections

      .addCase(updateSections.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateSections.fulfilled, (state, action) => {
        const index = state.sections.findIndex(
          (section) => section.id === action?.payload?.id
        );
        if (index !== -1) {
          state.sections[index] = action.payload;
        }
      })
      .addCase(updateSections.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete sections
      .addCase(deleteSections.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteSections.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.sections = state.sections.filter(
          (section) => section?.id !== action.payload
        );
      })
      .addCase(deleteSections.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default sectionSlice.reducer;
