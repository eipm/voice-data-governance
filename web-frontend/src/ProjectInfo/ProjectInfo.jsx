import CardSection from "../CardSection/CardSection";

const ProjectInfo = () => {
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
                        You may contact us with questions or comments by
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
            <CardSection
                title="Attributions"
                descriptions={[
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                ]}
            />
        </>
    );
};

export default ProjectInfo;
