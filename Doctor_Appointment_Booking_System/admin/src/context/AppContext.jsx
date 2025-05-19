import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currency = "$";

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");

    return (
      dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
    );
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const value = {
    currency,
    calculateAge,
    slotDateFormat,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
