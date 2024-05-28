import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Divider, Grid, Card, CardContent, CardHeader } from "@mui/material";
import styles from "./StateList.module.css";
import { fetchState, deleteState } from "../../redux/state.slice";
const StateList = ({ onClick, newData }) => {
  const { states, loading } = useSelector((state) => state.state);
  const [updatedData, setUpdatedData] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    setUpdatedData({ ...newData });
  }, [newData]);

  useEffect(() => {
    dispatch(fetchState());
  }, [dispatch]);

  const deleteHandler = async (id, index) => {
    const proceed = window.confirm("Are you really want to delete?");

    if (proceed) {
      try {
        await dispatch(deleteState(id))
          .unwrap()
          .then(() => {
            dispatch(fetchState());
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editHandler = (data, index) => {
    onClick({ data: data, index: index });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Link
              to="/state-form"
              style={{ display: "flex", alignItems: "center" }}
            >
              CREATE
            </Link>
          </div>
        </div>
      </div>
      <Grid className={styles.container}>
        <Card>
          <CardHeader subheader="All States list" title="States List" />
          <Divider />
          <CardContent>
            <TableContainer>
              <Table
                sx={{ minWidth: 500 }}
                aria-label="sticky table"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {states && states?.length > 0 ? (
                    states?.map((data, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={data?._id}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{data?.name}</TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="delete"
                              onClick={() => deleteHandler(data?.id, index)}
                            >
                              <DeleteIcon className={styles["delete-button"]} />
                            </IconButton>
                            <IconButton
                              onClick={() => editHandler(data, index)}
                            >
                              <BorderColorIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <Divider />
        </Card>
      </Grid>
    </>
  );
};

export default StateList;
