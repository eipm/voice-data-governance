import { useEffect, useState } from "react";
import CardSection from "../CardSection/CardSection";
import CardSectionBackButton from "../CardSectionBackButton/CardSectionBackButton";
import CollapsibleDataset from "../CollapsibleDataset/CollapsibleDataset";

const EntityInfo = ({ title, extraDescriptions, getDatasets, onClickBack }) => {
    const [content, setContent] = useState(null);
    useEffect(() => {
        (async () => {
            const datasets = await getDatasets();
            const numDatasets = datasets.length;
            setContent(
                <>
                    <CardSectionBackButton onClick={onClickBack} />
                    <CardSection
                        title={title}
                        descriptions={[
                            `Number of Datasets: ${numDatasets}`,
                            ...extraDescriptions,
                        ]}
                    />
                    <CardSection title={`Datasets (${numDatasets})`}>
                        {datasets.map((dataset, index) => (
                            <CollapsibleDataset
                                dataset={dataset}
                                key={`${index}-${dataset[0].value}`}
                            />
                        ))}
                    </CardSection>
                </>,
            );
        })();
    }, [extraDescriptions, getDatasets, onClickBack, title]);
    return content;
};

export default EntityInfo;
