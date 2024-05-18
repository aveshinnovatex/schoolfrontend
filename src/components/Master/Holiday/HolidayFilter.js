import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Grid,
  Paper,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Autocomplete,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import dayjs from "dayjs";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import instance from "../../../util/axios/config";
import { authActions } from "../../../redux/auth-slice";
import { fetchData } from "../../../redux/http-slice";
import classes from "./styles.module.css";

const HolidayFilterForm = ({ setSearchQuery }) => {
  const dispatch = useDispatch();

  const initialState = {
    id: "",
    title: "",
    session: null,
    usetType: null,
    section: null,
    standard: null,
    startDate: null,
    endDate: null,
    description: "",
  };
  const [editValue, setEditValue] = useState(initialState);

  const [data, setData] = useState({
    sessions: [],
    userType: [],
    standard: [],
    section: [],
  });

  const [allStandard, setAllStandard] = useState([]);

  const [userType, setUserType] = useState([]);
  const [standard, setStandard] = useState([]);
  const [section, setSection] = useState([]);
  const [session, setSession] = useState(null);

  const [date, setDate] = useState({ startDate: null, endDate: null });

  const { data: desigData, Loading: desigLoading } = useSelector(
    (state) => state.httpRequest
  );

  useEffect(() => {
    setSection([]);
    setData((prevState) => ({ ...prevState, section: [] }));

    const sectionData = standard?.map((stndr) => {
      const matchingItem = allStandard.find((obj) => obj._id === stndr.value);
      return matchingItem ? matchingItem.sections : [];
    });

    const sections = sectionData.flat();
    const uniqueSectionsArray = Array.from(
      new Set(sections.map(JSON.stringify))
    ).map(JSON.parse);

    const allSectionData = uniqueSectionsArray.map((item) => ({
      label: item.section,
      value: item._id,
    }));

    setData((prevState) => ({ ...prevState, section: allSectionData }));
  }, [standard, allStandard]);

  // fetch all sessions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResp = await instance.get("/session/all");

        setData((prevData) => ({
          ...prevData,
          sessions: sessionResp.data.data,
        }));
      } catch (error) {
        if (error?.status === 401 || error?.status === 500) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          // dispatch(authActions.logout());
        } else {
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(
          `/standard/all?search=${JSON.stringify({ session: session?.name })}`
        );

        const standard = response.data.data;
        setAllStandard(standard);
        const allData = standard.map((item) => ({
          label: item.standard,
          value: item._id,
        }));

        setData((prevData) => ({
          ...prevData,
          standard: allData,
        }));
      } catch (error) {
        if (error?.status === 401 || error?.status === 500) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          // dispatch(authActions.logout());
        } else {
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };

    if (session) {
      fetchData();
    }
  }, [dispatch, session]);

  useEffect(() => {
    if (desigLoading === false) {
      const allData = desigData.map((item) => ({
        label: item.title,
        value: item._id,
      }));
      setData((prevData) => ({ ...prevData, userType: allData }));
    }
  }, [dispatch, desigLoading, desigData]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await dispatch(fetchData({ path: "/designation/all" })).unwrap(); // getting userType
      } catch (error) {
        if (error?.status === 401 || error?.status === 500) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          // dispatch(authActions.logout());
        } else {
          console.log(error);
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };
    fetchAllData();
  }, [dispatch]);

  // setting default session year
  const initialSelectedSession = data?.sessions?.find((session) => {
    return session?.active === true;
  });

  useEffect(() => {
    if (initialSelectedSession) {
      setSession(initialSelectedSession);
    }
  }, [initialSelectedSession]);

  const handleChange = (event) => {
    setEditValue((prevSate) => ({
      ...prevSate,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSessionChange = (event, value) => {
    // setSelectedData((prevData) => ({ ...prevData, session: value }));
    setSession(value);
  };

  const getId = (arr = []) => {
    if (arr.length === 0) {
      return null;
    }
    return arr?.map((item) => item?.value);
  };

  // console.log(session);

  useEffect(() => {
    const standardId = getId(standard);
    const sectionId = getId(section);
    const userTypeId = getId(userType);
    const sessionName = session?.name;
    const title = editValue?.title;
    const description = editValue?.description;
    const startDate = date.startDate
      ? dayjs(date.startDate).format("YYYY-MM-DD")
      : "";
    const endDate = date.endDate
      ? dayjs(date.endDate).format("YYYY-MM-DD")
      : "";

    setSearchQuery((prevState) => ({
      ...prevState,
      title: title,
      startDate: startDate,
      endDate: endDate,
      session: sessionName,
      userType: userTypeId,
      section: sectionId,
      standard: standardId,
      description: description,
    }));
  }, [standard, section, userType, session, date, editValue?.title]);

  const handleFilterReset = async () => {
    setEditValue(initialState);
    setDate({ startDate: null, endDate: null });
    setSection([]);
    setStandard([]);
    setSession(null);
    setUserType([]);
  };

  return (
    <div className={classes.container}>
      <Paper style={{ zIndex: 1 }}>
        <CardHeader subheader="Holidays" title="Filter Holiday" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.sessions || []}
                value={session || null}
                getOptionLabel={(sessions) => sessions?.name}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={handleSessionChange}
                renderInput={(params) => (
                  <TextField {...params} label="Session" />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option?.name, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option?.name, matches);

                  return (
                    <li {...props} key={option?._id}>
                      <div>
                        {parts.map((part, index) => (
                          <span
                            key={index}
                            style={{
                              fontWeight: part.highlight ? 700 : 400,
                            }}
                          >
                            {part.text}
                          </span>
                        ))}
                      </div>
                    </li>
                  );
                }}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                size="small"
                className={classes.textField}
                id="outlined-basic"
                label="Holiday Title"
                name="title"
                variant="outlined"
                value={editValue?.title || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12} style={{ zIndex: 99 }}>
              <MultiSelect
                options={data?.userType}
                value={userType}
                onChange={setUserType}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={true}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12} style={{ zIndex: 98 }}>
              <MultiSelect
                options={data?.standard}
                value={standard}
                onChange={setStandard}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12} style={{ zIndex: 97 }}>
              <MultiSelect
                options={data?.section}
                value={section}
                onChange={setSection}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={true}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{ width: "100%" }}
                className={classes.dateInp}
                error={false}
              >
                <DemoContainer
                  components={["DatePicker"]}
                  className={classes.dateInp}
                  sx={{ width: "100%", mt: -1.5 }}
                  error={false}
                >
                  <DemoItem className={classes.dateInp}>
                    <DatePicker
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-input": {
                          height: "9px",
                        },
                      }}
                      value={date.startDate}
                      format="DD/MM/YYYY"
                      onChange={(newValue) =>
                        setDate((prevState) => ({
                          ...prevState,
                          startDate: newValue.format(),
                        }))
                      }
                      label="Start Date"
                      className={classes.dateInp}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{ width: "100%" }}
                className={classes.dateInp}
              >
                <DemoContainer
                  components={["DatePicker"]}
                  className={classes.dateInp}
                  sx={{ width: "100%", mt: -1.5 }}
                >
                  <DemoItem className={classes.dateInp}>
                    <DatePicker
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-input": {
                          height: "9px",
                        },
                      }}
                      format="DD/MM/YYYY"
                      value={date.endDate}
                      onChange={(newValue) =>
                        setDate((prevState) => ({
                          ...prevState,
                          endDate: newValue.format(),
                        }))
                      }
                      label="End Date"
                      className={classes.dateInp}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                size="small"
                className={classes.textField}
                id="outlined-basic2"
                label="Description"
                name="description"
                variant="outlined"
                value={editValue?.description || ""}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            color="secondary"
            type="reset"
            endIcon={<FilterAltIcon />}
            variant="contained"
            onClick={handleFilterReset}
          >
            Reset
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default HolidayFilterForm;
