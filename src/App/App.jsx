import { useEffect } from "react";
import { FaEarthAmericas } from "react-icons/fa6";
import { initMap } from "../map";
import styles from "./App.module.css";

const App = () => {
    useEffect(() => {
        return initMap();
    }, []);

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
