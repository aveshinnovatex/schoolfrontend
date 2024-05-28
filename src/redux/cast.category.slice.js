import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchCastCategory = createAsyncThunk(
  "castCategory/fetchCastCategory",
  async () => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/CastCategoryApi`
      );
      return data;
    } catch (errors) {
      console.log(errors);
    }
  }
);

export const fetchCastCategoryDetails = createAsyncThunk(
  "castCategory/fetchCastCategoryDetails",
  async (id) => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/CastCategoryApi/${id}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createCastCategory = createAsyncThunk(
  "castCategory/createCastCategory",
  async (cityData) => {
    try {
      const { data } = await axios.post(
        "https://schoolapi.marwariplus.com/api/CastCategoryApi",
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

export const updateCastCategory = createAsyncThunk(
  "castCategory/updateCastCategory",
  async (updatedData) => {
    console.log("daan: updateCastCategory", updatedData);
    try {
      const { data } = await axios.put(
        `https://schoolapi.marwariplus.com/api/CastCategoryApi`,
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

export const deleteCastCategory = createAsyncThunk(
  "castCategory/deleteCastCategory",
  async (id) => {
    try {
      const { data } = await axios.delete(
        `https://schoolapi.marwariplus.com/api/CastCategoryApi?id=${id}`,

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

const castCategorySlice = createSlice({
  name: "castCategory",
  initialState: {
    castCategories: [],
    loading: "idle",
    error: null,
    message: "",
    castCategoryDetail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get castCategory
      .addCase(fetchCastCategory.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCastCategory.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.castCategories = action.payload;
      })
      .addCase(fetchCastCategory.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get castCategory Details

      .addCase(fetchCastCategoryDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCastCategoryDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.castCategoryDetail = action.payload;
      })
      .addCase(fetchCastCategoryDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create castCategory

      .addCase(createCastCategory.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createCastCategory.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.states.push(action?.payload?.data);
      })
      .addCase(createCastCategory.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update castCategory

      .addCase(updateCastCategory.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCastCategory.fulfilled, (state, action) => {
        const index = state.castCategories.findIndex(
          (castCategory) => castCategory.id === action?.payload
        );
        if (index !== -1) {
          state.castCategories[index] = action.payload;
        }
      })
      .addCase(updateCastCategory.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete castCategory
      .addCase(deleteCastCategory.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCastCategory.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.castCategories = state.castCategories.filter(
          (castCategory) => castCategory?.id !== action.payload
        );
      })
      .addCase(deleteCastCategory.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default castCategorySlice.reducer;
