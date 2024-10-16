import fs from "fs";
import { createGetAbsolutePath } from "../util/absolutePath.js";
import { getBbox } from "../util/getBbox.js";

const getAbsolutePath = createGetAbsolutePath(import.meta.url);

const INPUT_FILE = getAbsolutePath("./georef-canada-province@public.json");
const OUTPUT_FILE = getAbsolutePath("../dist/state-borders-can.json");

export const processStatesCAN = () => {
    const statesDataRaw = JSON.parse(fs.readFileSync(INPUT_FILE));
    const statesData = [];
    for (const stateDataRaw of statesDataRaw) {
        if (stateDataRaw.prov_name_en.length !== 1) {
            throw Error(
                `stateDataRaw.prov_name_en.length !== 1. ${stateDataRaw.prov_name_en}`,
            );
        }
        if (stateDataRaw.prov_code.length !== 1) {
            throw Error(
                `stateDataRaw.prov_code.length !== 1. ${stateDataRaw.prov_code}`,
            );
        }
        const stateData = {
            name: stateDataRaw.prov_name_en[0],
            stateCode: stateDataRaw.prov_code[0],
            geoJson: stateDataRaw.geo_shape,
            bbox: getBbox(stateDataRaw.geo_shape),
            coordLonLat: [
                stateDataRaw.geo_point_2d.lon,
                stateDataRaw.geo_point_2d.lat,
            ],
        };
        statesData.push(stateData);
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(statesData));
    console.info(`CAN states data written to ${OUTPUT_FILE}.`);
    return OUTPUT_FILE;
};
