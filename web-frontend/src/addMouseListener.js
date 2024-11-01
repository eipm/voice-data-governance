export const addMouseDownListener = (callback) =>
    addEventListeners(["mousedown", "touchstart"], wrapEvent(callback));

export const addMouseMoveListener = (callback) =>
    addEventListeners(["mousemove", "touchmove"], wrapEvent(callback));

export const addMouseUpListener = (callback) =>
    addEventListeners(["mouseup", "touchend"], wrapEvent(callback));

const addEventListeners = (events, callback) => {
    events.forEach((event) => document.addEventListener(event, callback));
    return () => {
        events.forEach((event) =>
            document.removeEventListener(event, callback),
        );
    };
};

const wrapEvent = (callback) => {
    return (event) => {
        // If event is a TouchEvent, add clientX and clientY to the event based
        // on the first touch
        if (!event.clientX && !event.clientY && event.touches?.[0]) {
            event.clientX = event.touches[0].clientX;
            event.clientY = event.touches[0].clientY;
        }
        callback(event);
    };
};
