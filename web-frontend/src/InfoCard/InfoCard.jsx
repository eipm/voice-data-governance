import { useSelector } from "react-redux";
import Card from "../Card/Card";
import CountryInfo from "../CountryInfo/CountryInfo";
import InfoCardResizeHandle from "../InfoCardResizeHandle/InfoCardResizeHandle";
import ProjectInfo from "../ProjectInfo/ProjectInfo";
import StateInfo from "../StateInfo/StateInfo";
import styles from "./InfoCard.module.css";

const InfoCard = () => {
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    const focusedState = useSelector((state) => state.main.focusedState);
    const menuWidthPx = useSelector((state) => state.main.menuWidthPx);
    let content;
    if (focusedState) {
        content = <StateInfo />;
    } else if (focusedCountry) {
        content = <CountryInfo />;
    } else {
        content = <ProjectInfo />;
    }
    return (
        <Card
            className={styles.container}
            style={{ width: `${menuWidthPx}px` }}
        >
            <InfoCardResizeHandle />
            <div className={styles.content}>{content}</div>
        </Card>
    );
};

export default InfoCard;
