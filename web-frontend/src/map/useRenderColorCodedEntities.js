import chroma from "chroma-js";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    getCountryMaxNumDatasets,
    getCountryToNumDatasetsMap,
    getStateMaxNumDatasets,
    getStateToNumDatasetsMap,
} from "../datasets/getEntityDatasets";
import {
    getCountries,
    getHasStateData,
    getStateData,
} from "../entities/entityData";
import { MAP_Z_INDEX_3 } from "./addZIndexLayers";
import { useRenderGeoJson } from "./map";

export const LOW_NUM_DATASETS_COLOR = "#FFFF00";
export const HIGH_NUM_DATASETS_COLOR = "#FF0000";
export const NUM_DATASETS_FILL_OPACITY = 0.6;
const NUM_DATASETS_STROKE_OPACITY = 0.5;
const COLOR_SCALE = chroma.scale([
    LOW_NUM_DATASETS_COLOR,
    HIGH_NUM_DATASETS_COLOR,
]);

export const getNumDatasetsColor = (numDatasets, maxNumDatasets) => {
    const scaleFunction = (x) => Math.log2(x);
    const colorPercent =
        scaleFunction(numDatasets) / scaleFunction(maxNumDatasets);
    return COLOR_SCALE(colorPercent).hex();
};

export const useRenderColorCodedCountries = () => {
    // Calculate country colorsbase based on number of datasets
    const [geojson, setGeoJson] = useState(null);
    useEffect(() => {
        (async () => {
            // Count number of datasets per country
            const countryToNumDatasetsMap = await getCountryToNumDatasetsMap();
            const maxNumDatasets = await getCountryMaxNumDatasets();

            // Calculate country colors based on number of datasets
            const countryColors = {};
            for (const [countryCode, numDatasets] of Object.entries(
                countryToNumDatasetsMap,
            )) {
                const color = getNumDatasetsColor(numDatasets, maxNumDatasets);
                countryColors[countryCode] = color;
            }

            // Calculate geojson for countries
            const geojson = {
                type: "FeatureCollection",
                features: [],
            };
            const countriesData = await getCountries();
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
            fillOpacity: NUM_DATASETS_FILL_OPACITY,
            strokeOpacity: NUM_DATASETS_STROKE_OPACITY,
            zIndex: MAP_Z_INDEX_3,
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
            // Get number of datasets per state (in focused country)
            const stateToNumDatasetsMap = await getStateToNumDatasetsMap(
                focusedCountry.codeIso3,
            );
            const maxNumDatasets = await getStateMaxNumDatasets(
                focusedCountry.codeIso3,
            );

            // Calculate state colors based on number of datasets
            const stateColors = {};
            for (const [stateCode, numDatasets] of Object.entries(
                stateToNumDatasetsMap,
            )) {
                const color = getNumDatasetsColor(numDatasets, maxNumDatasets);
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
            fillOpacity: NUM_DATASETS_FILL_OPACITY,
            strokeOpacity: NUM_DATASETS_STROKE_OPACITY,
            zIndex: MAP_Z_INDEX_3,
        });
    }, [geojson, renderGeoJson]);
};
