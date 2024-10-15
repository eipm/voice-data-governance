import * as turf from "@turf/turf";
import fs from "fs";

const INPUT_FILE = "./world-administrative-boundaries.json";
const OUTPUT_FILE = "./country-boundaries-processed.json";

const main = () => {
    const countriesDataRaw = JSON.parse(fs.readFileSync(INPUT_FILE));
    const countriesData = [];
    for (const countryDataRaw of countriesDataRaw) {
        if (countryDataRaw.iso3 === null) {
            console.info(
                `Skipping "${countryDataRaw.name}" due to null country code.`,
            );
            continue;
        }
        const countryData = {
            name: countryDataRaw.name,
            codeIso3: countryDataRaw.iso3,
            geoJson: countryDataRaw.geo_shape,
            bbox: getCountryBbox(countryDataRaw),
            coordLonLat: [
                countryDataRaw.geo_point_2d.lon,
                countryDataRaw.geo_point_2d.lat,
            ],
        };
        countriesData.push(countryData);
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(countriesData));
    console.info(`Done. Data written to ${OUTPUT_FILE}.`);
};

const getCountryBbox = (countryDataRaw) => {
    const bbox = turf.bbox(countryDataRaw.geo_shape);
    const [minLon, minLat, maxLon, maxLat] = bbox;
    if (minLon === maxLon) {
        throw Error(
            `minLon === maxLon. ${JSON.stringify(countryDataRaw, null, 4)}`,
        );
    }
    if (minLat === maxLat) {
        throw Error(
            `minLat === maxLat. ${JSON.stringify(countryDataRaw, null, 4)}`,
        );
    }
    for (const value of bbox) {
        if (value === null || value === undefined || isNaN(value)) {
            throw Error(
                `bbox value === ${value}. ${JSON.stringify(countryDataRaw, null, 4)}`,
            );
        }
    }
    return bbox;
};

main();
