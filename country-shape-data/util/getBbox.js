import * as turf from "@turf/turf";

export const getBbox = (geojson) => {
    const bbox = turf.bbox(geojson);
    const [minLon, minLat, maxLon, maxLat] = bbox;
    if (minLon === maxLon) {
        throw Error(`minLon === maxLon`);
    }
    if (minLat === maxLat) {
        throw Error(`minLat === maxLat`);
    }
    for (const value of bbox) {
        if (value === null || value === undefined || isNaN(value)) {
            throw Error(`bbox value === ${value}`);
        }
    }
    return bbox;
};
