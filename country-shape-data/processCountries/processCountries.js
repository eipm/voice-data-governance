import fs from "fs";
import { createGetAbsolutePath } from "../util/absolutePath.js";
import { getBbox } from "../util/getBbox.js";

const getAbsolutePath = createGetAbsolutePath(import.meta.url);

const INPUT_FILE = getAbsolutePath("./world-administrative-boundaries.json");
const OUTPUT_FILE = getAbsolutePath("../dist/country-borders.json");

export const processCountries = () => {
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
            geojson: countryDataRaw.geo_shape,
            bbox: getBbox(countryDataRaw.geo_shape),
            coordLonLat: [
                countryDataRaw.geo_point_2d.lon,
                countryDataRaw.geo_point_2d.lat,
            ],
        };
        countriesData.push(countryData);
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(countriesData));
    console.info(`Country data written to ${OUTPUT_FILE}.`);
    return OUTPUT_FILE;
};
