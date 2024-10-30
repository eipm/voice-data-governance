export const getStateWord = (countryCode) => {
    if (countryCode === "USA") {
        return "State";
    } else if (countryCode === "CAN") {
        return "Province / Territory";
    } else {
        return "State";
    }
};
