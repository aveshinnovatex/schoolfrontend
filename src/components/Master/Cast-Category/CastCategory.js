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
import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import CastCategoryList from "./CastCategoryList";
import classes from "./styles.module.css";
import {
  createCastCategory,
  fetchCastCategory,
  updateCastCategory,
} from "../../../redux/cast.category.slice";
const CastCategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({ id: "", name: "" });
  const [updatedData, setUpdatedData] = useState({});
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const onEditHandler = (editedData) => {
    setEditValue({ id: editedData?.id, name: editedData?.name });
    setValue("name", editedData?.title);
    setUpdatedData(editedData);
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
          updateCastCategory({ ...updatedData, name: data.name })
        ).then(() => {
          dispatch(fetchCastCategory());
        });
      } else {
        await dispatch(createCastCategory(data)).then(() =>
          dispatch(fetchCastCategory())
        );
      }
      reset();
      setEditValue({ id: "", name: "" });
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleChange = (event) => {
    setValue("name", event.target.value);
    setEditValue((prevSate) => ({
      ...prevSate,
      name: event.target.value,
    }));
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Cast Category" title="Cast Category" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.name ? true : false}
                  id="outlined-basic"
                  size="small"
                  label="Cast Category"
                  variant="outlined"
                  name="name"
                  value={editValue?.name || ""}
                  helperText={errors.name ? "Field is required!" : ""}
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
            subheader="Cast Category"
            title="Cast Category List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <CastCategoryList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default CastCategory;
