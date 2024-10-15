import { useEffect } from "react";
import { FaEarthAmericas } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getCountryAtPoint } from "../geographicBorders/getCountryAtPoint";
import mainSlice from "../mainSlice";
import {
    useAddMapClickListener,
    useFlyToBbox,
    useInitMap,
    useRenderGeoJson,
} from "../map";
import styles from "./App.module.css";

const App = () => {
    const dispatch = useDispatch();

    // Initialize the map
    const initMap = useInitMap();
    useEffect(() => initMap(), [initMap]);

    // On map click, set focused country
    const flyToBbox = useFlyToBbox();
    const addMapClickListener = useAddMapClickListener();
    useEffect(() => {
        return addMapClickListener(async (event) => {
            const lon = event.latlng.lng;
            const lat = event.latlng.lat;
            const country = await getCountryAtPoint(lon, lat);
            dispatch(mainSlice.actions.setFocusedCountry(country));
            if (country) {
                // TODO: fix wide countries like Russia / USA, instead fly to point
                flyToBbox(country.bbox);
            }
        });
    }, [addMapClickListener, dispatch, flyToBbox]);

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
            <div className={styles.header}>
                <FaEarthAmericas size={24} className={styles.globe} />
                <h1 className={styles.headerText}>Voice Atlas</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.map} id="map"></div>
            </div>
        </div>
    );
};

export default App;
