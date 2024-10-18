import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
    getCountryAtPoint,
    getStateAtPoint,
} from "../geographicBorders/getCountryAtPoint";
import {
    useAddMapEventListener,
    useGetLonLatFromPoint,
    useRenderGeoJson,
} from "../map/map";
import {
    HOVERED_COUNTRY_RENDER_GEOJSON_OPTIONS,
    HOVERED_STATE_RENDER_GEOJSON_OPTIONS,
} from "../mapVisuals";
import styles from "./HoveredEntity.module.css";

const HoveredEntity = ({ x, y }) => {
    // Is the map zooming / panning (disable hover detection during these animations)
    const [isMapMoving, setIsMapMoving] = useState(false);
    const [isMapZooming, setIsMapZooming] = useState(false);

    // Actively hovered country / state
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [hoveredState, setHoveredState] = useState(null);

    // Determine hovered country / state
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    const getLonLatFromPoint = useGetLonLatFromPoint();
    useEffect(() => {
        (async () => {
            if (isMapMoving || isMapZooming) {
                setHoveredCountry(null);
                setHoveredState(null);
                return;
            }
            const coordLonLat = getLonLatFromPoint(x, y);
            const lon = coordLonLat[0];
            const lat = coordLonLat[1];
            const hoveredCountry = await getCountryAtPoint(lon, lat);
            setHoveredCountry(hoveredCountry);
            if (
                focusedCountry &&
                hoveredCountry &&
                focusedCountry.name === hoveredCountry.name &&
                focusedCountry.statesData
            ) {
                const hoveredState = await getStateAtPoint(
                    lon,
                    lat,
                    focusedCountry.statesData,
                );
                setHoveredState(hoveredState);
            }
        })();
    }, [focusedCountry, getLonLatFromPoint, isMapMoving, isMapZooming, x, y]);

    // Disable hover-detection while map is panning / zooming
    const addMapEventListener = useAddMapEventListener();
    useEffect(
        () => addMapEventListener("movestart", () => setIsMapMoving(true)),
        [addMapEventListener],
    );
    useEffect(
        () => addMapEventListener("moveend", () => setIsMapMoving(false)),
        [addMapEventListener],
    );
    useEffect(
        () => addMapEventListener("zoomstart", () => setIsMapZooming(true)),
        [addMapEventListener],
    );
    useEffect(
        () => addMapEventListener("zoomend", () => setIsMapZooming(false)),
        [addMapEventListener],
    );

    // Pop-up content for hovered country / state
    const content = useMemo(() => {
        if (hoveredCountry && hoveredState) {
            return {
                title: `${hoveredState.name}, ${hoveredCountry.name}`,
                descriptions: [
                    `Name: ${hoveredState.name}`,
                    `Code: ${hoveredState.stateCode}`,
                    `Country name: ${hoveredCountry.name}`,
                    `Country code: ${hoveredCountry.codeIso3}`,
                ],
            };
        } else if (hoveredCountry && !hoveredState) {
            return {
                title: `${hoveredCountry.name}`,
                descriptions: [
                    `Name: ${hoveredCountry.name}`,
                    `Code: ${hoveredCountry.codeIso3}`,
                ],
            };
        }
        return null;
    }, [hoveredCountry, hoveredState]);

    // Highlight hovered country / state
    const renderGeoJson = useRenderGeoJson();
    useEffect(() => {
        if (hoveredState) {
            return renderGeoJson(
                hoveredState.geojson,
                HOVERED_STATE_RENDER_GEOJSON_OPTIONS,
            );
        } else if (hoveredCountry) {
            return renderGeoJson(
                hoveredCountry.geojson,
                HOVERED_COUNTRY_RENDER_GEOJSON_OPTIONS,
            );
        }
    }, [hoveredCountry, hoveredState, renderGeoJson]);

    if (content === null) {
        return null;
    }
    return (
        <div className={styles.container} style={{ top: y, left: x }}>
            <div className={styles.triangle} />
            <div className={styles.content}>
                <h3 className={styles.title}>{content.title}</h3>
                {content.descriptions.map((description, index) => {
                    return (
                        <p key={index} className={styles.description}>
                            {description}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};

export default HoveredEntity;
