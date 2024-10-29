import fs from "fs";
import path from "path";
import { CountryAndStateCodeWriter } from "./CountryAndStateCodeWriter.js";
import { processCountries } from "./processCountries/processCountries.js";
import { processStatesCAN } from "./processStatesCAN/processStatesCAN.js";
import { processStatesUSA } from "./processStatesUSA/processStatesUSA.js";
import { createGetAbsolutePath } from "./util/absolutePath.js";

const getAbsolutePath = createGetAbsolutePath(import.meta.url);

const WEB_FRONTEND_DATA_PATH = getAbsolutePath("../web-frontend/src/entities");

const processFns = {
    Countries: processCountries,
    USA: processStatesUSA,
    CAN: processStatesCAN,
};

const codeWriter = new CountryAndStateCodeWriter(
    getAbsolutePath("./countryAndStateCodes.md"),
);

for (const key in processFns) {
    const processFn = processFns[key];
    try {
        console.info(`\nProcessing data for ${key}...`);
        const outputPath = processFn();
        codeWriter.add(key, outputPath);
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

codeWriter.write();
console.info("\nDone.");
