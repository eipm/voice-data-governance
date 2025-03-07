import maplibre from "maplibre-gl";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MAP_CONTAINER_ID } from "../constants";
import { getCountryToDatasetsMap } from "../datasets/getEntityDatasets";
import { getCountries } from "../entities/entityData";
import mainSlice from "../mainSlice";
import { useAsyncData } from "../util/useAsyncData";
import { addZIndexLayers, MAP_Z_INDEX_1 } from "./addZIndexLayers";
import { OCEAN_FILL_COLOR } from "./mapVisuals";

export const MAP_DEFAULT_CENTER = [70, -31];

let map = null;

export const getMap = () => map;

// TODO change country dataset to natural earth, update attributions

export const useInitMap = () => {
    const dispatch = useDispatch();
    const countryToDatasetsMap = useAsyncData(getCountryToDatasetsMap);
    const countries = useAsyncData(getCountries);
    useEffect(() => {
        if (!countries || !countryToDatasetsMap) {
            return;
        }
        map = new maplibre.Map({
            container: MAP_CONTAINER_ID,
            style: {
                glyphs: "/{fontstack}/{range}.pbf",
                layers: [
                    {
                        id: "background",
                        type: "background",
                        paint: { "background-color": OCEAN_FILL_COLOR },
                    },
                ],
                sources: {},
                version: 8,
            },
            center: MAP_DEFAULT_CENTER,
            zoom: 2,
        });

        map.on("style.load", () => {
            map.setProjection({
                type: "globe", // Set projection to globe
            });
        });

        // Set map as initialized upon loading
        map.on("load", async () => {
            addZIndexLayers(map);
            map.setCenter(MAP_DEFAULT_CENTER);
            dispatch(mainSlice.actions.setIsMapInitialized(true));
        });

        // Clean up
        return () => {
            dispatch(mainSlice.actions.setIsMapInitialized(false));
            map.remove();
            map = null;
        };
    }, [countries, countryToDatasetsMap, dispatch]);
};

// Safeguards map utility functions from being called before the map has
// been initialized
const useCreateMapUtilityFunction = () => {
    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );
    return useCallback(
        (fn) => {
            if (!isMapInitialized || map === null) {
                return () => null;
            }
            const returnValue = fn();

            // If return-value is a clean-up function, safeguard it as well
            if (typeof returnValue === "function") {
                return () => {
                    if (!isMapInitialized || map === null) {
                        return;
                    }
                    returnValue();
                };
            }

            return returnValue;
        },
        [isMapInitialized],
    );
};

export const useSetMapLayoutProperty = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (layerId, layoutKey, layoutValue) => {
            return createMapUtilityFunction(() => {
                map.setLayoutProperty(layerId, layoutKey, layoutValue);
            });
        },
        [createMapUtilityFunction],
    );
};

export const useAddMapLayer = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (layer, zIndex) => {
            return createMapUtilityFunction(() => {
                const layerId = layer.id ?? `layer-${Math.random().toString()}`;
                map.addLayer({ ...layer, id: layerId }, zIndex);
                return () => map.removeLayer(layerId);
            });
        },
        [createMapUtilityFunction],
    );
};

export const useMapResize = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(() => {
        return createMapUtilityFunction(() => {
            map.resize();
        });
    }, [createMapUtilityFunction]);
};

export const useAddMapEventListener = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (eventName, callbackFn) => {
            return createMapUtilityFunction(() => {
                map.on(eventName, callbackFn);
                return () => map.off(eventName, callbackFn);
            });
        },
        [createMapUtilityFunction],
    );
};

export const useAddMapClickListener = () => {
    const addMapEventListener = useAddMapEventListener();
    return useCallback(
        (callbackFn) => addMapEventListener("click", callbackFn),
        [addMapEventListener],
    );
};

const DEFAULT_RENDER_GEO_JSON_OPTIONS = {
    strokeColor: "black",
    strokeOpacity: 1,
    strokeWidth: 2,
    fillColor: "white",
    fillOpacity: 0.5,
    zIndex: MAP_Z_INDEX_1,
};

export const useRenderGeoJson = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (geojson, options = DEFAULT_RENDER_GEO_JSON_OPTIONS) => {
            return createMapUtilityFunction(() => {
                const getOption = (key) => {
                    return options[key] ?? DEFAULT_RENDER_GEO_JSON_OPTIONS[key];
                };
                const sourceId = `geo-json-${Math.random()}`;
                const fillLayerId = `${sourceId}-fill`;
                const strokeLayerId = `${sourceId}-stroke`;
                const zIndex = getOption("zIndex");
                map.addSource(sourceId, { type: "geojson", data: geojson });
                map.addLayer(
                    {
                        id: fillLayerId,
                        type: "fill",
                        source: sourceId,
                        paint: {
                            "fill-color": getOption("fillColor"),
                            "fill-opacity": getOption("fillOpacity"),
                        },
                    },
                    zIndex,
                );
                map.addLayer(
                    {
                        id: strokeLayerId,
                        type: "line",
                        source: sourceId,
                        paint: {
                            "line-color": getOption("strokeColor"),
                            "line-opacity": getOption("strokeOpacity"),
                            "line-width": getOption("strokeWidth"),
                        },
                    },
                    zIndex,
                );
                return () => {
                    map.removeLayer(fillLayerId);
                    map.removeLayer(strokeLayerId);
                    map.removeSource(sourceId);
                };
            });
        },
        [createMapUtilityFunction],
    );
};

const DEFAULT_FLY_TO_BBOX_OPTIONS = { duration: 500 };

export const useFlyToBbox = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (bbox, options = DEFAULT_FLY_TO_BBOX_OPTIONS) => {
            return createMapUtilityFunction(() => {
                map.fitBounds(
                    [
                        [bbox[0], bbox[1]],
                        [bbox[2], bbox[3]],
                    ],
                    options,
                );
            });
        },
        [createMapUtilityFunction],
    );
};

const DEFAULT_FLY_TO_POINT_OPTIONS = {};

export const useFlyToPoint = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (lon, lat, zoom, options = DEFAULT_FLY_TO_POINT_OPTIONS) => {
            return createMapUtilityFunction(() => {
                map.flyTo({
                    center: [lon, lat],
                    zoom: zoom,
                    ...options,
                });
            });
        },
        [createMapUtilityFunction],
    );
};

export const useZoomTo = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (zoom, duration = 500) => {
            return createMapUtilityFunction(() => {
                map.flyTo({ zoom, duration });
            });
        },
        [createMapUtilityFunction],
    );
};

export const useGetLonLatFromPoint = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (x, y) => {
            return createMapUtilityFunction(() => {
                const coord = map.unproject([x, y]);
                return [coord.lng, coord.lat];
            });
        },
        [createMapUtilityFunction],
    );
};

export const useGetPointFromLonLat = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (lon, lat) => {
            return createMapUtilityFunction(() => {
                const coord = map.project([lon, lat]);
                return [coord.x, coord.y];
            });
        },
        [createMapUtilityFunction],
    );
};
