import { useDispatch, useSelector } from "react-redux";
import { getCountryDatasets } from "../datasets/getEntityDatasets";
import EntityInfo from "../EntityInfo/EntityInfo";
import mainSlice from "../mainSlice";
import { getMap, useZoomTo } from "../map/map";

const CountryInfo = () => {
    const zoomTo = useZoomTo();
    const dispatch = useDispatch();
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    if (!focusedCountry) {
        return null;
    }
    const onClickBack = () => {
        dispatch(mainSlice.actions.setFocusedCountry(null));
        dispatch(mainSlice.actions.setFocusedState(null));
        zoomTo(getMap().getZoom() - 0.3, 1000);
    };
    return (
        <EntityInfo
            title={focusedCountry.name}
            extraDescriptions={[`Country Name: ${focusedCountry.name}`]}
            getDatasets={() => getCountryDatasets(focusedCountry.codeIso3)}
            onClickBack={onClickBack}
        />
    );
};

export default CountryInfo;
