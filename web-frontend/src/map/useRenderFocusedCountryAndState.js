import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useRenderGeoJson } from "./map";

export const useRenderFocusedCountryAndState = () => {
    const renderFocusedCountry = useRenderFocusedCountry();
    const renderFocusedState = useRenderFocusedState();
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    const focusedState = useSelector((state) => state.main.focusedState);
    return useCallback(() => {
        if (focusedCountry !== null && focusedState !== null) {
            return renderFocusedState();
        } else if (focusedCountry !== null && focusedState === null) {
            return renderFocusedCountry();
        }
        return () => null;
    }, [
        focusedCountry,
        focusedState,
        renderFocusedCountry,
        renderFocusedState,
    ]);
};

const useRenderFocusedCountry = () => {
    const renderGeoJson = useRenderGeoJson();
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    return useCallback(() => {
        const cleanUpFns = [];
        cleanUpFns.push(renderGeoJson(focusedCountry.geoJson));
        if (focusedCountry.statesData) {
            for (const stateData of focusedCountry.statesData) {
                cleanUpFns.push(
                    renderGeoJson(stateData.geoJson, {
                        fillOpacity: 0,
                        strokeWidth: 0.8,
                    }),
                );
            }
        }
        return () => cleanUpFns.forEach((cleanUpFn) => cleanUpFn());
    }, [focusedCountry, renderGeoJson]);
};

const useRenderFocusedState = () => {
    const renderGeoJson = useRenderGeoJson();
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    const focusedState = useSelector((state) => state.main.focusedState);
    return useCallback(() => {
        const cleanUpFns = [];
        cleanUpFns.push(renderGeoJson(focusedState.geoJson));
        cleanUpFns.push(
            renderGeoJson(focusedCountry.geoJson, {
                fillOpacity: 0,
                strokeWidth: 0.8,
            }),
        );
        if (focusedCountry.statesData) {
            for (const stateData of focusedCountry.statesData) {
                cleanUpFns.push(
                    renderGeoJson(stateData.geoJson, {
                        fillOpacity: 0,
                        strokeWidth: 0.8,
                    }),
                );
            }
        }
        return () => cleanUpFns.forEach((cleanUpFn) => cleanUpFn());
    }, [focusedCountry, focusedState, renderGeoJson]);
};
