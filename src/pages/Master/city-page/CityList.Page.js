import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CityList from "../../../components/Master/City/CityList";
import Modal from "../../../components/UI/Modal";
import styles from "../../../components/Master/City/CityForm.module.css";
import { updateCity, fetchCity } from "../../../redux/city.slice";
import { toastSuceess, toastError } from "../../../util/react.toastify";
const CityListPage = () => {
  const { cities, loading } = useSelector((state) => state.city);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState({});
  const [newValue, setNewValue] = useState("");
  const [updatedData, setUpdatedData] = useState({});
  const dispatch = useDispatch();

  const postSection = async (data) => {
    try {
      await dispatch(updateCity({ ...updatedData, name: data })).then(() => {
        dispatch(fetchCity());
      });
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    if (loading === "fulfilled") {
      toastSuceess();
      setIsOpen(false);
    }
  }, [loading]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newValue === "") {
      alert("empty");
      return;
    }
    postSection(newValue);
  };

  const openModal = (data) => {
    setValue({ ...data.data });
    setNewValue(data.data.name);
    setUpdatedData(data.data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <Modal onCloseCart={closeModal}>
          <div className={styles["modal-form-container"]}>
            <form onSubmit={handleSubmit}>
              <label className={styles["form-label"]}>City</label>
              <input
                className={styles["form-control"]}
                type="text"
                defaultValue={newValue}
                onChange={(e) => {
                  setNewValue(e.target.value);
                }}
              />
              <button className={styles["submit-button"]} type="submit">
                Submit
              </button>
              <button
                className={styles["cancle-button"]}
                type="button"
                onClick={closeModal}
              >
                Close
              </button>
            </form>
          </div>
        </Modal>
      )}
      <CityList newData={updatedData} onClick={(data) => openModal(data)} />
    </>
  );
};

export default CityListPage;
