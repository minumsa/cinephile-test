import styles from "../music.module.css";

interface LoadingProps {
  // dataLength: number | undefined;
  isLoading: boolean;
  isEmptyResult?: boolean;
}

export const Loading = ({ isLoading, isEmptyResult }: LoadingProps) => {
  const loadingText = "데이터 로딩 중입니다...";
  const noDataText = "일치하는 데이터가 없습니다...";
  // const hasNoData = dataLength === 0;

  // return(
  //   <div className={styles["loading-container"]}>
  //     <div className={styles["loading-circle"]}></div>
  //   </div>
  // );
  return (
    <>
      <div
        className={styles["loading-background"]}
        style={{ opacity: isLoading ? "80%" : undefined }}
      ></div>
      <div className={styles["loading-text"]}>{isEmptyResult ? noDataText : loadingText}</div>
    </>
  );
};
