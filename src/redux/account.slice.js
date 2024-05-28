import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchAccount = createAsyncThunk(
  "account/fetchAccount",
  async () => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/AccountApi`
      );
      return data;
    } catch (errors) {
      console.log(errors);
    }
  }
);

export const fetchAccountDetails = createAsyncThunk(
  "account/fetchAccountDetails",
  async (id) => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/AccountApi/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createAccount = createAsyncThunk(
  "account/createAccount",
  async (cityData) => {
    try {
      const { data } = await axios.post(
        "https://schoolapi.marwariplus.com/api/AccountApi",
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

export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async (updatedData) => {
    console.log("daan: updateAccount", updatedData);
    try {
      const { data } = await axios.put(
        `https://schoolapi.marwariplus.com/api/AccountApi`,
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

export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async (id) => {
    try {
      const { data } = await axios.delete(
        `https://schoolapi.marwariplus.com/api/AccountApi?id=${id}`,

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

const accountSlice = createSlice({
  name: "account",
  initialState: {
    accounts: [],
    loading: "idle",
    error: null,
    message: "",
    accountDetail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get castCategory
      .addCase(fetchAccount.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.accounts = action.payload;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get castCategory Details

      .addCase(fetchAccountDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAccountDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.accountDetail = action.payload;
      })
      .addCase(fetchAccountDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create castCategory

      .addCase(createAccount.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.states.push(action?.payload?.data);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update castCategory

      .addCase(updateAccount.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(
          (account) => account.id === action?.payload
        );
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(updateAccount.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete castCategory
      .addCase(deleteAccount.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.accounts = state.accounts.filter(
          (account) => account?.id !== action.payload
        );
      })
      .addCase(deleteAccount.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default accountSlice.reducer;
