import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { createStandard } from "../../../redux/standard.slice";
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

import styles from "./StandardForm.module.css";
import {
  updateStandard,
  fetchAllStanderd,
} from "../../../redux/standard.slice";

const StandardForm = ({ editedData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [editValue, setEditValue] = useState({
    id: "",
    name: null,
    division: null,
  });

  useEffect(() => {
    if (editedData) {
      setEditValue((prevState) => ({ ...prevState, id: editedData?.id }));
      setValue("name", editedData?.name);
      setValue("division", editedData?.division);
    }
  }, [editedData, setValue]);

  const onSubmit = async (data) => {
    const divisionArray = data?.division?.split(",");
    const divisionMap = divisionArray.map((division) => {
      return {
        name: division,
      };
    });
    console.log("division array", divisionMap);
    const formData = {
      name: data.name,
      division: divisionMap,
    };
    try {
      if (editValue?.id !== "") {
        const editData = {
          id: editValue?.id,
          data: formData,
        };
        await dispatch(updateStandard(editData))
          .unwrap()
          .then(() => {
            fetchAllStanderd();
          });
      } else {
        await dispatch(createStandard(formData))
          .unwrap()
          .then(() => {
            fetchAllStanderd();
          });
      }
      setEditValue({ id: "", section: "" });
      navigate("/standard-list");
    } catch (error) {}
  };

  // const handleDivisionChange = (event, value) => {
  //   setSelectedOptions(value);
  // };

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Standard" title="Standard" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={styles.textField}
                  error={errors.standard ? true : false}
                  id="outlined-basic"
                  size="small"
                  label="Standard"
                  variant="outlined"
                  helperText={errors.standard ? "Field is required!" : ""}
                  {...register("name", { required: true })}
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={styles.textField}
                  error={errors.standard ? true : false}
                  id="outlined-basic"
                  size="small"
                  label="Division"
                  variant="outlined"
                  helperText={errors.standard ? "Field is required!" : ""}
                  {...register("division", { required: true })}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
            className={styles["submit-button"]}
          >
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
};

export default StandardForm;
