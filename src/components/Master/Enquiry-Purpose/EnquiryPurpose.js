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
import {
  createEnquiryPurpose,
  updateEnquiryPurpose,
  fetchEnquiryPurpose,
} from "../../../redux/enquiry.purpose.slice";
import EnquiryPurposeList from "./EnquiryPurposeList";
import classes from "./styles.module.css";

const EnquiryPurpose = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [editValue, setEditValue] = useState({ id: "", name: "" });
  const [updatedValue, setUpdatedValue] = useState({});
  const dispatch = useDispatch();

  const onEditHandler = (editedData) => {
    setEditValue({
      id: editedData?.id,
      name: editedData?.name,
    });
    setUpdatedValue(editedData);
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
          updateEnquiryPurpose({ ...updatedValue, name: data.name })
        ).then(() => {
          dispatch(fetchEnquiryPurpose());
        });
      } else {
        await dispatch(createEnquiryPurpose(data)).then(() => {
          dispatch(fetchEnquiryPurpose());
        });
      }
      reset();
      setEditValue({ id: "", name: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader
            className={classes.customCardHeader}
            classes={{
              title: classes.customSubheader,
              subheader: classes.customTitle,
            }}
            subheader="Add Enquiry Purpose"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.purpose ? true : false}
                  focused={Boolean(editValue?.name)}
                  id="purpose"
                  size="small"
                  label="Enquiry Purpose"
                  variant="outlined"
                  name="purpose"
                  helperText={errors.purpose ? "Field is required!" : ""}
                  {...register("name", { required: true })}
                />
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

      <Grid className={classes.container}>
        <Card>
          <CardHeader
            subheader="Enquiry Purpose"
            title="Enquiry Purpose List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <EnquiryPurposeList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default EnquiryPurpose;
