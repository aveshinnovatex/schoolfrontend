import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchCity = createAsyncThunk("city/fetchCity", async () => {
  const { data } = await axios.get(
    `https://schoolapi.marwariplus.com/api/CityApi`
  );
  return data;
});

export const fetchCityDetails = createAsyncThunk(
  "city/fetchCityDetails",
  async (id) => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/CityApi/${id}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createCity = createAsyncThunk(
  "city/createCity",
  async (cityData) => {
    try {
      const { data } = await axios.post(
        "https://schoolapi.marwariplus.com/api/CityApi",
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

export const updateCity = createAsyncThunk(
  "city/updateCity",
  async (updatedData) => {
    try {
      const { data } = await axios.put(
        `https://schoolapi.marwariplus.com/api/CityApi`,
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

export const deleteCity = createAsyncThunk("city/deleteCity", async (id) => {
  try {
    const { data } = await axios.delete(
      `https://schoolapi.marwariplus.com/api/CityApi?id=${id}`,

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

const citySlice = createSlice({
  name: "city",
  initialState: {
    cities: [],
    loading: "idle",
    error: null,
    message: "",
    cityDetail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get city
      .addCase(fetchCity.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCity.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.cities = action.payload;
      })
      .addCase(fetchCity.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get city Details

      .addCase(fetchCityDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCityDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.cityDetail = action.payload;
      })
      .addCase(fetchCityDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create city

      .addCase(createCity.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createCity.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.states.push(action?.payload?.data);
      })
      .addCase(createCity.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update city

      .addCase(updateCity.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        const index = state.cities.findIndex(
          (city) => city.id === action?.payload?.id
        );
        if (index !== -1) {
          state.states[index] = action.payload;
        }
      })
      .addCase(updateCity.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete city
      .addCase(deleteCity.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.cities = state.cities.filter(
          (city) => city?.id !== action.payload
        );
      })
      .addCase(deleteCity.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default citySlice.reducer;
