import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MAP_CONTAINER_ID } from "./constants";
import mainSlice from "./mainSlice";
import "./mapSmoothZoom";

let map = null;

export const getMap = () => map;

export const useInitMap = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        map = Leaflet.map(MAP_CONTAINER_ID, {
            center: [27, -17],
            zoom: 2.5,
            minZoom: 2.3,
            zoomControl: false,
            scrollWheelZoom: false,
            smoothWheelZoom: true,
            smoothSensitivity: 5,
        });

        // Remove leaflet attribution
        map.attributionControl.setPrefix(false);

        // Add OpenStreetMap tiles and attribution
        Leaflet.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
        ).addTo(map);

        // Set North-South map bounds
        const southWest = Leaflet.latLng(-90, -Infinity);
        const northEast = Leaflet.latLng(90, Infinity);
        const bounds = Leaflet.latLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);

        // Set map as initialized
        dispatch(mainSlice.actions.setIsMapInitialized(true));

        // Clean up
        return () => {
            dispatch(mainSlice.actions.setIsMapInitialized(false));
            map.eachLayer((layer) => map.removeLayer(layer));
            map.remove();
            map = null;
        };
    }, [dispatch]);
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
            const cleanUpFn = fn();
            return () => {
                if (!isMapInitialized || map === null) {
                    return;
                }
                if (cleanUpFn) {
                    cleanUpFn();
                }
            };
        },
        [isMapInitialized],
    );
};

export const useAddMapClickListener = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (handler) =>
            createMapUtilityFunction(() => {
                map.on("click", handler);
                return () => map.off("click", handler);
            }),
        [createMapUtilityFunction],
    );
};

export const useRenderGeoJson = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (geoJson, options = {}) => {
            const strokeColor = options.strokeColor ?? "black";
            const fillColor = options.fillColor ?? "green";
            const fillOpacity = options.fillOpacity ?? 0.5;
            return createMapUtilityFunction(() => {
                const geoJsonLayer = Leaflet.geoJson(geoJson, {
                    style: {
                        color: strokeColor,
                        fillColor: fillColor,
                        fillOpacity: fillOpacity,
                    },
                }).addTo(map);
                return () => map.removeLayer(geoJsonLayer);
            });
        },
        [createMapUtilityFunction],
    );
};

export const useFlyToBbox = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (bbox, options = {}) => {
            return createMapUtilityFunction(() => {
                map.flyToBounds(
                    [
                        [bbox[1], bbox[0]],
                        [bbox[3], bbox[2]],
                    ],
                    options,
                );
            });
        },
        [createMapUtilityFunction],
    );
};

export const useFlyToPoint = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(() => {
        return createMapUtilityFunction(() => {
            // TODO
        });
    }, [createMapUtilityFunction]);
};
