import isPointInPolygon from "@turf/boolean-point-in-polygon";

// Load country data asynchronously
const dataPromise = import("./country-boundaries-processed.json");

export const getCountryAtPoint = async (lon, lat) => {
    lon = fixLon(lon);
    const countriesData = (await dataPromise).default;
    for (let i = 0; i < countriesData.length; i++) {
        const countryData = countriesData[i];
        if (isPointInCountry(lon, lat, countryData)) {
            return countryData;
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

const isPointInCountry = (lon, lat, countryData) => {
    if (!isPointInBbox(lon, lat, countryData.bbox)) {
        return false;
    }
    return isPointInPolygon([lon, lat], countryData.geoJson);
};

const isPointInBbox = (lon, lat, bbox) => {
    const minLon = bbox[0];
    const minLat = bbox[1];
    const maxLon = bbox[2];
    const maxLat = bbox[3];
    return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
};
