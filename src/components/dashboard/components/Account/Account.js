import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
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
import {
  createAccount,
  fetchAccount,
  fetchAccountDetails,
  updateAccount,
} from "../../../../redux/account.slice";
import { fetchAccountGroup } from "../../../../redux/account.group.slice";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import useHttpErrorHandler from "../../../../hooks/useHttpErrorHandler";
import classes from "./Styles.module.css";

const Account = ({ accountGroupId, method }) => {
  const { accountGroups, loading: accountGroupLoading } = useSelector(
    (state) => state.accountGroup
  );
  const { accountDetail, loading } = useSelector((state) => state.account);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [accountGroup, setAccountGroup] = useState([]);
  const [editValue, setEditValue] = useState({
    id: "",
    name: "",
    openingBalance: null,
    method: method,
  });
  const [selectedAcGroup, setSelectedAcGroup] = useState(null);
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();
  const navigate = useNavigate();

  useEffect(() => {
    if (accountGroupId) {
      dispatch(fetchAccountDetails(accountGroupId));
    }
  }, [accountGroupId]);
  useEffect(() => {
    if (accountGroupId && accountDetail && loading === "fulfilled") {
      console.log("Account Details", accountDetail);
      setValue("openingBalance", accountDetail.openingBalance);
      setEditValue((prev) => ({ ...prev, ...accountDetail }));
      setSelectedAcGroup(accountDetail?.accountGroupNav);
    }
  }, [accountGroupId, accountDetail, loading]);

  useEffect(() => {
    dispatch(fetchAccountGroup());
  }, [dispatch]);

  const { id, name, openingBalance } = editValue;

  useEffect(() => {
    dispatch(fetchAccount()).unwrap();
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      if (selectedAcGroup && data) {
        const accountGroupId = selectedAcGroup.id;
        const accData = {
          name: name,
          accountGroupId: accountGroupId,
          openingBalance: openingBalance,
        };

        if (method === "put") {
          await dispatch(updateAccount({ id: id, ...accData })).unwrap();
        } else {
          const accData = { ...data, accountGroupId: accountGroupId };
          await dispatch(createAccount(accData)).unwrap();
        }
        setEditValue({ id: "", name: "", method: "" });
        navigate("/account");
      } else {
        toast.error("All field are required!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleChange = (event) => {
    setValue(event.target.name, event.target.value);
    setEditValue((prevSate) => ({
      ...prevSate,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAcGroupChange = (event, value) => {
    setSelectedAcGroup(value);
  };

  return (
    <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Add Account" title="Account Name" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                error={errors.accountName ? true : false}
                id="outlined-basic"
                label="Account Name"
                name="accountName"
                variant="outlined"
                value={editValue?.name || ""}
                helperText={errors.accountName ? "Field is required!" : ""}
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
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handleAcGroupChange}
                renderInput={(params) => (
                  <TextField {...params} label="Group Name" />
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
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                error={errors.openingBalance ? true : false}
                id="openingBalance"
                label="Opening Balance"
                name="openingBalance"
                type="number"
                variant="outlined"
                value={editValue?.openingBalance || ""}
                helperText={errors.openingBalance ? "Field is required!" : ""}
                {...register("openingBalance", { required: true })}
                onChange={handleChange}
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
  );
};

export default Account;
