import { useSelector } from "react-redux";
import CardSection from "../CardSection/CardSection";

const CountryInfo = () => {
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    return (
        <>
            <CardSection
                title={focusedCountry.name}
                descriptions={[
                    `Name: ${focusedCountry.name}`,
                    `Code: ${focusedCountry.codeIso3}`,
                ]}
            />
        </>
    );
};

export default CountryInfo;
