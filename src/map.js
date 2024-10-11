import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_CONTAINER_ID } from "./constants";
import "./mapSmoothZoom";

let map = null;

export const getMap = () => map;

export const initMap = () => {
    map = Leaflet.map(MAP_CONTAINER_ID, {
        center: [27, -17],
        zoom: 2.5,
        minZoom: 2.3,
        zoomControl: false,
        scrollWheelZoom: false,
        smoothWheelZoom: true,
        smoothSensitivity: 5,
    });
    map.attributionControl.setPrefix(false);
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const southWest = L.latLng(-90, -Infinity);
    const northEast = L.latLng(90, Infinity);
    const bounds = L.latLngBounds(southWest, northEast);
    map.setMaxBounds(bounds);
    return () => {
        map.eachLayer((layer) => map.removeLayer(layer));
        map.remove();
        map = null;
    };
};

export const addMapClickListener = (handler) => {
    if (map === null) {
        return () => null;
    }
    map.on("click", handler);
    return () => map.off("click", handler);
};
