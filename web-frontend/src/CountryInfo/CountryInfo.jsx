import { useSelector } from "react-redux";
import CardSection from "../CardSection/CardSection";

const CountryInfo = () => {
    const countryData = useSelector((state) => state.main.focusedCountry);
    console.log("countryData", countryData);
    return (
        <>
            <CardSection
                title={countryData.name}
                descriptions={[
                    `Name: ${countryData.name}`,
                    `Code: ${countryData.codeIso3}`,
                ]}
            />
        </>
    );
};

export default CountryInfo;
