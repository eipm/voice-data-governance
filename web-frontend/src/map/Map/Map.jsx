import classNames from "classnames";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MAP_CONTAINER_ID } from "../../constants";
import Legend from "../../Legend/Legend";
import { useFlyToBbox, useInitMap, useMapResize } from "../map";
import { useShowHoveredEntity } from "../useShowHoveredEntity";
import styles from "./Map.module.css";

let hasTriggeredAnimation = false;

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

    // Initialize with animation
    const flyToBbox = useFlyToBbox();
    useEffect(() => {
        if (isMapInitialized && !hasTriggeredAnimation) {
            hasTriggeredAnimation = true;
            const bbox = [-120, -60, 40, 80];
            flyToBbox(bbox, { duration: 4000 });
        }
    }, [flyToBbox, isMapInitialized]);

    // Generate random stars
    const stars = useMemo(() => {
        return _.range(300).map(() => {
            return {
                x: Math.random() * 100,
                y: Math.random() * 100,
                blur: Math.random() ** 2 * 5 + 2,
                size: Math.random() * 3,
            };
        });
    }, []);

    return (
        <div
            className={classNames(styles.container, {
                [styles.isMapInitialized]: isMapInitialized,
            })}
            ref={ref}
        >
            {stars.map((star, index) => {
                return (
                    <div
                        className={styles.star}
                        key={`star-${index}`}
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            filter: `blur(${star.blur}px)`,
                        }}
                    />
                );
            })}
            <div className={styles.loading}>Loading...</div>
            <div
                className={styles.map}
                id={MAP_CONTAINER_ID}
                style={{
                    width: `${mapDims.width}px`,
                    height: `${mapDims.height}px`,
                }}
            />
            <Legend />
            {hoveredEntity}
        </div>
    );
};

export default Map;
