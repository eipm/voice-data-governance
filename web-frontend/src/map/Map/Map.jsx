import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MAP_CONTAINER_ID } from "../../constants";
import { useInitMap, useMapResize } from "../map";
import { useShowHoveredEntity } from "../useShowHoveredEntity";
import styles from "./Map.module.css";

const Map = () => {
    // Initialize the map
    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );
    useInitMap();

    // Calculate map dimensions
    const ref = useRef();
    const mapResize = useMapResize();
    const [mapDims, setMapDims] = useState({
        width: window.innerWidth / 2,
        height: window.innerHeight / 2,
    });
    const updateMapHeight = useCallback(() => {
        if (ref.current) {
            const { width, height } = ref.current.getBoundingClientRect();
            setMapDims({ width, height });
            mapResize();
        }
    }, [mapResize]);
    useEffect(() => {
        if (ref.current) {
            updateMapHeight();
            const onResize = _.debounce(updateMapHeight, 75, {
                maxWait: 300,
                leading: false,
                trailing: true,
            });
            const resizeObserver = new ResizeObserver(onResize);
            resizeObserver.observe(ref.current);
            return () => resizeObserver.disconnect();
        }
    }, [updateMapHeight]);

    // On map hover, show info pop-up
    const hoveredEntity = useShowHoveredEntity();

    return (
        <div className={styles.container} ref={ref}>
            <div
                className={styles.map}
                id={MAP_CONTAINER_ID}
                style={{
                    width: `${mapDims.width}px`,
                    height: `${mapDims.height}px`,
                }}
            />
            {!isMapInitialized && (
                <div className={styles.loading}>Loading...</div>
            )}
            {hoveredEntity}
        </div>
    );
};

export default Map;
