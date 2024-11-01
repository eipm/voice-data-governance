import { useCallback, useEffect, useMemo, useState } from "react";
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
    const [windowDims, setWindowDims] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    useEffect(() => {
        const onResize = () => {
            setWindowDims({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    return useMemo(() => {
        const { width, height } = windowDims;
        const maxHorizontalPadding = (width - menuWidthPx) / 4;
        const maxVerticalPadding = height / 4;
        const horizontalPadding = Math.min(
            maxHorizontalPadding,
            FLY_TO_PADDING_PX,
        );
        const verticalPadding = Math.min(maxVerticalPadding, FLY_TO_PADDING_PX);
        return {
            padding: {
                right: horizontalPadding,
                left: horizontalPadding + menuWidthPx,
                top: verticalPadding,
                bottom: verticalPadding,
            },
        };
    }, [menuWidthPx, windowDims]);
};
