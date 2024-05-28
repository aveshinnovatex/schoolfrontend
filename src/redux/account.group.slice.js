import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchAccountGroup = createAsyncThunk(
  "accountGroup/fetchAccountGroup",
  async () => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/AccountGroupApi`
      );
      return data;
    } catch (errors) {
      console.log(errors);
    }
  }
);

export const fetchAccountGroupDetails = createAsyncThunk(
  "accountGroup/fetchAccountGroupDetails",
  async (id) => {
    try {
      const { data } = await axios.get(
        `https://schoolapi.marwariplus.com/api/AccountGroupApi/${id}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createAccountGroup = createAsyncThunk(
  "accountGroup/createAccountGroup",
  async (cityData) => {
    try {
      const { data } = await axios.post(
        "https://schoolapi.marwariplus.com/api/AccountGroupApi",
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

export const updateAccountGroup = createAsyncThunk(
  "accountGroup/updateAccountGroup",
  async (updatedData) => {
    try {
      const { data } = await axios.put(
        `https://schoolapi.marwariplus.com/api/AccountGroupApi`,
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

export const deleteAccountGroup = createAsyncThunk(
  "accountGroup/deleteAccountGroup",
  async (id) => {
    try {
      const { data } = await axios.delete(
        `https://schoolapi.marwariplus.com/api/AccountGroupApi?id=${id}`,

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

const accountGroupSlice = createSlice({
  name: "accountGroup",
  initialState: {
    accountGroups: [],
    loading: "idle",
    error: null,
    message: "",
    accountGroupsDetail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get castCategory
      .addCase(fetchAccountGroup.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAccountGroup.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.accountGroups = action.payload;
      })
      .addCase(fetchAccountGroup.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get castCategory Details

      .addCase(fetchAccountGroupDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAccountGroupDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.accountGroupsDetail = action.payload;
      })
      .addCase(fetchAccountGroupDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create castCategory

      .addCase(createAccountGroup.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createAccountGroup.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.accountGroups.push(action?.payload?.data);
      })
      .addCase(createAccountGroup.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update castCategory

      .addCase(updateAccountGroup.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateAccountGroup.fulfilled, (state, action) => {
        const index = state.accountGroups.findIndex(
          (accountGroup) => accountGroup.id === action?.payload.id
        );
        if (index !== -1) {
          state.accountGroups[index] = action.payload;
        }
      })
      .addCase(updateAccountGroup.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete castCategory
      .addCase(deleteAccountGroup.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteAccountGroup.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.accountGroups = state.accountGroups.filter(
          (accountGroup) => accountGroup?.id !== action.payload
        );
      })
      .addCase(deleteAccountGroup.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default accountGroupSlice.reducer;
