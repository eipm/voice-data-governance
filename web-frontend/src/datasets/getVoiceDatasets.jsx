import { getHasStateData } from "../entities/entityData";
import { getCountryFromCode, getStateFromCode } from "./getEntityFromCode";
import voiceDatasetsCsv from "./voice-datasets-repository.csv";

const ALPHABET = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];

const CATEGORIES = {
    INSTITUTIONAL_INFORMATION: "Institutional Information",
    VOICE_DATASET_INFORMATION: "Voice Dataset Information",
    ACCESSIBILITY: "Accessibility",
    DEMOGRAPHIC_INFORMATION: "Demographic Information",
    TECHNICAL_INFORMATION: "Technical Information",
};

export const COUNTRY_CODE_COLUMN_NAME = "Country Code";
export const STATE_CODE_COLUMN_NAME = "State Code";

const COUNTRY_CODE_COLUMN = "C";
const COUNTRY_CODE_COLUMN_INDEX = ALPHABET.indexOf(COUNTRY_CODE_COLUMN);
const STATE_CODE_COLUMN = "D";
const STATE_CODE_COLUMN_INDEX = ALPHABET.indexOf(STATE_CODE_COLUMN);

const COLUMNS = [
    {
        name: "Name of Dataset",
        column: "A",
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
    },
    {
        name: "Institution",
        column: "F",
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
    },
    {
        name: "Country",
        column: COUNTRY_CODE_COLUMN,
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
        transform: (countryCode) =>
            getCountryFromCode(countryCode)?.name ?? null,
    },
    {
        name: COUNTRY_CODE_COLUMN_NAME,
        column: COUNTRY_CODE_COLUMN,
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
    },
    {
        name: "State",
        columns: [COUNTRY_CODE_COLUMN, STATE_CODE_COLUMN],
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
        transform: ([countryCode, stateCode]) =>
            getStateFromCode(countryCode, stateCode)?.name ?? null,
        hide: (value) => !value,
    },
    {
        name: STATE_CODE_COLUMN_NAME,
        column: STATE_CODE_COLUMN,
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
        hide: (value) => !value,
    },
    {
        name: "Source",
        column: "G",
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
    },
    {
        name: "Source URL",
        column: "H",
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
        transform: (sourceUrl) => {
            if (!sourceUrl) {
                return null;
            }
            return (
                <a href={sourceUrl} target="_" rel="noreferrer">
                    {sourceUrl}
                </a>
            );
        },
    },
    {
        name: "Number of Participants",
        column: "I",
        category: CATEGORIES.VOICE_DATASET_INFORMATION,
    },
    {
        name: "Number of Samples",
        column: "J",
        category: CATEGORIES.VOICE_DATASET_INFORMATION,
    },
    {
        name: "Disease Category",
        column: "K",
        category: CATEGORIES.VOICE_DATASET_INFORMATION,
    },
    {
        name: "Diagnoses Represented",
        column: "K",
        category: CATEGORIES.VOICE_DATASET_INFORMATION,
    },
    {
        name: "Speech Tasks",
        column: "M",
        category: CATEGORIES.VOICE_DATASET_INFORMATION,
    },
    {
        name: "Language",
        column: "N",
        category: CATEGORIES.VOICE_DATASET_INFORMATION,
    },
    {
        name: "Speaker Details",
        column: "O",
        category: CATEGORIES.VOICE_DATASET_INFORMATION,
    },
    {
        name: "Type of Health Data Collected",
        column: "P",
        category: CATEGORIES.VOICE_DATASET_INFORMATION,
    },
    {
        name: "Dataset Description",
        column: "B",
        category: CATEGORIES.VOICE_DATASET_INFORMATION,
    },
    {
        name: "Access Status",
        column: "Q",
        category: CATEGORIES.ACCESSIBILITY,
    },
    {
        name: "Accessibility",
        column: "R",
        category: CATEGORIES.ACCESSIBILITY,
    },
    {
        name: "Access Instructions",
        column: "S",
        category: CATEGORIES.ACCESSIBILITY,
    },
    {
        name: "License Type",
        column: "T",
        category: CATEGORIES.ACCESSIBILITY,
    },
    {
        name: "Types of Demographic Data",
        column: "U",
        category: CATEGORIES.DEMOGRAPHIC_INFORMATION,
    },
    {
        name: "Recording Environment Described?",
        column: "W",
        category: CATEGORIES.TECHNICAL_INFORMATION,
    },
    {
        name: "Microphone Type",
        column: "V",
        category: CATEGORIES.TECHNICAL_INFORMATION,
    },
    {
        name: "Sampling Rate",
        column: "X",
        category: CATEGORIES.TECHNICAL_INFORMATION,
    },
    {
        name: "Sampling Rate",
        column: "X",
        category: CATEGORIES.TECHNICAL_INFORMATION,
    },
];

const processRow = async (rawRow, index) => {
    // Check that country code exists
    const rowNumber = index + 2;
    const rowName = `row ${rowNumber} (${rawRow[0]})`;
    const countryCode = rawRow[COUNTRY_CODE_COLUMN_INDEX];
    if (!countryCode) {
        console.warn(`Skipping ${rowName} due to missing country code.`);
        return null;
    }

    // Check that country code is valid
    const country = getCountryFromCode(countryCode);
    if (country === null) {
        console.warn(
            `Skipping ${rowName} due to unknown country code (${countryCode}).`,
        );
        return null;
    }

    // If country has state data...
    const hasStateData = getHasStateData(countryCode);
    if (hasStateData) {
        // Check that state code exists
        const stateCode = rawRow[STATE_CODE_COLUMN_INDEX];
        if (!stateCode) {
            console.warn(`Skipping ${rowName} due to missing state code.`);
            return null;
        }

        // Check that state code is valid
        const state = getStateFromCode(countryCode, stateCode);
        if (state === null) {
            console.warn(
                `Skipping ${rowName} due to unknown state code (${stateCode}) for country '${countryCode}'.`,
            );
            return null;
        }
    }

    // Format dataset row
    const row = [];
    for (const columnData of COLUMNS) {
        const { name, column, columns, category } = columnData;
        const hide = columnData.hide ?? (() => false);
        const transform = columnData.transform ?? ((x) => x);
        let rawValue;
        if (column) {
            const columnIndex = ALPHABET.findIndex(
                (letter) => letter === column,
            );
            rawValue = rawRow[columnIndex];
        } else if (columns) {
            rawValue = columns.map((column) => {
                const columnIndex = ALPHABET.findIndex(
                    (letter) => letter === column,
                );
                return rawRow[columnIndex];
            });
        } else {
            throw Error("Neither 'column' nor 'columns' defined.");
        }
        const value = await transform(rawValue);
        if (!hide(value)) {
            row.push({ name, value, category, hide });
        }
    }
    return row;
};

const VOICE_DATASETS_PROMISE = (async () => {
    let voiceDatasets = [];
    for (let i = 0; i < voiceDatasetsCsv.length; i++) {
        const rawRow = voiceDatasetsCsv[i];
        const row = await processRow(rawRow, i);
        if (row !== null) {
            voiceDatasets.push(row);
        }
    }
    return voiceDatasets;
})();

export const getVoiceDatasets = async () => {
    const voiceDatasets = await VOICE_DATASETS_PROMISE;
    return voiceDatasets;
};
