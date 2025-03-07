// Load large border data asynchronously using lazy import() function

const COUNTRY_DATA_PROMISE = import("./country-borders.json");

export const STATE_DATA_PROMISES = {
    USA: import("./state-borders-usa.json"),
    CAN: import("./state-borders-can.json"),
};

export const getCountries = async () => {
    return (await COUNTRY_DATA_PROMISE).default;
};

export const getHasStateData = (countryCode) => {
    return countryCode in STATE_DATA_PROMISES;
};

export const getStateData = async (countryCode) => {
    if (!(countryCode in STATE_DATA_PROMISES)) {
        throw Error(`Could not find state data for country ${countryCode}`);
    }
    return (await STATE_DATA_PROMISES[countryCode]).default;
};
