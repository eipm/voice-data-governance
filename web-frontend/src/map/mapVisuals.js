import { MAP_Z_INDEX_4 } from "./addZIndexLayers";

// Default map colors
export const OCEAN_FILL_COLOR = "#CBE2FF";
export const COUNTRY_FILL_COLOR = "#ffffff";
export const COUNTRY_STROKE_COLOR = "#999999";

// Focused country / state visuals
export const FOCUSED_ENTITY_FILL_COLOR = "#6EE143";
export const FOCUSED_ENTITY_FILL_OPACITY = 0;

// Hovered country visuals
export const HOVERED_COUNTRY_RENDER_GEOJSON_OPTIONS = {
    fillColor: "#6EE143",
    fillOpacity: 0,
    strokeColor: "#000000",
    strokeOpacity: 1,
    strokeWidth: 3.5,
    zIndex: MAP_Z_INDEX_4,
};

// Hovered state visuals
export const HOVERED_STATE_RENDER_GEOJSON_OPTIONS = {
    fillColor: "#6EE143",
    fillOpacity: 0,
    strokeColor: "#000000",
    strokeOpacity: 1,
    strokeWidth: 3.5,
    zIndex: MAP_Z_INDEX_4,
};
