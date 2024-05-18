import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

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

import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import { postData, updateDataById } from "../../redux/http-slice";
import DesigList from "./DesigList";
import classes from "./styles.module.css";
import instance from "../../util/axios/config";

const Designation = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({ id: "", name: "" });
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const onEditHandler = (editedData) => {
    setEditValue({ id: editedData?._id, name: editedData?.name });
    setValue("name", editedData?.name);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { id, name } = editValue;

  const onSubmit = async (data) => {
    try {
      if (id !== "" && name !== "") {
        await dispatch(
          updateDataById({ path: "/designation", id: id, data: name })
        ).unwrap();
      } else {
        // await dispatch(
        //   postData("http://njhtest.marwariplus.com/api/DesignationApi", data, {
        //     headers: {
        //       Authorization:
        //         "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU5NTU1NzcsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjQ0MzQ2IiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzNDYifQ.Am0jfu6dAyuf61zNt-jf1cY96u6VL9HJn-jpj_6jkaQ",
        //     },
        //   })
        // ).unwrap();
        const myPath = "http://njhtest.marwariplus.com/api/DesignationApi";
        const response = await instance.post(`${myPath}`, data, {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU5NjMyODMsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjQ0MzMzIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzMzMifQ.lAMQpNBnv0HKrydZ93hzi2psJ1ciG4GOWAJonGLcWG0",
          },
        });
        console.log("==response==", response);
      }
      reset();
      setEditValue({ id: "", name: "" });
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditValue((prevSate) => ({
      ...prevSate,
      [name]: value,
    }));
    setValue("name", value);
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Designation" title="Designation" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.title ? true : false}
                  id="title"
                  size="small"
                  label="Designation"
                  variant="outlined"
                  name="name"
                  value={editValue?.name || ""}
                  helperText={errors.title ? "Field is required!" : ""}
                  {...register("name", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              className={classes["sub-btn"]}
            >
              Save
            </Button>
          </Box>
        </Card>
      </form>

      <Grid className={classes.container}>
        <Card>
          <CardHeader
            subheader="Designation"
            title="Designation List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <DesigList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default Designation;
