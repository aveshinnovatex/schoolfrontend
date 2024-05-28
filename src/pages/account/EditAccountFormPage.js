import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Account from "../../components/dashboard/components/Account/Account";
// import { fetchAccountDetails } from "../../redux/account.slice";
const EditAccountFormPage = () => {
  // const { accountDetail, loading } = useSelector((state) => state.account);

  // const dispatch = useDispatch();
  let { id } = useParams();

  // useEffect(() => {
  //   if (id) {
  //     dispatch(fetchAccountDetails(id));
  //   }
  // }, [id]);
  return (
    // <h1>Hiii</h1>
    id && <Account accountGroupId={id} method="put" />
  );
};

export default EditAccountFormPage;
