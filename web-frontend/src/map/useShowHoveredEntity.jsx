import { useEffect, useState } from "react";
import { addMouseMoveListener } from "../addMouseListener";
import { MAP_CONTAINER_ID } from "../constants";
import HoveredEntity from "../HoveredEntity/HoveredEntity";

let showPopupTimeout = null;

const DELAY_BEFORE_SHOWING_POPUP_MS = 100;

export const useShowHoveredEntity = () => {
    const [popUp, setPopUp] = useState(null);

    useEffect(() => {
        return addMouseMoveListener((event) => {
            if (showPopupTimeout) {
                clearTimeout(showPopupTimeout);
            }
            setPopUp(null);
            const mapContainerElement = event.target.closest(
                `#${MAP_CONTAINER_ID}`,
            );
            const isHoveringMap = !!mapContainerElement;
            if (isHoveringMap) {
                const { top, left } =
                    mapContainerElement.getBoundingClientRect();
                const x = event.clientX - left;
                const y = event.clientY - top;
                showPopupTimeout = setTimeout(() => {
                    setPopUp(<HoveredEntity x={x} y={y} />);
                }, DELAY_BEFORE_SHOWING_POPUP_MS);
            }
        });
    }, []);

    return popUp;
};
