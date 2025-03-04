import { useCallback } from "react";
import { useFlyToBbox, useFlyToPoint } from "./map";

const FLY_TO_POINT_ZOOM = 3;

// Fly to an entity (either a country or a state)
export const useFlyToEntity = () => {
    const flyToBbox = useFlyToBbox();
    const flyToPoint = useFlyToPoint();
    return useCallback(
        (entityData) => {
            const minLon = entityData.bbox[0];
            const maxLon = entityData.bbox[2];
            const lonDiff = maxLon - minLon;
            if (lonDiff > 180) {
                const [lon, lat] = entityData.coordLonLat;
                flyToPoint(lon, lat, FLY_TO_POINT_ZOOM);
            } else {
                flyToBbox(entityData.bbox);
            }
        },
        [flyToBbox, flyToPoint],
    );
};
