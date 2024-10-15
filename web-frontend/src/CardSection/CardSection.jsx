import styles from "./CardSection.module.css";

const CardSection = ({ title, descriptions }) => {
    return (
        <div className={styles.container}>
            {title !== undefined && <h2 className={styles.title}>{title}</h2>}
            {descriptions !== undefined &&
                descriptions.map((description, index) => {
                    return (
                        <p key={index} className={styles.description}>
                            {description}
                        </p>
                    );
                })}
        </div>
    );
};

export default CardSection;
