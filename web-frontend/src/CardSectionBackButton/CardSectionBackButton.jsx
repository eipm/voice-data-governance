import { FaChevronLeft } from "react-icons/fa";
import CardSection from "../CardSection/CardSection";
import styles from "./CardSectionBackButton.module.css";

const CardSectionBackButton = ({ onClick }) => {
    return (
        <CardSection className={styles.container}>
            <div className={styles.back} onClick={onClick}>
                <FaChevronLeft size={12} />
                <div className={styles.backText}>Back</div>
            </div>
        </CardSection>
    );
};

export default CardSectionBackButton;
