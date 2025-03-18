import { useMemo } from "react";
import CardSection from "../CardSection/CardSection";
import styles from "./ProjectInfo.module.css";

const ProjectInfo = () => {
    const attributions = useMemo(() => {
        return [
            {
                key: "This data in this map was compiled by Maria Powell and her team for a forthcoming publication",
                value: (
                    <>
                        Powell, M.E., Salvi Cruz, S., Farb, A., Prasad
                        Kodibagkar, A., Ghosh, S., Rudzicz, F., Rameau, A.,
                        Bensoussan, Y., “Towards Protocol Harmonization: A
                        Scoping Review of Publicly-Accessible Speech and Voice
                        Datasets in Three Voice-Affecting Disease Cohorts,”
                        <i>Journal of Speech, Language, and Hearing Research</i>
                        , Forthcoming.
                    </>
                ),
            },
            {
                key: "Country Borders and Names",
                value: "Natural Earth",
                url: "https://www.naturalearthdata.com/downloads/10m-cultural-vectors/",
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
            <div className={styles.header}>
                <div className={styles.headerTexts}>
                    <h1 className={styles.headerText}>
                        Global Voice Datasets Repository Map
                    </h1>
                    <h3 className={styles.subheaderText}>
                        Accessibility, Licensing, and Research Ethics
                    </h3>
                </div>
            </div>
            <CardSection
                title="About"
                descriptions={[
                    "This map tracks publicly accessible speech and voice datasets collected for neurological, mood, and speech disorder research in different countries. Information about the institutional source of the datasets, the number of speakers, languages, and types of voice samples are included, but the focus of the map is on the governance of these voice datasets. The type of accessibility (open or safeguarded), access instructions, and licensing are detailed and can be compared between datasets, institutions, and countries/regions. This map complements a forthcoming searchable tool that can be used to find voice datasets specific to disease categories, diagnoses, or vocal tasks.",
                    "In an upcoming iteration of the map, a research ethics element will be added to the dataset information, focusing on the informed consent process that participants went through to contribute their voice data. The aim is to provide information about the research ethics process and related documentation (e.g., consent forms, IRB/REB documentation) to make these datasets more easily useable for researchers whose institutions have stringent data governance requirements.",
                ]}
            />
            <CardSection
                title="Contact"
                descriptions={[
                    <>
                        You can contact us with questions, comments, or
                        information about other voice datasets for health
                        research by emailing:{" "}
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
            <CardSection
                title="Suggested Citation"
                descriptions={[
                    <div
                        key="suggested-citation"
                        className={styles.suggestedCitation}
                    >
                        <div className={styles.suggestedCitationTitle}>
                            To cite the Global Voice Datasets Repository Map,
                            please use the following citation:
                        </div>
                        Alden Blatter, Hortense Gallois, Samantha Salvi Cruz,
                        Yael Bensoussan, Bridge2AI Voice Consortium, Maria
                        Powell, Jean-Christophe Bélisle-Pipon. (2025). “Global
                        Voice Datasets Repository Map.” Voice Data Governance.
                        Retrieved Month Day, Year, from{" "}
                        <a href="https://map.b2ai-voice.org/">
                            https://map.b2ai-voice.org/
                        </a>
                        .
                    </div>,
                ]}
            ></CardSection>
            <CardSection title="Attributions">
                <div className={styles.attributions}>{attributions}</div>
            </CardSection>
        </>
    );
};

export default ProjectInfo;
