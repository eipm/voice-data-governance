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

const stateDataFiles = {};

// Process states data for USA
try {
    const outputPath = processStatesUSA();
    const fileName = path.basename(outputPath);
    stateDataFiles["USA"] = fileName;
    fs.copyFileSync(outputPath, path.join(WEB_FRONTEND_DATA_PATH, fileName));
} catch (error) {
    console.error("Error processing states data for USA.");
    console.error(error);
}

// Process states data for CAN
try {
    const outputPath = processStatesCAN();
    const fileName = path.basename(outputPath);
    stateDataFiles["CAN"] = fileName;
    fs.copyFileSync(outputPath, path.join(WEB_FRONTEND_DATA_PATH, fileName));
} catch (error) {
    console.error("Error processing states data for CAN.");
    console.error(error);
}

// Process countries data
try {
    const outputPath = processCountries(stateDataFiles);
    const fileName = path.basename(outputPath);
    fs.copyFileSync(outputPath, path.join(WEB_FRONTEND_DATA_PATH, fileName));
} catch (error) {
    console.error("Error processing countries data.");
    console.error(error);
}

console.info("Done.");
