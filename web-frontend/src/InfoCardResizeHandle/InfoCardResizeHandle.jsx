import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import mainSlice from "../mainSlice";
import styles from "./InfoCardResizeHandle.module.css";

const MIN_MENU_WIDTH_PX = 200;
const MAX_MENU_WIDTH_PERCENT = 0.8;

const InfoCardResizeHandle = () => {
    const [startingMenuWidthPx, setStartingMenuWidthPx] = useState(null);
    const [dragStartPoint, setDragStartPoint] = useState(null);

    // Mouse down listener
    const menuWidthPx = useSelector((state) => state.main.menuWidthPx);
    const onMouseDown = useCallback(
        (event) => {
            setDragStartPoint({ x: event.pageX, y: event.pageY });
            setStartingMenuWidthPx(menuWidthPx);
        },
        [menuWidthPx],
    );

    // Mouse up listener
    useEffect(() => {
        const onMouseUp = () => {
            setDragStartPoint(null);
            setStartingMenuWidthPx(null);
        };
        document.addEventListener("mouseup", onMouseUp);
        return () => document.removeEventListener("mouseup", onMouseUp);
    }, []);

    // Mouse move listener
    const dispatch = useDispatch();
    useEffect(() => {
        const onMouseMove = (event) => {
            if (dragStartPoint !== null) {
                const dX = event.pageX - dragStartPoint.x;
                let newMenuWidthPx = startingMenuWidthPx + dX;
                const maxMenuWidthPx =
                    window.innerWidth * MAX_MENU_WIDTH_PERCENT;
                newMenuWidthPx = Math.min(newMenuWidthPx, maxMenuWidthPx);
                newMenuWidthPx = Math.max(newMenuWidthPx, MIN_MENU_WIDTH_PX);
                dispatch(mainSlice.actions.setMenuWidthPx(newMenuWidthPx));
            }
        };
        document.addEventListener("mousemove", onMouseMove);
        return () => document.removeEventListener("mousemove", onMouseMove);
    }, [dispatch, dragStartPoint, menuWidthPx, startingMenuWidthPx]);

    // Window resize listener
    useEffect(() => {
        const onResize = () => {
            const maxMenuWidthPx = window.innerWidth * MAX_MENU_WIDTH_PERCENT;
            let newMenuWidthPx = menuWidthPx;
            newMenuWidthPx = Math.min(newMenuWidthPx, maxMenuWidthPx);
            newMenuWidthPx = Math.max(newMenuWidthPx, MIN_MENU_WIDTH_PX);
            dispatch(mainSlice.actions.setMenuWidthPx(newMenuWidthPx));
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [dispatch, menuWidthPx, startingMenuWidthPx]);

    return <div className={styles.container} onMouseDown={onMouseDown} />;
};

export default InfoCardResizeHandle;
