import isPointInPolygon from "@turf/boolean-point-in-polygon";
import {
    getCountryData,
    getHasStateData,
    getStateData,
} from "./geographicBorderData";

export const getCountryAtPoint = async (lon, lat) => {
    lon = fixLon(lon);
    const countriesData = await getCountryData();
    for (let i = 0; i < countriesData.length; i++) {
        const countryData = countriesData[i];
        if (isPointInEntity(lon, lat, countryData.bbox, countryData.geoJson)) {
            const countryWithStatesData =
                await getCountryWithStatesData(countryData);
            return countryWithStatesData;
        }
    }
    return null;
};

export const getStateAtPoint = async (lon, lat, statesData) => {
    lon = fixLon(lon);
    for (let i = 0; i < statesData.length; i++) {
        const stateData = statesData[i];
        if (isPointInEntity(lon, lat, stateData.bbox, stateData.geoJson)) {
            return stateData;
        }
    }
    return null;
};

// Add or subtract 360 until longitude is in [-180, 180]
const fixLon = (lon) => {
    while (lon > 180) {
        lon -= 360;
    }
    while (lon < -180) {
        lon += 360;
    }
    return lon;
};

const isPointInEntity = (lon, lat, bbox, geoJson) => {
    if (!isPointInBbox(lon, lat, bbox)) {
        return false;
    }
    return isPointInPolygon([lon, lat], geoJson);
};

const isPointInBbox = (lon, lat, bbox) => {
    const minLon = bbox[0];
    const minLat = bbox[1];
    const maxLon = bbox[2];
    const maxLat = bbox[3];
    return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
};

const getCountryWithStatesData = async (countryData) => {
    let statesData = null;
    if (getHasStateData(countryData.codeIso3)) {
        statesData = await getStateData(countryData.codeIso3);
    }
    return { ...countryData, statesData };
};
