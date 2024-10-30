import styles from "./CardSection.module.css";

const CardSection = ({ title, descriptions, children, className }) => {
    return (
        <div className={`${styles.container} ${className ?? ""}`}>
            {title !== undefined && <h2 className={styles.title}>{title}</h2>}
            {descriptions !== undefined &&
                descriptions.map((description, index) => {
                    return (
                        <p key={index} className={styles.description}>
                            {description}
                        </p>
                    );
                })}
            {children}
        </div>
    );
};

export default CardSection;
