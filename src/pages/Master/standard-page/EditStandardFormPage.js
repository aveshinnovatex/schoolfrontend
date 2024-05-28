import React, { useEffect, Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StandardForm from "../../../components/Master/Standard/standardForm";
import { fetchStandardDetails } from "../../../redux/standard.slice";
const EditStandardFormPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { standardDetail, loading } = useSelector((state) => state.standard);
  const [editData, setEditdata] = useState({});
  useEffect(() => {
    dispatch(fetchStandardDetails(id));
  }, [dispatch, id]);
  useEffect(() => {
    if (loading === "fulfilled") {
      setEditdata(standardDetail);
    }
  }, [loading]);

  return (
    <>
      <StandardForm editedData={editData} />
    </>
  );
};

export default EditStandardFormPage;
