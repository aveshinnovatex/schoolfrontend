import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { fetchCity, deleteCity } from "../../../redux/city.slice";
import { Divider, Grid, Card, CardContent, CardHeader } from "@mui/material";
import styles from "./CityList.module.css";
const CityList = ({ onClick, newData }) => {
  const [updatedData, setUpdatedData] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cities, loading } = useSelector((state) => state.city);
  useEffect(() => {
    setUpdatedData({ ...newData });
  }, [newData]);

  useEffect(() => {
    dispatch(fetchCity());
  }, [dispatch]);

  const deleteHandler = async (id, index) => {
    const proceed = window.confirm("Are you really want to delete?");

    if (proceed) {
      try {
        await dispatch(deleteCity(id));
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
      <div className={styles["container"]}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Link
              to="/city-form"
              style={{ display: "flex", alignItems: "center" }}
            >
              CREATE
            </Link>
          </div>
        </div>
      </div>
      <Grid className={styles.container}>
        <Card>
          <CardHeader subheader="All City list" title="City List" />
          <Divider />
          <CardContent>
            <TableContainer>
              <Table
                size="small"
                sx={{ minWidth: 500 }}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cities &&
                    cities.length > 0 &&
                    cities?.map((data, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={data.id}
                        >
                          <TableCell>{index}</TableCell>
                          <TableCell>{data.name}</TableCell>
                          <TableCell>
                            {/* city delete button */}
                            <IconButton
                              aria-label="delete"
                              onClick={() => deleteHandler(data.id, index)}
                            >
                              <DeleteIcon className={styles["delete-button"]} />
                            </IconButton>
                            {/* city edit button */}
                            <IconButton
                              onClick={() => editHandler(data, index)}
                            >
                              <BorderColorIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default CityList;
