import { useCallback, useEffect, useMemo, useState } from "react";
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
import styles from "./HoveredEntity.module.css";

const HoveredEntity = ({ x, y }) => {
    // Actively hovered country / state
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [hoveredState, setHoveredState] = useState(null);

    // Function to determine hovered country / state
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    const getLonLatFromPoint = useGetLonLatFromPoint();
    const determineHoveredEntity = useCallback(async () => {
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
    }, [focusedCountry, getLonLatFromPoint, x, y]);

    // Determine hovered country / state upon a change to the function dependencies
    useEffect(() => {
        determineHoveredEntity();
    }, [determineHoveredEntity]);

    // Re-determine hovered country / state upon zooming or panning map
    const addMapEventListener = useAddMapEventListener();
    useEffect(() => {
        return addMapEventListener("moveend", () => determineHoveredEntity());
    }, [addMapEventListener, determineHoveredEntity]);
    useEffect(() => {
        return addMapEventListener("zoomend", () => determineHoveredEntity());
    }, [addMapEventListener, determineHoveredEntity]);

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
            return renderGeoJson(hoveredState.geoJson, {
                strokeColor: "#777",
                fillOpacity: 0,
            });
        } else if (hoveredCountry) {
            return renderGeoJson(hoveredCountry.geoJson, {
                strokeColor: "#777",
                fillOpacity: 0,
            });
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
