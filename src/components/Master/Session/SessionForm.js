import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchSession,
  deleteSession,
  updateSession,
  createSession,
} from "../../../redux/session.slice";

import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from "@mui/material";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import classes from "./styles.module.css";

const SessionForm = ({ editedData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [editValue, setEditValue] = useState({
    id: "",
    name: "",
    startDate: null,
    endDate: null,
    active: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();
  const [date, setDate] = useState({ startDate: null, endDate: null });

  useEffect(() => {
    if (editedData) {
      setEditValue({
        id: editedData.id,
        name: editedData?.name,
        startDate: editedData?.startDate,
        endDate: editedData?.endDate,
        active: editedData?.active,
      });

      setValue("name", editedData?.name);
      setDate({
        startDate: editedData?.startDate,
        endDate: editedData?.endDate,
      });
    }
  }, [setValue, editedData]);

  const { id } = editValue;

  const onSubmit = async (data) => {
    try {
      const startDate = date?.startDate
        ? dayjs(date.startDate).format("YYYY-MM-DD")
        : "";

      const endDate = date.endDate
        ? dayjs(date.endDate).format("YYYY-MM-DD")
        : "";

      const formData = {
        ...data,
        // id: id,
        startDate: startDate.match(/[0-9]/g).join(""),
        endDate: endDate.match(/[0-9]/g).join(""),
      };

      if (!date?.startDate && !date?.endDate) {
        toast.error("All fields are required!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });

        return;
      }

      if (editValue?.id !== "") {
        await dispatch(updateSession(formData)).unwrap();
      } else {
        await dispatch(createSession(formData)).unwrap();
      }

      navigate("/session");
    } catch (error) {
      handleHttpError(error);
    }
  };

  return (
    <>
      <form
        className={classes.container}
        onSubmit={handleSubmit(onSubmit)}
        style={{ minHeight: "88vh" }}
      >
        <Card>
          <CardHeader subheader="Add Session" title="Sessions" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={4} sm={6} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.name ? true : false}
                  id="name"
                  label="Name"
                  placeholder="Ex - 1997-1998"
                  variant="outlined"
                  name="name"
                  helperText={errors.name ? "Field is required!" : ""}
                  {...register("name", { required: true })}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                {!editValue?.startDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      sx={{ width: "100%", mt: -1.5 }}
                    >
                      <DemoItem>
                        <DatePicker
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
                )}

                {editValue?.startDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    locale="en"
                    timeZone="Asia/Kolkata"
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      sx={{ width: "100%", mt: -1.5 }}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              startDate: newValue.format(),
                            }))
                          }
                          defaultValue={dayjs(date?.startDate || null)}
                          label="Start Date"
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
              </Grid>

              <Grid item md={3} sm={4} xs={12}>
                {!editValue?.endDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
                    locale="en"
                    timeZone="Asia/Kolkata"
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      className={classes.dateInp}
                      sx={{ width: "100%", mt: -1.5 }}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
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
                )}
                {editValue?.endDate && (
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
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              endDate: newValue.format(),
                            }))
                          }
                          defaultValue={dayjs(date?.endDate || null)}
                          label="End Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button color="primary" type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
};

export default SessionForm;
