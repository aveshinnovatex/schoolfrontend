import { toast } from "react-toastify";

export const toastError = (message) => {
  toast.error(message, {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 2000,
    hideProgressBar: true,
    theme: "colored",
  });
};

export const toastSuceess = (message) => {
  toast.success(message, {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 2000,
    hideProgressBar: true,
    theme: "colored",
  });
};
