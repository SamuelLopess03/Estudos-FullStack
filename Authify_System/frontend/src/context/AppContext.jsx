import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { AppConstants } from "../utils/constants";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = AppConstants.BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      const response = await axios.get(backendUrl + "/profile");

      if (response.status === 200) {
        setUserData(response.data);
      } else {
        toast.error("Unable to Retrieve Profile!");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    }
  };

  const getAuthState = async () => {
    try {
      const response = await axios.get(backendUrl + "/is-authenticated");

      if (response.status === 200 && response.data === true) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const contextValue = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
