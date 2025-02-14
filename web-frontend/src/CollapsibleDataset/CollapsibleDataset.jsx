import _ from "lodash";
import { useMemo, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import styles from "./CollapsibleDataset.module.css";

const CollapsibleDataset = ({ dataset }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const details = useMemo(() => {
        const categories = _(dataset)
            .groupBy("category")
            .entries()
            .filter(([category]) => category !== "undefined")
            .value();
        return (
            <div className={styles.details}>
                {categories.map(([category, rows], index) => {
                    return (
                        <div key={`category-${index}`}>
                            <h3 className={styles.categoryTitle}>{category}</h3>
                            <div className={styles.categoryRows}>
                                {rows.map((row, index) => {
                                    return (
                                        <div
                                            className={styles.categoryRow}
                                            key={`row-${index}`}
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
    }, [dataset]);

    if (!dataset) {
        return null;
    }

    return (
        <div
            className={`${styles.container} ${isExpanded ? styles.isExpanded : ""}`}
        >
            <div
                className={styles.header}
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
