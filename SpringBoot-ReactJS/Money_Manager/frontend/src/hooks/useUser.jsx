import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axiosConfig from "../utils/axiosConfig";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

import { AppContext } from "../context/AppContext";

export const useUser = () => {
  const { user, setUser, clearUser } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      return;
    }

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);

        if (isMounted && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to Fetch the User Info", error);

        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [setUser, clearUser, navigate]);
};
