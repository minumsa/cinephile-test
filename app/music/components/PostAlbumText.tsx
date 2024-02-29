import { renderToString } from "react-dom/server";
import { AlbumInfo, defaultTags, isAdminPage } from "../modules/data";
import { formatDate } from "../modules/utils";
import styles from "../music.module.css";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import Link from "next/link";

interface PostTextProps {
  albumData: AlbumInfo;
}

export const PostText = ({ albumData }: PostTextProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();
  // const sanitizer = DOMPurify.sanitize;

  // HTML을 string 형태로 바꾸기 위한 부분
  const HTMLToString = (htmlData: any) => {
    return (
      // <div>
      //   <p className={styles["paragraph"]}>
      //     악뮤 이찬혁의 독창적이고 감각적인 음악 세계를 담은 첫 솔로 앨범. 지금 공간 음향으로
      //     만나세요.
      //   </p>
      //   <div style={{ width: "100%", marginTop: "2rem" }}>
      //     <img
      //       src="https://www.jeonmae.co.kr/news/photo/202210/917522_608251_352.jpg"
      //       alt="akmu"
      //       loading="lazy"
      //       style={{ width: "100%" }}
      //     />
      //   </div>
      // </div>
      renderToString(htmlData)
    );
  };

  return (
    <article className={styles["post-content-container"]}>
      {/* FIXME: 안전하게 바꾸기 */}
      {albumData.text.includes("div") && (
        <div
          style={{ width: "100%" }}
          // dangerouslySetInnerHTML={{
          //   __html: sanitizer(data.text),
          // }}
        />
      )}
      {albumData.text.split("\n").map((text, index) => {
        const isLineBreak = text === "";
        const isParagraphTitle =
          (text.length < 50 && !text.includes(".") && !text.includes("[")) ||
          text.includes("feat.");
        const isHTMLText = text.includes("<div>");
        // text에 포함된 [숫자] 형태의 문자열을 정규 표현식을 통해 제거

        return isLineBreak ? (
          <p key={index}></p>
        ) : isHTMLText ? undefined : (
          <p
            key={index}
            className={styles["paragraph"]}
            style={isParagraphTitle ? { fontWeight: 600, marginTop: "40px" } : undefined}
          >
            {text}
          </p>
        );
      })}
      <div
        className={styles["album-tag-container"]}
        style={{ margin: "20px 0 0 0", justifyContent: "flex-end" }}
      >
        {albumData.tagKeys.map((tagKey: string, index: number) => {
          return (
            <Link
              href={
                isAdminPage(pathName)
                  ? `/music/admin/search/tag/${tagKey}/1`
                  : `/music/search/tag/${tagKey}/1`
              }
              key={index}
              className={styles["tag-item"]}
            >
              {defaultTags[tagKey]}
            </Link>
          );
        })}
      </div>
      <div className={styles["post-divider"]}></div>
      <div className={styles["post-date-container"]}>
        <div className={styles["post-date"]} style={{ margin: "0 0 -4px 0" }}>
          작성일
        </div>
        <div>{formatDate(albumData.uploadDate.toString())}</div>
      </div>
    </article>
  );
};
