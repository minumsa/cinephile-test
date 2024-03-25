import React from "react";
import styles from "./cinephile.module.css";
import { questions, negativeWord } from "../modules/questions";
import { BlurImg } from "./BlurImage";

interface AnswerProps {
  answers: (number | string)[];
}

export default function Answer({ answers }: AnswerProps) {
  return (
    <div>
      {questions.map((item, dataIndex) => {
        const answer = answers[dataIndex];
        const hasNegativeWord = item.question
          .split(" ")
          .some(element => negativeWord.includes(element));
        const blurHash = item.blurHash ? item.blurHash : "";

        return (
          <div
            className={`${styles["question-container"]} ${styles["commentary-container"]}`}
            key={dataIndex}
          >
            <div className={styles["question"]}>
              {`${[dataIndex + 1]}. `}
              {hasNegativeWord ? (
                negativeWord.map((word, index) => {
                  if (item.question.includes(word)) {
                    const text = item.question.split(word);
                    return (
                      <React.Fragment key={index}>
                        <span>{text[0]}</span>
                        <span className={styles["negative-word"]}>{word}</span>
                        <span>{text[1]}</span>
                      </React.Fragment>
                    );
                  } else {
                    return null;
                  }
                })
              ) : (
                <>
                  <span>{item.question}</span>
                  {item.type === "short-answer" ? (
                    <span className={styles["user-answer"]}>
                      {item.answer !== answer ? answer : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
            {item.type === "multiple-choice" ? (
              <>
                {item.type2 === "image" ? (
                  <div className={styles["image-container"]}>
                    <BlurImg src={`/cinephile/${item.title}.webp`} blurHash={blurHash} punch={1} />
                  </div>
                ) : item.title === "chungking-express" ? (
                  <>
                    <div className={styles["chungking-express"]}>📞 🍍 🕒 😎</div>
                    <div className={styles["chungking-express"]}>👮‍♂️ 💌 🔑 🛫</div>
                  </>
                ) : null}
                {item.options?.map((option, index) => {
                  return (
                    <div
                      key={index}
                      className={`${styles["options"]} ${styles["options-commentary"]}`}
                      style={{
                        cursor: "default",
                        backgroundColor:
                          index === questions[dataIndex].answer ? "#000000" : undefined,
                        color: index === questions[dataIndex].answer ? "#ffffff" : undefined,
                      }}
                    >
                      {`${index + 1}) ${option}`}
                      {index === answer && questions[dataIndex].answer !== answer ? (
                        <span className={styles["user-answer"]}>X</span>
                      ) : (
                        ""
                      )}
                      {index === questions[dataIndex].answer && questions[dataIndex].caption ? (
                        <span
                          className={styles["caption"]}
                        >{`// ${questions[dataIndex].caption}`}</span>
                      ) : null}
                      {index === questions[dataIndex].answer && questions[dataIndex].reference ? (
                        <a href={questions[dataIndex].reference} target="_blank">
                          <div className={styles["reference"]}>
                            <span
                              className={`${styles["reference-text"]} ${styles["reference-text-dark"]} `}
                            >
                              관련 자료
                            </span>
                          </div>
                        </a>
                      ) : null}
                    </div>
                  );
                })}
              </>
            ) : item.type === "short-answer" ? (
              <div className={styles["short-answer-container"]}>
                {item.paragraph?.split(String(item.answer)).map((text, index) => {
                  return index === 0 ? (
                    <React.Fragment key={index}>{text}</React.Fragment>
                  ) : (
                    <React.Fragment key={index}>
                      <span className={styles["options-selected"]}>{item.answer}</span>
                      {text}
                    </React.Fragment>
                  );
                })}
                {item.reference ? (
                  <a href={questions[dataIndex].reference} target="_blank">
                    <div className={styles["reference"]}>
                      <span className={styles["reference-text"]}>관련 자료</span>
                    </div>
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
