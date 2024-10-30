import chroma from "chroma-js";
import _ from "lodash";
import { useMemo, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import styles from "./CollapsibleDataset.module.css";

const COLORS_FOR_SCALE = ["#D8F2FF", "#ECFFD6", "#E7DAFF"];
const SCALE_SIZE = 3;
const NUM_COLORS_IN_SCALE = COLORS_FOR_SCALE.length * SCALE_SIZE;
const COLORS = chroma
    .scale(
        [...COLORS_FOR_SCALE, COLORS_FOR_SCALE[0]].map((color) => {
            return chroma(color).darken(0.2).alpha(0.8).hex();
        }),
    )
    .mode("lch")
    .colors(NUM_COLORS_IN_SCALE);

const CollapsibleDataset = ({ dataset, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const color = useMemo(() => {
        const colorIndex = index % COLORS.length;
        const color = COLORS[colorIndex];
        return color;
    }, [index]);
    const details = useMemo(() => {
        const lightColor = chroma(color).alpha(0.4).hex();
        const categories = _(dataset).groupBy("category").entries().value();
        return (
            <div className={styles.details} style={{ borderColor: color }}>
                {categories.map(([category, rows], index) => {
                    return (
                        <div key={`category-${index}`}>
                            <h3 className={styles.categoryTitle}>{category}</h3>
                            <div
                                className={styles.categoryRows}
                                style={{ borderColor: lightColor }}
                            >
                                {rows.map((row, index) => {
                                    const isEven = index % 2 === 0;
                                    const backgroundColor = isEven
                                        ? lightColor
                                        : "none";
                                    return (
                                        <div
                                            className={styles.categoryRow}
                                            key={`row-${index}`}
                                            style={{ backgroundColor }}
                                        >
                                            <div
                                                className={
                                                    styles.categoryRowKey
                                                }
                                            >
                                                {row.name}:
                                            </div>
                                            <div
                                                className={
                                                    styles.categoryRowValue
                                                }
                                            >
                                                {row.value}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }, [color, dataset]);

    if (!dataset) {
        return null;
    }

    return (
        <div
            className={`${styles.container} ${isExpanded ? styles.isExpanded : ""}`}
        >
            <div
                className={styles.header}
                style={{ backgroundColor: color }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className={styles.title}>{dataset[0].value}</div>
                <div className={`${styles.arrow}`}>
                    <FaChevronUp />
                </div>
            </div>
            {isExpanded ? details : null}
        </div>
    );
};

export default CollapsibleDataset;
