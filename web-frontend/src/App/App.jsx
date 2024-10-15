import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCountryAtPoint } from "../geographicBorders/getCountryAtPoint";
import InfoCard from "../InfoCard/InfoCard";
import mainSlice from "../mainSlice";
import {
    useAddMapClickListener,
    useInitMap,
    useRenderGeoJson,
} from "../map/map";
import { useFlyToCountry } from "../map/useFlyToCountry";
import styles from "./App.module.css";

const App = () => {
    const dispatch = useDispatch();

    // Initialize the map
    const initMap = useInitMap();
    useEffect(() => initMap(), [initMap]);

    // On map click, set focused country
    const flyToCountry = useFlyToCountry();
    const addMapClickListener = useAddMapClickListener();
    useEffect(() => {
        return addMapClickListener(async (event) => {
            const lon = event.latlng.lng;
            const lat = event.latlng.lat;
            const country = await getCountryAtPoint(lon, lat);
            dispatch(mainSlice.actions.setFocusedCountry(country));
            if (country) {
                flyToCountry(country);
            }
        });
    }, [addMapClickListener, dispatch, flyToCountry]);

    // Highlight the focused country
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    const renderGeoJson = useRenderGeoJson();
    useEffect(() => {
        if (focusedCountry === null) {
            return;
        }
        return renderGeoJson(focusedCountry.geoJson);
    }, [focusedCountry, renderGeoJson]);

    return (
        <div className={styles.container}>
            <InfoCard />
            <div className={styles.map} id="map"></div>
        </div>
    );
};

export default App;
