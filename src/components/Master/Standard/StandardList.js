import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import styles from "./StandardList.module.css";
import Modal from "../../UI/Modal";
import TableSkeleton from "../../UI/Skeleton";
import {
  fetchAllStanderd,
  deleteStandard,
} from "../../../redux/standard.slice";

const StandardList = ({ newData }) => {
  const { standards: standardData, loading } = useSelector(
    (state) => state.standard
  );
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  //   const [searchQuery, setSearchQuery] = useState("");
  const [index, setIndex] = useState(1);
  const [standard, setStandard] = useState([]);
  const [updatedData, setUpdatedData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [standardIdToDelete, setStandardIdToDelete] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleHttpError = useHttpErrorHandler();

  useEffect(() => {
    setUpdatedData({ ...newData });
  }, [newData]);
  // const path = `/standard?page=${page.currentPage}&perPage=${rowsPerPage}`;
  useEffect(() => {
    dispatch(fetchAllStanderd());
  }, [dispatch]);
  useEffect(() => {
    if (loading === "fulfilled") {
      setStandard(standardData);
    }
  }, [loading]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  // delete account group
  const deleteHandler = async (data) => {
    setIsModalOpen(true);
    setStandardIdToDelete(data);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(deleteStandard(standardIdToDelete))
        .unwrap()
        .then(() => {
          dispatch(fetchAllStanderd());
        });

      if (standard.length === 1 && page?.currentPage !== 0) {
        setPage((prevState) => ({
          ...prevState,
          currentPage: page?.currentPage - 1,
        }));
      }

      setIsModalOpen(false);
    } catch (error) {
      setIsModalOpen(false);
      handleHttpError(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <Modal>
          <div style={{ textAlign: "center" }}>
            <Typography color="error" component="h2" variant="h6">
              Delete!
            </Typography>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want <br />
              to Section
            </p>
            <button
              className={styles["submit-btn"]}
              onClick={handleConfirmDeleteHandler}
            >
              Delete
            </button>
            <button
              className={styles["cancle-button"]}
              type="button"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
      <div style={{ width: "100%" }}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Link
              to="/standard-form"
              style={{ display: "flex", alignItems: "center" }}
            >
              CREATE
            </Link>
          </div>
        </div>
      </div>
      <Grid className={styles.container}>
        <Card>
          <CardHeader
            subheader="Standard section map"
            title="Standard List"
            className={styles.customCardHeader}
            classes={{
              subheader: styles.customSubheader,
              title: styles.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            {loading === "fulfilled" ? (
              <TableContainer>
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{ minWidth: 690 }}
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Standard
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Section</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {standard && standard?.length > 0 ? (
                      standard?.map((data, idx) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={data?.id}
                          >
                            <TableCell>{index + idx}</TableCell>
                            <TableCell>{data?.name}</TableCell>
                            <TableCell>{data?.division}</TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="delete"
                                onClick={() => deleteHandler(data, idx)}
                              >
                                <DeleteIcon
                                  className={styles["delete-button"]}
                                />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  navigate("/edit/standard-data/" + data.id);
                                }}
                              >
                                <BorderColorIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableSkeleton />
            )}
          </CardContent>
          {loading === "fulfilled" && (
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              component="div"
              count={page.totaltems || 0}
              rowsPerPage={rowsPerPage}
              page={page.currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Card>
      </Grid>
    </>
  );
};

export default StandardList;
