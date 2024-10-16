import { useSelector } from "react-redux";
import CardSection from "../CardSection/CardSection";

const StateInfo = () => {
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    const focusedState = useSelector((state) => state.main.focusedState);
    return (
        <>
            <CardSection
                title={`${focusedState.name}, ${focusedCountry.name}`}
                descriptions={[
                    `Name: ${focusedState.name}`,
                    `Code: ${focusedState.stateCode}`,
                    `Country name: ${focusedCountry.name}`,
                    `Country code: ${focusedCountry.codeIso3}`,
                ]}
            />
        </>
    );
};

export default StateInfo;
