export const MAP_Z_INDEX_1 = "z-index-1";
export const MAP_Z_INDEX_2 = "z-index-2";
export const MAP_Z_INDEX_3 = "z-index-3";
export const MAP_Z_INDEX_4 = "z-index-4";
export const MAP_Z_INDEX_5 = "z-index-5";

export const addZIndexLayers = (map) => {
    map.addSource("empty", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
    });
    map.addLayer({
        id: MAP_Z_INDEX_1,
        type: "symbol",
        source: "empty",
    });
    map.addLayer({
        id: MAP_Z_INDEX_2,
        type: "symbol",
        source: "empty",
    });
    map.addLayer({
        id: MAP_Z_INDEX_3,
        type: "symbol",
        source: "empty",
    });
    map.addLayer({
        id: MAP_Z_INDEX_4,
        type: "symbol",
        source: "empty",
    });
    map.addLayer({
        id: MAP_Z_INDEX_5,
        type: "symbol",
        source: "empty",
    });
};
