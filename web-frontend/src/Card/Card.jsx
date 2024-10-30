import styles from "./Card.module.css";

const Card = ({ children, style, className }) => {
    return (
        <div style={style} className={`${styles.container} ${className ?? ""}`}>
            {children}
        </div>
    );
};

export default Card;
