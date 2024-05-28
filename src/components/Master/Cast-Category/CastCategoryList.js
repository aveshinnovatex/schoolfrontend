import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import {
  deleteCastCategory,
  fetchCastCategory,
} from "../../../redux/cast.category.slice";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import Modal from "../../UI/Modal";
import styles from "./styles.module.css";
const CastCategoryList = ({ onEditHandler }) => {
  const { castCategories } = useSelector((state) => state.castCategory);
  const [category, setCategory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const handleHttpError = useHttpErrorHandler();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCastCategory());
  }, [dispatch]);

  // filter data for edit
  const filterList = (index) => {
    const updatedcategory = [...category];
    updatedcategory.splice(index, 1);
    setCategory(updatedcategory);
  };

  // delete account group
  const deleteHandler = async (id) => {
    setIsModalOpen(true);
    setCategoryIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(deleteCastCategory(categoryIdToDelete)).unwrap();
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
              to delete this category.
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
                category
              </TableCell>
              <TableCell align="left" className={styles["bold-cell"]}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {castCategories && castCategories.length > 0 ? (
              castCategories.map((row, index) => (
                <TableRow
                  hover
                  key={row?._id}
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

export default CastCategoryList;
