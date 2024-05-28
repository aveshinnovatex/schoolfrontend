import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createCity, fetchCity } from "../../../redux/city.slice";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from "@mui/material";
import styles from "./CityForm.module.css";
import { useDispatch } from "react-redux";

const CityForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const postSection = async (data) => {
    try {
      await dispatch(createCity(data)).then(() => {
        dispatch(fetchCity());
        navigate("/city-list");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data) => {
    postSection(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.container}
      style={{ minHeight: "85vh" }}
    >
      <Card>
        <CardHeader color="primary" title="Add City" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.city ? true : false}
                size="small"
                id="city"
                label="City Name"
                variant="outlined"
                name="city"
                helperText={errors.city ? "Field is required!" : ""}
                {...register("name", { required: true })}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <div className={styles["submit-btn"]}>
                <button type="submit">Submit</button>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default CityForm;
