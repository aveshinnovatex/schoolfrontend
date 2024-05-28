import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

/** old slice start from here */
import encryptionTransformer from "./cryptoJs";
import authReducer from "./auth-slice";
import passwordReducer from "./password-slice";
import uiReducer from "./ui-slice";
import httpReducer from "./http-slice";
import assignmentReducer from "./assignment-slice";
/** old slice end from here */
/** new slice start from here */
import authSlice from "./auth.slice";
import studentSlice from "./student.slice";
import standardSlice from "./standard.slice";
import sectionSlice from "./section.slice";
import designationSlice from "./designation.slice";
import stateSlice from "./state.slice";
import citySlice from "./city.slice";
import castCategorySlice from "./cast.category.slice";
import accountSlice from "./account.slice";
import accountGroupSlice from "./account.group.slice";
import sessionSlice from "./session.slice";
import enquiryPurposesSlice from "./enquiry.purpose.slice";
const reducers = combineReducers({
  /** old slice start from here */
  auth: authReducer,
  passwordChange: passwordReducer,
  ui: uiReducer,
  assignment: assignmentReducer,
  httpRequest: httpReducer,
  /** old slice end from here */
  /** new  slice start from here */
  auth: authSlice,
  student: studentSlice,
  standard: standardSlice,
  section: sectionSlice,
  designation: designationSlice,
  state: stateSlice,
  city: citySlice,
  castCategory: castCategorySlice,
  account: accountSlice,
  accountGroup: accountGroupSlice,
  session: sessionSlice,
  enquiryPurpose: enquiryPurposesSlice,
});

const persistConfig = {
  key: "root",
  storage,
  transforms: [encryptionTransformer],
  whitelist: ["auth"],
  onRehydrate: () => {
    localStorage.removeItem("persist:root");
    PURGE();
  },
  blacklist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// const store = configureStore({
//   reducer: { auth: authReducer },
// });

const persistor = persistStore(store);
export { store, persistor };
