import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useFlyToBbox, useFlyToPoint } from "./map";

const FLY_TO_POINT_ZOOM = 3;
const FLY_TO_PADDING_PX = 100;

export const useFlyToCountry = () => {
    const flyToBbox = useFlyToBbox();
    const flyToPoint = useFlyToPoint();
    const paddingOptions = useFlyToPaddingOptions();
    return useCallback(
        (countryData) => {
            const minLon = countryData.bbox[0];
            const maxLon = countryData.bbox[2];
            const lonDiff = maxLon - minLon;
            if (lonDiff > 180) {
                const [lon, lat] = countryData.coordLonLat;
                flyToPoint(lon, lat, FLY_TO_POINT_ZOOM, { ...paddingOptions });
            } else {
                flyToBbox(countryData.bbox, { ...paddingOptions });
            }
        },
        [flyToBbox, flyToPoint, paddingOptions],
    );
};

const useFlyToPaddingOptions = () => {
    const menuWidthPx = useSelector((state) => state.main.menuWidthPx);
    return useMemo(() => {
        return {
            paddingTopLeft: [
                FLY_TO_PADDING_PX + menuWidthPx,
                FLY_TO_PADDING_PX,
            ],
            paddingBottomRight: [FLY_TO_PADDING_PX, FLY_TO_PADDING_PX],
        };
    }, [menuWidthPx]);
};
