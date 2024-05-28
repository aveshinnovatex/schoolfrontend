import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccount, deleteAccount } from "../../../../redux/account.slice";
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
  Grid,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";

import useHttpErrorHandler from "../../../../hooks/useHttpErrorHandler";
import Modal from "../../../UI/Modal";
import styles from "./Styles.module.css";
const AccountList = () => {
  const { accounts, loading } = useSelector((state) => state.account);
  const [accountGroup, setAccountGroup] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountIdToDelete, setAccountIdToDelete] = useState(null);
  const handleHttpError = useHttpErrorHandler();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  // delete account group
  const deleteHandler = async (id) => {
    setIsModalOpen(true);
    setAccountIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(deleteAccount(accountIdToDelete)).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      handleHttpError(error);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const editHandler = (id) => {
    navigate("/edit-account/" + id);
  };

  return (
    <>
      {isModalOpen && (
        <Modal>
          <div style={{ textAlign: "center" }}>
            <Typography color="error" component="h2" variant="h6">
              Delete Account
            </Typography>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want <br />
              to account name
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
      <Button
        color="primary"
        variant="contained"
        component={Link}
        to="/create-account"
        sx={{ fontWeight: "bold", marginLeft: "auto", mt: 2, mb: 2 }}
        mt={1}
      >
        Add Account
      </Button>
      <Grid className={styles.container}>
        <Card>
          <CardHeader subheader="Account" title="Account List" />
          <Divider />
          <CardContent>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className={styles["bold-cell"]}>#</TableCell>
                    <TableCell align="left" className={styles["bold-cell"]}>
                      Account Name
                    </TableCell>
                    <TableCell align="left" className={styles["bold-cell"]}>
                      Account Group
                    </TableCell>
                    <TableCell align="left" className={styles["bold-cell"]}>
                      Opening Balance
                    </TableCell>
                    <TableCell align="left" className={styles["bold-cell"]}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts && accounts.length > 0 ? (
                    accounts.map((row, index) => (
                      <TableRow
                        hover
                        key={row?.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {index}
                        </TableCell>
                        <TableCell align="left">{row?.name}</TableCell>
                        <TableCell align="left">
                          {row?.accountGroupNav?.name}
                        </TableCell>
                        <TableCell align="center">
                          {row?.openingBalance}
                        </TableCell>
                        <TableCell align="left">
                          <Button
                            variant="text"
                            onClick={() => {
                              editHandler(row?.id);
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
          </CardContent>
          <Divider />
        </Card>
      </Grid>
    </>
  );
};

export default AccountList;
