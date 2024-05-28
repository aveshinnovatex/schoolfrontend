import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAccountGroup,
  fetchAccountGroup,
} from "../../../../redux/account.group.slice";
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
} from "@mui/material";

import Modal from "../../../UI/Modal";
import TableSkeleton from "../../../UI/Skeleton";
import styles from "./Styles.module.css";

const AccountGroupList = ({ onEditHandler }) => {
  const [accountGroup, setAccountGroup] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignmentIdToDelete, setAssignmentIdToDelete] = useState(null);
  const dispatch = useDispatch();
  const { accountGroups, loading } = useSelector((state) => state.accountGroup);

  useEffect(() => {
    dispatch(fetchAccountGroup());
  }, [dispatch]);

  // filter data for edit
  useEffect(() => {
    if (loading === "fulfilled" && accountGroups) {
      setAccountGroup(accountGroups);
    }
  }, [loading]);

  // filter data for edit
  const filterList = (index) => {
    const updatedAcGroup = [...accountGroup];
    updatedAcGroup.splice(index, 1);
    setAccountGroup(updatedAcGroup);
  };

  // delete account group
  const deleteHandler = async (id) => {
    setIsModalOpen(true);
    setAssignmentIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(deleteAccountGroup(assignmentIdToDelete)).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      setIsModalOpen(false);
      console.log(error);
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
              to Group Name
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
      {loading === "fulfilled" ? (
        <TableContainer>
          <Table sx={{ minWidth: 250 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell className={styles["bold-cell"]}>#</TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Name
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Group Under
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accountGroup && accountGroup.length > 0 ? (
                accountGroup.map((row, index) => (
                  <TableRow
                    hover
                    key={row?.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">{row?.name}</TableCell>
                    <TableCell align="left">{row?.groupUnderNavName}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="text"
                        onClick={() => {
                          onEditHandler(row?.id, row);
                          filterList(index);
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
      ) : (
        <TableSkeleton />
      )}
      <Divider />
    </>
  );
};

export default AccountGroupList;
