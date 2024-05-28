import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import SectionList from "./SectionList";
import classes from "./styles.module.css";
import {
  createSections,
  updateSections,
  fetchSection,
} from "../../../redux/section.slice";

const Section = () => {
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
    setEditValue({ id: editedData?.id, name: editedData?.name });
    setValue("name", editedData?.name);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { id, name } = editValue;

  const onSubmit = async (data) => {
    if (editValue.id) {
      try {
        await dispatch(updateSections(editValue))
          .unwrap()
          .then(() => {
            reset();
            setEditValue({ id: "", name: "" });
            dispatch(fetchSection());
          });
      } catch (error) {
        handleHttpError(error);
      }
    } else {
      try {
        await dispatch(createSections(data))
          .unwrap()
          .then(() => {
            reset();
            setEditValue({ id: "", name: "" });
            dispatch(fetchSection());
          });
      } catch (error) {
        handleHttpError(error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditValue((prevSate) => ({ ...prevSate, [name]: value }));
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Section" title="Section" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.section ? true : false}
                  id="outlined-basic"
                  size="small"
                  label="Section name"
                  variant="outlined"
                  name="name"
                  value={editValue?.name || ""}
                  helperText={errors.section ? "Field is required!" : ""}
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
            subheader="Section"
            title="Section List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <SectionList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default Section;
