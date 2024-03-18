"use client";

import { useEffect, useState } from "react";
import styles from "../music.module.css";
import { AlbumFilters, fetchAlbumData } from "../modules/api";
import { usePathname } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";
import React from "react";
import {
  AlbumInfo,
  albumDataAtom,
  artistPath,
  criteriaAtom,
  defaultTags,
  methodAtom,
  postPath,
  scrollCountArrayAtom,
  scrollCountAtom,
  scrollPositionAtom,
} from "../modules/data";
import { useInView } from "react-intersection-observer";
import "aos/dist/aos.css";
import Aos from "aos";
import { ContentLayout } from "./ContentLayout";
import Link from "next/link";
import { BlurImg } from "./BlurImage";
import { isMobile } from "react-device-detect";
import { Loading } from "./Loading";

interface GridProps {
  initialData: AlbumInfo[];
  totalScrollCount: number;
}

export const Grid = ({ initialData, totalScrollCount }: GridProps) => {
  const pathName = usePathname();
  const [data, setData] = useAtom(albumDataAtom);
  const [perPageCount, setPerPageCount] = useState(50);
  const [scrollCount, setScrollCount] = useAtom(scrollCountAtom);
  // const [scrollCountArray, setScrollCountArray] = useAtom(scrollCountArrayAtom);
  const [scrollPosition, setScrollPosition] = useAtom(scrollPositionAtom);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });
  const method = useAtomValue(methodAtom);
  const criteria = useAtomValue(criteriaAtom);
  const [showAllTagItems, setShowAllTagItems] = useState<boolean>(false);
  const [currentTagKey, setCurrentTagKey] = useState<string>("");

  useEffect(() => {
    Aos.init();
  }, []);

  useEffect(() => {
    if (inView) {
      if (scrollCount < totalScrollCount) {
        setScrollCount(prevCount => prevCount + 1);
        // setScrollCountArray(prevArray => [...prevArray, String(scrollCount + 1)]);
      }
    }
  }, [inView]);

  useEffect(() => {
    async function loadData(perPageCount: number, scrollCount: number) {
      const albumFilters: AlbumFilters = {
        perPageCount: perPageCount,
        currentPage: scrollCount,
        currentMethod: "별점",
        currentCriteria: criteria,
        currentTagKey: currentTagKey,
      };

      const albumResult = await fetchAlbumData({
        pathName: "",
        albumFilters,
      });

      if (albumResult) {
        setData(prevData => [...prevData, ...albumResult.slicedData]);
      }
    }

    // 메인화면으로 진입한 경우
    if (scrollCount === 1) {
      setData(initialData);
    } else if (data.length >= 2 && scrollCount > 1 && scrollCount < totalScrollCount) {
      loadData(perPageCount, scrollCount);
    }
  }, [method, criteria, scrollCount, perPageCount, currentTagKey, initialData]);

  useEffect(() => {
    if (scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
      setScrollPosition(0);
    }
  }, []);

  return (
    <ContentLayout currentPage={scrollCount} perPageCount={perPageCount} totalDataLength={0}>
      {data.length < 1 && <Loading />}
      <div
        className={styles["tag-display-container"]}
        style={
          showAllTagItems ? { flexWrap: "wrap", paddingRight: "31px" } : { flexWrap: "nowrap" }
        }
      >
        {Object.keys(defaultTags).map((key, index) => {
          return (
            <div
              key={index}
              className={styles["tag-display-item"]}
              onClick={() => {
                setCurrentTagKey(key);
                setScrollCount(1);
              }}
              style={
                currentTagKey === key || (currentTagKey === "" && key === "all")
                  ? { border: "1px solid var(--text-color)" }
                  : undefined
              }
            >
              {defaultTags[key]}
            </div>
          );
        })}
        <div
          className={styles["arrow-down-container"]}
          onClick={() => {
            setShowAllTagItems(!showAllTagItems);
          }}
        >
          <img
            className={styles["arrow-down"]}
            src={showAllTagItems ? "/music/arrow-up.svg" : "/music/arrow-down.svg"}
            alt="arrow-down"
          />
        </div>
      </div>
      {/* Grid Items */}
      <div className={styles["grid-div"]}>
        {data.map((item, index) => {
          const currentDataLength = data.length;
          const isLastDataAndOddNumber =
            index === currentDataLength - 1 && currentDataLength % 2 === 1;
          const isLastItem = index + 1 === data.length;
          const imgSrc = item.imgUrl;
          const blurhash = item.blurHash ?? "";

          return isLastDataAndOddNumber ? null : (
            <div
              data-aos="fade-up"
              data-aos-duration={800}
              data-aos-offset={isMobile ? 40 : 90}
              // data-aos-offset={90}
              data-aos-once="true"
              key={index}
              className={`${styles["grid-item-container"]}`}
              ref={isLastItem ? ref : undefined}
            >
              <Link
                href={postPath(pathName, item.id)}
                onClick={() => {
                  setScrollPosition(window.scrollY);
                }}
              >
                <BlurImg
                  className={styles["grid-album-image"]}
                  blurhash={blurhash}
                  src={imgSrc}
                  punch={1}
                />
                {/* <img
                      className={styles["grid-album-image"]}
                      src={item.imgUrl}
                      alt={item.album}
                    /> */}
              </Link>
              <div className={styles["grid-album-title"]}>
                <Link href={postPath(pathName, item.id)}>
                  <button
                    className={`${styles["black-masking"]}  ${styles["grid-album-title-masking"]}`}
                  >
                    {`${item.album}`}
                  </button>
                </Link>
                <br />
                <Link href={artistPath(pathName, item.artistId)}>
                  <button
                    className={`${styles["black-masking"]}  ${styles["grid-album-title-masking"]}`}
                  >
                    {`${item.artist}`}
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </ContentLayout>
  );
};
