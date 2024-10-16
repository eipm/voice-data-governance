import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getCountryAtPoint,
    getStateAtPoint,
} from "../geographicBorders/getCountryAtPoint";
import InfoCard from "../InfoCard/InfoCard";
import mainSlice from "../mainSlice";
import { useAddMapClickListener, useInitMap } from "../map/map";
import { useFlyToEntity } from "../map/useFlyToEntity";
import { useRenderFocusedCountryAndState } from "../map/useRenderFocusedCountryAndState";
import styles from "./App.module.css";

const App = () => {
    const dispatch = useDispatch();

    // Initialize the map
    const initMap = useInitMap();
    useEffect(() => initMap(), [initMap]);

    // On map click, set focused country
    const flyToEntity = useFlyToEntity();
    const addMapClickListener = useAddMapClickListener();
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    useEffect(() => {
        return addMapClickListener(async (event) => {
            const lon = event.latlng.lng;
            const lat = event.latlng.lat;
            const country = await getCountryAtPoint(lon, lat);
            let state = null;
            if (
                country &&
                focusedCountry &&
                country.name === focusedCountry.name &&
                focusedCountry.statesData
            ) {
                state = await getStateAtPoint(
                    lon,
                    lat,
                    focusedCountry.statesData,
                );
            }
            dispatch(mainSlice.actions.setFocusedCountry(country));
            dispatch(mainSlice.actions.setFocusedState(state));
            if (state) {
                flyToEntity(state);
            } else if (country) {
                flyToEntity(country);
            }
        });
    }, [addMapClickListener, dispatch, flyToEntity, focusedCountry]);

    // Render the focused country
    const renderFocusedCountryAndState = useRenderFocusedCountryAndState();
    useEffect(
        () => renderFocusedCountryAndState(),
        [renderFocusedCountryAndState],
    );

    return (
        <div className={styles.container}>
            <InfoCard />
            <div className={styles.map} id="map"></div>
        </div>
    );
};

export default App;
