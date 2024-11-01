import { useMemo } from "react";
import CardSection from "../CardSection/CardSection";
import styles from "./ProjectInfo.module.css";

const ProjectInfo = () => {
    const attributions = useMemo(() => {
        return [
            {
                key: "Country Borders (default)",
                value: "MapLibre DemoTiles",
                url: "https://demotiles.maplibre.org/style.json",
            },
            {
                key: "Country Borders (hovered / focused)",
                value: "World Administrative Boundaries",
                url: "https://public.opendatasoft.com/explore/dataset/world-administrative-boundaries",
            },
            {
                key: "USA State Borders",
                value: "US State Boundaries",
                url: "https://public.opendatasoft.com/explore/dataset/us-state-boundaries/",
            },
            {
                key: "Canada Province and Territory Borders",
                value: "Provinces and territories - Canada",
                url: "https://data.opendatasoft.com/explore/dataset/georef-canada-province%40public",
            },
            {
                key: "Software Dependencies",
                values: [
                    {
                        name: "MapLibre",
                        url: "https://maplibre.org/",
                    },
                    {
                        name: "React",
                        url: "https://react.dev/",
                    },
                    {
                        name: "Redux",
                        url: "https://redux.js.org/",
                    },
                    {
                        name: "Vite",
                        url: "https://vite.dev/",
                    },
                    {
                        name: "Turf.js",
                        url: "https://turfjs.org/",
                    },
                    {
                        name: "Lodash",
                        url: "https://lodash.com/",
                    },
                    {
                        name: "Font Awesome",
                        url: "https://fontawesome.com/",
                    },
                ],
            },
        ].map(({ key, values, value, url }, index) => {
            return (
                <div key={index} className={styles.attribution}>
                    {values && (
                        <>
                            <div className={styles.attributionKey}>{key}:</div>
                            <ul>
                                {values.map(({ name, url }, index) => {
                                    return (
                                        <li key={index}>
                                            <div>{name}</div>
                                            <div className={styles.line}></div>
                                            <a
                                                href={url}
                                                target="_"
                                                rel="noreferrer"
                                                className={
                                                    styles.attributionUrl
                                                }
                                            >
                                                {url}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    )}
                    {value && (
                        <div>
                            <div className={styles.attributionKey}>{key}:</div>
                            <div className={styles.attributionValue}>
                                {value}
                            </div>
                        </div>
                    )}
                    {url && (
                        <a
                            href={url}
                            target="_"
                            rel="noreferrer"
                            className={styles.attributionUrl}
                        >
                            {url}
                        </a>
                    )}
                </div>
            );
        });
    }, []);

    return (
        <>
            <CardSection
                title="Voice Atlas"
                descriptions={[
                    "The Voice Atlas is a set of interactive maps that track different aspects of voice and speech data governance for health. The goal of the Atlas is to provide a diverse set of actors (researchers, developers, policymakers, regulators, industry stakeholders, etc.) with a frequently updated source of information about accessible voice datasets, regulation/policy regarding voice data governance, and other aspects of this emerging field.",
                ]}
            />
            <CardSection
                title="Speech and Voice Datasets Map"
                descriptions={[
                    "This map tracks speech and voice datasets that have been collected by different institutions for different disease cohorts that are accessible to researchers. The map includes information about the institution hosting the dataset, the speakers and voice samples in the datasets, the accessibility of the dataset, demographic information, and technical information.",
                ]}
            />
            <CardSection
                title="Contact"
                descriptions={[
                    <>
                        You can contact us with questions or comments by
                        emailing{" "}
                        <a
                            href="mailto:alden_blatter@sfu.ca"
                            target="_"
                            rel="noreferrer"
                        >
                            alden_blatter@sfu.ca
                        </a>
                    </>,
                ]}
            />
            <CardSection title="Attributions">
                <div className={styles.attributions}>{attributions}</div>
            </CardSection>
        </>
    );
};

export default ProjectInfo;
