import { useCallback } from "react";
import { useSelector } from "react-redux";
import {
    FOCUSED_ENTITY_FILL_COLOR,
    FOCUSED_ENTITY_FILL_OPACITY,
} from "../mapVisuals";
import { useRenderGeoJson } from "./map";

export const useRenderFocusedCountry = () => {
    const renderGeoJson = useRenderGeoJson();
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    const renderFocusedCountryStates = useRenderFocusedCountryStates();
    return useCallback(() => {
        if (focusedCountry === null) {
            return () => null;
        }
        const cleanUpFns = [];
        const hasStates = !!focusedCountry.statesData;
        cleanUpFns.push(
            renderGeoJson(focusedCountry.geojson, {
                fillColor: FOCUSED_ENTITY_FILL_COLOR,
                fillOpacity: hasStates ? 0 : FOCUSED_ENTITY_FILL_OPACITY,
                strokeWidth: 3,
            }),
        );
        cleanUpFns.push(renderFocusedCountryStates());
        return () => cleanUpFns.forEach((cleanUpFn) => cleanUpFn());
    }, [focusedCountry, renderFocusedCountryStates, renderGeoJson]);
};

export const useRenderFocusedCountryStates = () => {
    const renderGeoJson = useRenderGeoJson();
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    return useCallback(() => {
        if (!focusedCountry?.statesData) {
            return () => null;
        }
        const geojson = {
            type: "FeatureCollection",
            features: focusedCountry.statesData.map((stateData) => {
                return {
                    ...stateData.geojson,
                    properties: {
                        color: "#ffffff",
                    },
                };
            }),
        };
        return renderGeoJson(geojson, {
            fillColor: ["get", "color"],
            fillOpacity: 0,
            strokeOpacity: 0.5,
        });
    }, [focusedCountry, renderGeoJson]);
};

export const useRenderFocusedState = () => {
    const renderGeoJson = useRenderGeoJson();
    const focusedState = useSelector((state) => state.main.focusedState);
    return useCallback(() => {
        if (!focusedState) {
            return () => null;
        }
        return renderGeoJson(focusedState.geojson, {
            fillColor: FOCUSED_ENTITY_FILL_COLOR,
            fillOpacity: FOCUSED_ENTITY_FILL_OPACITY,
        });
    }, [focusedState, renderGeoJson]);
};
