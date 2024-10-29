import chroma from "chroma-js";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    COUNTRY_CODE_COLUMN_NAME,
    getVoiceDatasets,
    STATE_CODE_COLUMN_NAME,
} from "../datasets/getVoiceDatasets";
import {
    getCountryData,
    getHasStateData,
    getStateData,
} from "../entities/entityData";
import { useRenderGeoJson } from "./map";

const COLOR_SCALE = ["YELLOW", "ORANGE", "RED"];

export const useRenderColorCodedCountries = () => {
    // Calculate country colorsbase based on number of datasets
    const [geojson, setGeoJson] = useState(null);
    useEffect(() => {
        (async () => {
            // Count number of datasets per country
            const voiceDatasets = await getVoiceDatasets();
            const countryNumDatasets = {};
            let maxNumDatasets = 0;
            for (const row of voiceDatasets) {
                const countryCodeColumn = row.find(
                    (column) => column.name === COUNTRY_CODE_COLUMN_NAME,
                );
                const countryCode = countryCodeColumn.value;
                countryNumDatasets[countryCode] ??= 0;
                countryNumDatasets[countryCode]++;
                maxNumDatasets = Math.max(
                    maxNumDatasets,
                    countryNumDatasets[countryCode],
                );
            }

            // Calculate country colors based on number of datasets
            const scaleFunction = (x) => Math.log2(x);
            const colorScale = chroma.scale(COLOR_SCALE);
            const countryColors = {};
            for (const [countryCode, numDatasets] of Object.entries(
                countryNumDatasets,
            )) {
                const colorPercent =
                    scaleFunction(numDatasets) / scaleFunction(maxNumDatasets);
                const color = colorScale(colorPercent).hex();
                countryColors[countryCode] = color;
            }

            // Calculate geojson for countries
            const geojson = {
                type: "FeatureCollection",
                features: [],
            };
            const countriesData = await getCountryData();
            for (const [countryCode, color] of Object.entries(countryColors)) {
                const countryData = countriesData.find(
                    (countryData) => countryData.codeIso3 === countryCode,
                );
                geojson.features.push({
                    ...countryData.geojson,
                    properties: {
                        color: color,
                    },
                });
            }
            setGeoJson(geojson);
        })();
    }, []);

    const renderGeoJson = useRenderGeoJson();
    return useCallback(() => {
        if (geojson === null) {
            return () => null;
        }
        return renderGeoJson(geojson, {
            fillColor: ["get", "color"],
            fillOpacity: 0.5,
            strokeOpacity: 0.6,
        });
    }, [geojson, renderGeoJson]);
};

export const useRenderColorCodedStates = () => {
    const focusedCountry = useSelector((state) => state.main.focusedCountry);

    // Calculate country colorsbase based on number of datasets
    const [geojson, setGeoJson] = useState(null);
    useEffect(() => {
        if (!focusedCountry || !getHasStateData(focusedCountry.codeIso3)) {
            setGeoJson(null);
            return;
        }

        (async () => {
            // Filter out rows belonging to non-focused countries
            let voiceDatasets = await getVoiceDatasets();
            voiceDatasets = voiceDatasets.filter((row) => {
                const countryCodeColumn = row.find(
                    (column) => column.name === COUNTRY_CODE_COLUMN_NAME,
                );
                const countryCode = countryCodeColumn.value;
                return countryCode === focusedCountry.codeIso3;
            });

            // Count number of datasets per state
            const stateNumDatasets = {};
            let maxNumDatasets = 0;
            for (const row of voiceDatasets) {
                const stateCodeColumn = row.find(
                    (column) => column.name === STATE_CODE_COLUMN_NAME,
                );
                const stateCode = stateCodeColumn.value;
                stateNumDatasets[stateCode] ??= 0;
                stateNumDatasets[stateCode]++;
                maxNumDatasets = Math.max(
                    maxNumDatasets,
                    stateNumDatasets[stateCode],
                );
            }

            // Calculate state colors based on number of datasets
            const scaleFunction = (x) => Math.log2(x);
            const colorScale = chroma.scale(COLOR_SCALE);
            const stateColors = {};
            for (const [stateCode, numDatasets] of Object.entries(
                stateNumDatasets,
            )) {
                const colorPercent =
                    scaleFunction(numDatasets) / scaleFunction(maxNumDatasets);
                const color = colorScale(colorPercent).hex();
                stateColors[stateCode] = color;
            }

            // Calculate geojson for countries
            const geojson = {
                type: "FeatureCollection",
                features: [],
            };
            const statesData = await getStateData(focusedCountry.codeIso3);
            for (const [stateCode, color] of Object.entries(stateColors)) {
                const stateData = statesData.find(
                    (stateData) => stateData.stateCode === stateCode,
                );
                geojson.features.push({
                    ...stateData.geojson,
                    properties: {
                        color: color,
                    },
                });
            }
            setGeoJson(geojson);
        })();
    }, [focusedCountry]);

    const renderGeoJson = useRenderGeoJson();
    return useCallback(() => {
        if (geojson === null) {
            return () => null;
        }
        return renderGeoJson(geojson, {
            fillColor: ["get", "color"],
            fillOpacity: 0.5,
            strokeOpacity: 0.6,
        });
    }, [geojson, renderGeoJson]);
};
