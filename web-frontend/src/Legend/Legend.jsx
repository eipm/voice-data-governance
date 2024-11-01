import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../Card/Card";
import {
    getCountryMaxNumDatasets,
    getStateMaxNumDatasets,
} from "../datasets/getEntityDatasets";
import { getHasStateData } from "../entities/entityData";
import {
    getNumDatasetsColor,
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

    return (
        <Card className={styles.card}>
            <h2 className={styles.title}>Legend</h2>
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
        </Card>
    );
};

export default Legend;
