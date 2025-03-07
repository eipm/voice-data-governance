import fs from "fs";
import _ from "lodash";
import { createGetAbsolutePath } from "../util/absolutePath.js";
import { getBbox } from "../util/getBbox.js";

const getAbsolutePath = createGetAbsolutePath(import.meta.url);

const INPUT_FILE = getAbsolutePath("./ne_10m_admin_0_countries.json");
const OUTPUT_FILE = getAbsolutePath("../dist/country-borders.json");

export const processCountries = () => {
    const countriesDataRaw = JSON.parse(fs.readFileSync(INPUT_FILE));
    const countriesData = [];
    for (const geojson of countriesDataRaw.features) {
        const { properties } = geojson;
        const codeIso3 = properties.ADM0_A3;
        const name = properties.NAME_EN;
        if (codeIso3 === null) {
            console.info(`Skipping "${name}" due to null country code.`);
            continue;
        }
        const countryData = {
            name: name,
            codeIso3: codeIso3,
            geojson: _.omit(geojson, "properties"),
            bbox: getBbox(geojson),
            coordLonLat: [properties.LABEL_X, properties.LABEL_Y],
        };
        countriesData.push(countryData);
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(countriesData));
    console.info(`Country data written to ${OUTPUT_FILE}.`);
    return OUTPUT_FILE;
};
