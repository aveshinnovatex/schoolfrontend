import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchSession,
  deleteSession,
  updateSession,
  createSession,
} from "../../../redux/session.slice";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Button,
  TablePagination,
  Divider,
  Typography,
  Chip,
  Grid,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import Modal from "../../UI/Modal";
import styles from "./styles.module.css";

const SessionList = () => {
  const { sessions, loading } = useSelector((state) => state.session);
  const [sessionData, setSessionData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
  const [dataToActive, setDataToActive] = useState();
  const [assignmentIdToDelete, setAssignmentIdToDelete] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  useEffect(() => {
    dispatch(fetchSession());
  }, [dispatch]);

  // delete account group
  const deleteHandler = async (id) => {
    setIsModalOpen(true);
    setAssignmentIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(deleteSession(assignmentIdToDelete)).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error || "Something went wrong", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmActiveHandler = async () => {
    try {
      const formData = {
        ...dataToActive,
        active: true,
      };

      await dispatch(
        updateSession({
          id: dataToActive?.id,
          data: formData,
        })
      ).unwrap();

      setIsActiveModalOpen(false);
    } catch (error) {
      handleHttpError(error);
    }
  };

  const closeActiveModal = () => {
    setIsActiveModalOpen(false);
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
              to this session
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

      {isActiveModalOpen && (
        <Modal>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want <br />
              active this session
            </p>
            <Button
              color="success"
              sx={{ marginRight: 1 }}
              variant="contained"
              onClick={handleConfirmActiveHandler}
            >
              Active
            </Button>
            <Button
              color="warning"
              variant="contained"
              type="button"
              onClick={closeActiveModal}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}

      <div className={styles.container}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/session-form"
              sx={{ fontWeight: "bold", marginLeft: "auto" }}
            >
              Add Session
            </Button>
          </div>
        </div>
      </div>

      <Grid className={styles.container} style={{ minHeight: "88vh" }}>
        <Card>
          <CardHeader subheader="Session List" title="Session" />
          <Divider />
          <CardContent>
            <TableContainer>
              <Table sx={{ minWidth: 250 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className={styles["bold-cell"]}>#</TableCell>
                    <TableCell align="left" className={styles["bold-cell"]}>
                      Session
                    </TableCell>
                    <TableCell align="left" className={styles["bold-cell"]}>
                      Is Current Session
                    </TableCell>
                    <TableCell align="left" className={styles["bold-cell"]}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions && sessions.length > 0 ? (
                    sessions?.map((row, index) => (
                      <TableRow
                        key={row?.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell scope="row">{index + 1}</TableCell>
                        <TableCell align="left">{row?.name}</TableCell>
                        <TableCell align="left">
                          {row?.active ? (
                            <Chip
                              label="Yes"
                              style={{
                                backgroundColor: "#4caf50",
                                color: "white",
                              }}
                              size="small"
                            />
                          ) : (
                            <Chip
                              label="No"
                              onClick={() => {
                                setIsActiveModalOpen(true);
                                setDataToActive(row);
                              }}
                              style={{
                                backgroundColor: "#f44336",
                                color: "white",
                              }}
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell align="left">
                          <Button
                            variant="text"
                            onClick={() => {
                              navigate("/edit-session/" + row.id);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="text"
                            onClick={() => {
                              deleteHandler(row?.id);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default SessionList;
