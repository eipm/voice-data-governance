import fs from "fs";
import { createGetAbsolutePath } from "../util/absolutePath.js";
import { getBbox } from "../util/getBbox.js";

const getAbsolutePath = createGetAbsolutePath(import.meta.url);

const INPUT_FILE = getAbsolutePath("./us-state-boundaries.json");
const OUTPUT_FILE = getAbsolutePath("../dist/state-borders-usa.json");

export const processStatesUSA = () => {
    const statesDataRaw = JSON.parse(fs.readFileSync(INPUT_FILE));
    const statesData = [];
    for (const stateDataRaw of statesDataRaw) {
        const stateData = {
            name: stateDataRaw.name,
            stateCode: stateDataRaw.stusab,
            geojson: stateDataRaw.st_asgeojson,
            bbox: getBbox(stateDataRaw.st_asgeojson),
            coordLonLat: [
                stateDataRaw.geo_point_2d.lon,
                stateDataRaw.geo_point_2d.lat,
            ],
        };
        statesData.push(stateData);
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(statesData));
    console.info(`USA states data written to ${OUTPUT_FILE}.`);
    return OUTPUT_FILE;
};
