import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../Card/Card";
import {
    getCountryMaxNumDatasets,
    getStateMaxNumDatasets,
} from "../datasets/getEntityDatasets";
import { getHasStateData } from "../entities/entityData";
import { COUNTRY_FILL_COLOR } from "../map/mapVisuals";
import {
    getNumDatasetsColor,
    HIGH_NUM_DATASETS_COLOR,
    LOW_NUM_DATASETS_COLOR,
    NUM_DATASETS_FILL_OPACITY,
} from "../map/useRenderColorCodedEntities";
import styles from "./Legend.module.css";

const Legend = () => {
    // Calculate max number of datasets
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    const [maxNumDatasets, setMaxNumDatasets] = useState(0);
    useEffect(() => {
        (async () => {
            if (!focusedCountry || !getHasStateData(focusedCountry.codeIso3)) {
                const maxNumDatasets = await getCountryMaxNumDatasets();
                setMaxNumDatasets(maxNumDatasets);
            } else {
                const maxNumDatasets = await getStateMaxNumDatasets(
                    focusedCountry.codeIso3,
                );
                setMaxNumDatasets(maxNumDatasets);
            }
        })();
    }, [focusedCountry]);

    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );
    if (!isMapInitialized) {
        return null;
    }

    return (
        <Card className={styles.card}>
            <h2 className={styles.title}>Legend</h2>
            <div className={styles.legendContent}>
                <div className={styles.legendGradient} style={{}}>
                    <div
                        className={styles.legendGradientFill}
                        style={{
                            background: `linear-gradient(to top, ${COUNTRY_FILL_COLOR} 5%, ${LOW_NUM_DATASETS_COLOR} 20%, ${HIGH_NUM_DATASETS_COLOR}) 95%`,
                            opacity: NUM_DATASETS_FILL_OPACITY,
                        }}
                    />
                </div>
                <div className={styles.legendItems}>
                    <div className={styles.legendItem}>
                        <div className={styles.legendItemColor}>
                            <div
                                className={styles.legendItemColorFill}
                                style={{
                                    opacity: NUM_DATASETS_FILL_OPACITY,
                                    backgroundColor: getNumDatasetsColor(
                                        maxNumDatasets,
                                        maxNumDatasets,
                                    ),
                                }}
                            />
                        </div>
                        <div className={styles.legendItemText}>
                            {maxNumDatasets} Datasets
                        </div>
                    </div>
                    <div className={styles.etc}></div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendItemColor}>
                            <div
                                className={styles.legendItemColorFill}
                                style={{
                                    opacity: NUM_DATASETS_FILL_OPACITY,
                                    backgroundColor: getNumDatasetsColor(
                                        2,
                                        maxNumDatasets,
                                    ),
                                }}
                            />
                        </div>
                        <div className={styles.legendItemText}>2 Datasets</div>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendItemColor}>
                            <div
                                className={styles.legendItemColorFill}
                                style={{
                                    opacity: NUM_DATASETS_FILL_OPACITY,
                                    backgroundColor: getNumDatasetsColor(
                                        1,
                                        maxNumDatasets,
                                    ),
                                }}
                            />
                        </div>
                        <div className={styles.legendItemText}>1 Dataset</div>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendItemColor}>
                            <div
                                className={styles.legendItemColorFill}
                                style={{
                                    opacity: NUM_DATASETS_FILL_OPACITY,
                                    backgroundColor: COUNTRY_FILL_COLOR,
                                }}
                            />
                        </div>
                        <div className={styles.legendItemText}>0 Datasets</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Legend;
