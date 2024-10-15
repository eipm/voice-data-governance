import { useSelector } from "react-redux";
import Card from "../Card/Card";
import CountryInfo from "../CountryInfo/CountryInfo";
import InfoCardResizeHandle from "../InfoCardResizeHandle/InfoCardResizeHandle";
import ProjectInfo from "../ProjectInfo/ProjectInfo";
import styles from "./InfoCard.module.css";

const InfoCard = () => {
    const countryData = useSelector((state) => state.main.focusedCountry);
    const menuWidthPx = useSelector((state) => state.main.menuWidthPx);
    return (
        <Card style={{ width: `${menuWidthPx}px` }}>
            <InfoCardResizeHandle />
            <div className={styles.header}>
                <div className={styles.headerAccent} />
                <h1 className={styles.headerText}>Voice Atlas</h1>
                <div className={styles.headerAccent} />
            </div>
            <div className={styles.content}>
                {countryData === null ? <ProjectInfo /> : <CountryInfo />}
            </div>
        </Card>
    );
};

export default InfoCard;
