import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEnquiryPurpose,
  deleteEnquiryPurpose,
} from "../../../redux/enquiry.purpose.slice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import Modal from "../../UI/Modal";
import styles from "./styles.module.css";

const EnquiryPurposeList = ({ onEditHandler }) => {
  const { enquiryPurposes, loading } = useSelector(
    (state) => state.enquiryPurpose
  );
  const [enquiryPurpose, setEnquiryPurpose] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examTypeIdToDelete, setExamTypeIdToDelete] = useState(null);
  const handleHttpError = useHttpErrorHandler();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEnquiryPurpose());
  }, [dispatch]);
  useEffect(() => {
    if (loading === "fulfilled") {
      setEnquiryPurpose(enquiryPurposes);
    }
  }, [loading]);

  // filter data for edit
  const filterList = (index) => {
    const updatedAcGroup = [...enquiryPurpose];
    updatedAcGroup.splice(index, 1);
    setEnquiryPurpose(updatedAcGroup);
  };

  // delete account group
  const deleteHandler = async (id) => {
    setIsModalOpen(true);
    setExamTypeIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(deleteEnquiryPurpose(examTypeIdToDelete)).then(() => {
        dispatch(fetchEnquiryPurpose());
      });
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
              to this
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
      <TableContainer>
        <Table sx={{ minWidth: 250 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell className={styles["bold-cell"]}>#</TableCell>
              <TableCell align="left" className={styles["bold-cell"]}>
                Purpose
              </TableCell>
              <TableCell align="left" className={styles["bold-cell"]}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enquiryPurpose && enquiryPurpose.length > 0 ? (
              enquiryPurpose.map((row, index) => (
                <TableRow
                  hover
                  key={row?.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">{row?.name}</TableCell>
                  <TableCell align="left">
                    <Button
                      variant="text"
                      onClick={() => {
                        onEditHandler(row);
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
      <Divider />
    </>
  );
};

export default EnquiryPurposeList;
