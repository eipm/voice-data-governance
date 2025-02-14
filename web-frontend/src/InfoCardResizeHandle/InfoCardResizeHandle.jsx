import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMouseMoveListener, addMouseUpListener } from "../addMouseListener";
import mainSlice from "../mainSlice";
import styles from "./InfoCardResizeHandle.module.css";

const MIN_MENU_WIDTH_PX = 200;
const MAX_MENU_WIDTH_PERCENT = 0.5;

const getDefaultMenuWidthPx = () => {
    return Math.max(Math.min(window.innerWidth * 0.5, 500), MIN_MENU_WIDTH_PX);
};

const InfoCardResizeHandle = () => {
    const [startingMenuWidthPx, setStartingMenuWidthPx] = useState(null);
    const [dragStartPoint, setDragStartPoint] = useState(null);

    // Mouse down listener
    const menuWidthPx = useSelector((state) => state.main.menuWidthPx);
    const onMouseDown = useCallback(
        (event) => {
            setDragStartPoint({ x: event.clientX, y: event.clientY });
            setStartingMenuWidthPx(menuWidthPx);
        },
        [menuWidthPx],
    );

    // Mouse up listener
    useEffect(() => {
        return addMouseUpListener(() => {
            setDragStartPoint(null);
            setStartingMenuWidthPx(null);
        });
    }, []);

    // Mouse move listener
    const dispatch = useDispatch();
    useEffect(() => {
        return addMouseMoveListener((event) => {
            if (dragStartPoint !== null) {
                const dX = event.clientX - dragStartPoint.x;
                let newMenuWidthPx = startingMenuWidthPx + dX;
                const maxMenuWidthPx =
                    window.innerWidth * MAX_MENU_WIDTH_PERCENT;
                newMenuWidthPx = Math.max(newMenuWidthPx, MIN_MENU_WIDTH_PX);
                newMenuWidthPx = Math.min(newMenuWidthPx, maxMenuWidthPx);
                dispatch(mainSlice.actions.setMenuWidthPx(newMenuWidthPx));
            }
        });
    }, [dispatch, dragStartPoint, menuWidthPx, startingMenuWidthPx]);

    const setMenuWidthToDefault = useCallback(() => {
        const defaultWidthPx = getDefaultMenuWidthPx();
        dispatch(mainSlice.actions.setMenuWidthPx(defaultWidthPx));
    }, [dispatch]);

    // Window resize listener
    useEffect(() => {
        setMenuWidthToDefault();
        const onResize = () => setMenuWidthToDefault();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [setMenuWidthToDefault]);

    return (
        <div
            className={styles.container}
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
        />
    );
};

export default InfoCardResizeHandle;
