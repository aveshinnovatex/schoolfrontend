import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createState } from "../../redux/state.slice";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from "@mui/material";

import styles from "./StateForm.module.css";
import { useDispatch } from "react-redux";

const StateForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const postState = async (data) => {
    try {
      dispatch(createState(data));
      navigate("/state-list");
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (data) => {
    postState(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.container}
        style={{ minHeight: "85vh" }}
      >
        <Card>
          <CardHeader color="primary" title="Add State" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={6} xs={12}>
                <TextField
                  className={styles.textField}
                  error={errors.name ? true : false}
                  size="small"
                  id="outlined-basic"
                  label="State Name"
                  variant="outlined"
                  name="name"
                  helperText={errors.name ? "Field is required!" : ""}
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
    </>
  );
};

export default StateForm;
