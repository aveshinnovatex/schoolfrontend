import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../util/configuration";
import { toastError, toastSuceess } from "../util/react.toastify";
import axios from "axios";
export const fetchAllStudent = createAsyncThunk(
  "student/fetchAllStudent",
  async () => {
    const { data } = await axios.get("/api/about-us");
    return data.data;
  }
);

export const fetchStudentDetails = createAsyncThunk(
  "student/fetchStudentDetails",
  async (id) => {
    try {
      const { data } = await axios.get(`/api/about-us/${id}`);

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createStudent = createAsyncThunk(
  "student/createStudent",
  async (studentData) => {
    console.log("createStudent called", studentData);
    try {
      const { data } = await axios.post(
        "https://schoolapi.marwariplus.com/api/StudentApi",
        studentData,
        {
          headers: {
            token: localStorage.getItem("token"),
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

export const updateAboutUs = createAsyncThunk(
  "student/updateAboutUs",
  async (updateddata) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/about-us/${updateddata.id}`,
        updateddata.aboutUsData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const deleteAboutUs = createAsyncThunk(
  "student/deleteAboutUs",
  async (aboutUsId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/about-us/${aboutUsId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        toastSuceess(data?.message);
      }

      return aboutUsId;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const studentSlice = createSlice({
  name: "student",
  initialState: {
    students: [],
    loading: "idle",
    error: null,
    message: "",
    studentDetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get Student
      .addCase(fetchAllStudent.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAllStudent.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.aboutUs = action.payload;
      })
      .addCase(fetchAllStudent.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get fetch Student Details

      .addCase(fetchStudentDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchStudentDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.studentDetails = action.payload;
      })
      .addCase(fetchStudentDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create students

      .addCase(createStudent.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.students.push(action?.payload?.data);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update experience

      .addCase(updateAboutUs.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateAboutUs.fulfilled, (state, action) => {
        const index = state.aboutUs.findIndex(
          (aboutUs) => aboutUs._id === action?.payload?._id
        );
        if (index !== -1) {
          state.aboutUs[index] = action.payload;
        }
      })
      .addCase(updateAboutUs.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete experience
      .addCase(deleteAboutUs.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteAboutUs.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.aboutUs = state.aboutUs.filter(
          (aboutUs) => aboutUs?._id !== action.payload
        );
      })
      .addCase(deleteAboutUs.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default studentSlice.reducer;
