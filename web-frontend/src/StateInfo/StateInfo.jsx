import { useDispatch, useSelector } from "react-redux";
import { getStateDatasets } from "../datasets/getEntityDatasets";
import { getStateWord } from "../entities/getStateWord";
import EntityInfo from "../EntityInfo/EntityInfo";
import mainSlice from "../mainSlice";
import { useFlyToEntity } from "../map/useFlyToEntity";

const StateInfo = () => {
    const dispatch = useDispatch();
    const flyToEntity = useFlyToEntity();
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    const focusedState = useSelector((state) => state.main.focusedState);
    if (!focusedCountry || !focusedState) {
        return null;
    }
    const onClickBack = () => {
        dispatch(mainSlice.actions.setFocusedState(null));
        flyToEntity(focusedCountry);
    };
    return (
        <EntityInfo
            title={`${focusedState.name}, ${focusedCountry.name}`}
            extraDescriptions={[
                `${getStateWord(focusedCountry.codeIso3)} Name: ${focusedState.name}`,
                `Country Name: ${focusedCountry.name}`,
            ]}
            getDatasets={() =>
                getStateDatasets(
                    focusedCountry.codeIso3,
                    focusedState.stateCode,
                )
            }
            onClickBack={onClickBack}
        />
    );
};

export default StateInfo;
