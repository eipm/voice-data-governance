import classNames from "classnames";
import styles from "./Header.module.css";

const Header = ({ isMobile }) => {
    return (
        <div
            className={classNames(styles.container, {
                [styles.isMobile]: isMobile,
            })}
        >
            <img src="wave.png" className={styles.waveImage} />
            <img
                src="bridge2aivoice.png"
                className={styles.bridge2AiImage}
                alt="Bridge2AI Voice"
            />
        </div>
    );
};

export default Header;
