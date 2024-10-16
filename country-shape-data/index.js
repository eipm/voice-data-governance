import fs from "fs";
import path from "path";
import { processCountries } from "./processCountries/processCountries.js";
import { processStatesCAN } from "./processStatesCAN/processStatesCAN.js";
import { processStatesUSA } from "./processStatesUSA/processStatesUSA.js";
import { createGetAbsolutePath } from "./util/absolutePath.js";

const getAbsolutePath = createGetAbsolutePath(import.meta.url);

const WEB_FRONTEND_DATA_PATH = getAbsolutePath(
    "../web-frontend/src/geographicBorders",
);

const processFns = {
    USA: processStatesUSA,
    CAN: processStatesCAN,
    countries: processCountries,
};

for (const key in processFns) {
    const processFn = processFns[key];
    try {
        console.info(`\nProcessing data for ${key}...`);
        const outputPath = processFn();
        const fileName = path.basename(outputPath);
        fs.copyFileSync(
            outputPath,
            path.join(WEB_FRONTEND_DATA_PATH, fileName),
        );
    } catch (error) {
        console.error(`Error processing data for ${key}.`);
        console.error(error);
    }
}

console.info("\nDone.");
