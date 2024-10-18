import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useFlyToBbox, useFlyToPoint } from "./map";

const FLY_TO_POINT_ZOOM = 3;
const FLY_TO_PADDING_PX = 100;

// Fly to an entity (either a country or a state)
export const useFlyToEntity = () => {
    const flyToBbox = useFlyToBbox();
    const flyToPoint = useFlyToPoint();
    const paddingOptions = useFlyToPaddingOptions();
    return useCallback(
        (entityData) => {
            const minLon = entityData.bbox[0];
            const maxLon = entityData.bbox[2];
            const lonDiff = maxLon - minLon;
            if (lonDiff > 180) {
                const [lon, lat] = entityData.coordLonLat;
                flyToPoint(lon, lat, FLY_TO_POINT_ZOOM, { ...paddingOptions });
            } else {
                flyToBbox(entityData.bbox, { ...paddingOptions });
            }
        },
        [flyToBbox, flyToPoint, paddingOptions],
    );
};

const useFlyToPaddingOptions = () => {
    const menuWidthPx = useSelector((state) => state.main.menuWidthPx);
    return useMemo(() => {
        return {
            padding: {
                top: FLY_TO_PADDING_PX,
                right: FLY_TO_PADDING_PX,
                bottom: FLY_TO_PADDING_PX,
                left: FLY_TO_PADDING_PX + menuWidthPx,
            },
        };
    }, [menuWidthPx]);
};
