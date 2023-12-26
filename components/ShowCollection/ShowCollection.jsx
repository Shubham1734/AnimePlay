import styles from "./ShowCollection.module.scss";
import Link from "next/link";

const ShowCollection = ({
  ShowList,
  CrossButtonStatus,
  CrossButtonFunction,
  maxWidth,
}) => {
  return (
    <div className={styles.ShowCollection} style={{ maxWidth: maxWidth }}>
      {ShowList.length === 0 && (
        <div style={{ fontSize: "large" }}>No Result Found</div>
      )}
      {ShowList.map((item, index) => {
        return (
          <Link
            href={`/${item.showId}`}
            key={index}
            className={
              styles.Show + " " + (!CrossButtonStatus ? styles.AddHover : "")
            }
          >
            <img src={item.poster} alt="" />
            <div className={styles.details}>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.type}>{item.type}</div>
            </div>
            {CrossButtonStatus && (
              <button
                className={styles.CrossButton}
                onClick={(e) => {
                  e.preventDefault();
                  CrossButtonFunction(item.showId);
                }}
              >
                X
              </button>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default ShowCollection;
