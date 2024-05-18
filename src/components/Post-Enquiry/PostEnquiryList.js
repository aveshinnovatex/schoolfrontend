import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// import { RotatingLines } from "react-loader-spinner";

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

import { authActions } from "../../redux/auth-slice";
import {
  fetchDataWithPagination,
  deleteDataById,
} from "../../redux/http-slice";
import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import Modal from "../UI/Modal";
import TableSkeleton from "../UI/Skeleton";
import styles from "./styles.module.css";

const PostEnquiryList = ({ searchQuery }) => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [index, setIndex] = useState(1);
  const [allEnquiryData, setAllEnquiryData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IdToDelete, setIdToDelete] = useState(null);

  const handleHttpError = useHttpErrorHandler();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pageData, Loading, response, deletedData, updatedData } = useSelector(
    (state) => state.httpRequest
  );

  useEffect(() => {
    if (!Loading && pageData) {
      setPage({ ...page, totaltems: pageData?.totalData });
      setAllEnquiryData(pageData?.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading, pageData]);

  const path = `/post-enquiry?page=${page.currentPage}&search=${JSON.stringify(
    searchQuery
  )}&perPage=${rowsPerPage}`;

  useEffect(() => {
    const fetchallEnquiryData = async () => {
      try {
        const startIndex = page.currentPage * rowsPerPage + 1;
        setIndex(startIndex);
        await dispatch(fetchDataWithPagination({ path })).unwrap();
      } catch (error) {
        if (error?.status === 401 || error?.status === 500) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          // dispatch(authActions.logout());
        } else {
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };
    fetchallEnquiryData();
  }, [
    dispatch,
    page.currentPage,
    rowsPerPage,
    path,
    response.data,
    deletedData,
    updatedData,
  ]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  // delete account group
  const deleteHandler = async (id) => {
    setIsModalOpen(true);
    setIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(
        deleteDataById({
          path: "/post-enquiry",
          id: IdToDelete,
        })
      ).unwrap();

      // change page no if no document available after delete
      if (allEnquiryData.length === 1 && page?.currentPage !== 0) {
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
      {!Loading ? (
        <TableContainer>
          <Table sx={{ minWidth: 1350 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell className={styles["bold-cell"]}>#</TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Session
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Enquiry Purpose
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Name
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Standard
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Section
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Student Mobile
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Father's Name
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Whatsapp No
                </TableCell>
                <TableCell align="center" className={styles["bold-cell"]}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allEnquiryData && allEnquiryData.length > 0 ? (
                allEnquiryData.map((row, indx) => (
                  <TableRow
                    hover
                    key={row?._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + indx}
                    </TableCell>
                    <TableCell align="left">{row?.session?.name}</TableCell>
                    <TableCell align="left">
                      {row?.enquiryPurpose?.purpose}
                    </TableCell>
                    <TableCell align="left">
                      {row?.firstName +
                        " " +
                        row?.middleName +
                        " " +
                        row?.lastName}
                    </TableCell>
                    <TableCell align="left">
                      {row?.standard?.standard}
                    </TableCell>
                    <TableCell align="left">{row?.section?.section}</TableCell>
                    <TableCell align="left">{row?.stuMobileNo}</TableCell>
                    <TableCell align="left">{row?.fatherName}</TableCell>
                    <TableCell align="left">{row?.whatsappMobileNo}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="text"
                        onClick={() => {
                          navigate("/add-student/" + row?._id);
                        }}
                      >
                        Proceed
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => {
                          navigate("/enquiry/edit-post-enquiry/" + row?._id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => {
                          deleteHandler(row?._id);
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
      {!Loading && (
        <TablePagination
          rowsPerPageOptions={[5, 25, 100]}
          component="div"
          count={page.totaltems || 0}
          rowsPerPage={rowsPerPage}
          page={page.currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
};

export default PostEnquiryList;
