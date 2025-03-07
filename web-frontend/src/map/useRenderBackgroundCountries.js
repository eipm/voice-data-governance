import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getCountries } from "../entities/entityData";
import { useAsyncData } from "../util/useAsyncData";
import { MAP_Z_INDEX_1, MAP_Z_INDEX_5 } from "./addZIndexLayers";
import {
    useAddMapLayer,
    useRenderGeoJson,
    useSetMapLayoutProperty,
} from "./map";
import { COUNTRY_FILL_COLOR, COUNTRY_STROKE_COLOR } from "./mapVisuals";

const ZOOM_TO_TEXT_SIZES = [
    [1, 1],
    [10, 40],
    [20, 400],
].reduce((flatList, [zoom, textSize]) => {
    return [...flatList, Number(zoom), Number(textSize)];
}, []);

export const useRenderBackgroundCountries = () => {
    useRenderBackgroundCountryPolygons();
    useRenderBackgroundCountryLabels();
};

export const useRenderBackgroundCountryPolygons = () => {
    const countries = useAsyncData(getCountries);
    const renderGeoJson = useRenderGeoJson();
    useEffect(() => {
        if (!countries) {
            return;
        }
        const features = countries.map((country) => country.geojson);
        const geojson = { type: "FeatureCollection", features };
        return renderGeoJson(geojson, {
            strokeColor: COUNTRY_STROKE_COLOR,
            strokeOpacity: 1,
            strokeWidth: 1,
            fillColor: COUNTRY_FILL_COLOR,
            fillOpacity: 1,
            zIndex: MAP_Z_INDEX_1,
        });
    }, [countries, renderGeoJson]);
};

export const useRenderBackgroundCountryLabels = () => {
    const addMapLayer = useAddMapLayer();
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    const countries = useAsyncData(getCountries);
    useEffect(() => {
        if (!countries) {
            return;
        }
        return addMapLayer(
            {
                id: "countries-labels",
                type: "symbol",
                source: {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: countries.map((country) => {
                            return {
                                type: "Feature",
                                geometry: {
                                    type: "Point",
                                    coordinates: country.coordLonLat,
                                },
                                properties: { name: country.name },
                            };
                        }),
                    },
                },
                layout: {
                    "text-field": ["get", "name"],
                    "text-size": [
                        "interpolate",
                        ["exponential", 1.1],
                        ["zoom"],
                        ...ZOOM_TO_TEXT_SIZES,
                    ],
                    "text-font": ["NotoSansRegular"],
                    "symbol-placement": "point",
                    "text-allow-overlap": true,
                },
                paint: {
                    "text-color": "#000000",
                    "text-halo-color": "#FFFFFF",
                    "text-halo-width": 2,
                    "text-halo-blur": 1,
                    "text-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        1,
                        0, // Transparent at zoom 1.5
                        2,
                        1, // Opaque isible at zoom 3
                    ],
                },
            },
            MAP_Z_INDEX_5,
        );
    }, [addMapLayer, countries]);

    // Show country labels if game is over
    const setMapLayoutProperty = useSetMapLayoutProperty();
    useEffect(() => {
        const doesFocusedCountryHaveStates =
            focusedCountry && focusedCountry.statesData;
        const visibility = doesFocusedCountryHaveStates ? "none" : "visible";
        setMapLayoutProperty("countries-labels", "visibility", visibility);
    }, [focusedCountry, setMapLayoutProperty]);
};
