import React, { useState, useEffect } from "react";
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
  Autocomplete,
} from "@mui/material";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import {
  createAccountGroup,
  updateAccountGroup,
  fetchAccountGroup,
} from "../../../../redux/account.group.slice";
import useHttpErrorHandler from "../../../../hooks/useHttpErrorHandler";
import AccountGroupList from "./AccountGroupList";
import classes from "./Styles.module.css";

const AccountGroup = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({
    id: "",
    name: "",
    groupUnder: null,
  });
  const [updateValue, setUpdateValue] = useState({});
  const [accountGroup, setAccountGroup] = useState([]);
  const [selectedAcGroup, setSelectedAcGroup] = useState(null);

  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const { accountGroups, loading } = useSelector((state) => state.accountGroup);

  useEffect(() => {
    if (loading === "fulfilled" && accountGroups) {
      setAccountGroup(accountGroups);
    }
  }, [dispatch]);

  const onEditHandler = (id, editedData) => {
    setEditValue({ id: id, name: editedData?.name });
    setSelectedAcGroup((prev) => ({
      ...prev,
      name: editedData?.groupUnderNavName,
    }));
    setValue("name", editedData?.name);
    setUpdateValue(editedData);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    try {
      dispatch(fetchAccountGroup());
    } catch (error) {
      handleHttpError(error);
    }
  }, [dispatch]);

  const { id, name } = editValue;

  const onSubmit = async (data) => {
    try {
      const formData = {
        name: name ?? data.name,
        groupUnder: selectedAcGroup?.id ?? updateValue.groupUnder,
      };

      if (id !== "" && name !== "") {
        await dispatch(
          updateAccountGroup({ ...updateValue, ...formData })
        ).then(() => {
          dispatch(fetchAccountGroup());
        });
      } else {
        await dispatch(createAccountGroup(formData)).then(() => {
          dispatch(fetchAccountGroup());
        });
      }
      reset();
      setEditValue({ id: "", name: "" });
      setSelectedAcGroup(null);
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleChange = (event) => {
    setValue("name", event.target.value);
    setEditValue((prevSate) => ({ ...prevSate, name: event.target.value }));
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Account Group" title="Account Group" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.name ? true : false}
                  id="outlined-basic"
                  label="Group Name"
                  variant="outlined"
                  name="name"
                  value={editValue?.name || ""}
                  helperText={errors.name ? "Field is required!" : ""}
                  {...register("name", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <Autocomplete
                  id="highlights-demo"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={accountGroups || []}
                  value={selectedAcGroup || null}
                  getOptionLabel={(accountGroup) => accountGroup?.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(event, value) => {
                    setSelectedAcGroup(value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Group Under" />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option.name, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option.name, matches);

                    return (
                      <li {...props} key={option._id}>
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
            subheader="Account Groups"
            title="Account Group List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <AccountGroupList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default AccountGroup;
