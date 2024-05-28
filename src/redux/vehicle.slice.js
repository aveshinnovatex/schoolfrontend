import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchVehicle = createAsyncThunk(
  "vehicle/fetchVehicle",
  async () => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/VehicleApi`
      );
      return data;
    } catch (errors) {
      console.log(errors);
    }
  }
);

export const fetchVehicleDetails = createAsyncThunk(
  "vehicle/fetchVehicleDetails",
  async (id) => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/VehicleApi/${id}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createVehicle = createAsyncThunk(
  "vehicle/createVehicle",
  async (cityData) => {
    try {
      const { data } = await axios.post(
        "https://schoolapi.marwariplus.com/api/VehicleApi",
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

export const updateVehicle = createAsyncThunk(
  "vehicle/updateVehicle",
  async (updatedData) => {
    console.log("daan: ", updatedData);
    try {
      const { data } = await axios.put(
        `https://schoolapi.marwariplus.com/api/VehicleApi`,
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

export const deleteVehicle = createAsyncThunk(
  "vehicle/deleteVehicle",
  async (id) => {
    try {
      const { data } = await axios.delete(
        `https://schoolapi.marwariplus.com/api/VehicleApi?id=${id}`,

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

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {
    vehicles: [],
    loading: "idle",
    error: null,
    message: "",
    vehicleDetail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get vehicle
      .addCase(fetchVehicle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchVehicle.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicle.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get vehicle Details

      .addCase(fetchVehicleDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchVehicleDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.sessionsDetail = action.payload;
      })
      .addCase(fetchVehicleDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create vehicle

      .addCase(createVehicle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.states.push(action?.payload?.data);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update SessionApi

      .addCase(updateVehicle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const index = state.vehicles.findIndex(
          (vehicle) => vehicle.id === action?.payload
        );
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
      })
      .addCase(updateVehicle.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete SessionApi
      .addCase(deleteVehicle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.vehicles = state.vehicles.filter(
          (vehicle) => vehicle?.id !== action.payload
        );
      })
      .addCase(deleteVehicle.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default vehicleSlice.reducer;
