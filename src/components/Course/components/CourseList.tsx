/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../../../api";
import Loading from "../../Loading";
import Icon from "../../Icon";
import { useRouter } from "next/router";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ICourse } from "@/api/types";
import { ActionType } from "@/constants";
// import './index.scss'
export enum ELayoutType {
  LIST = "LIST",
  GRID = "GRID",
}

export const layoutPrifix = "course-layout-type";
const CourseList = ({ courses, isHide, isLiving = false }: { courses: ICourse[], isHide: boolean, isLiving?: boolean }) => {
  const [layout, setLayout] = useState(ELayoutType.LIST);
  const { t } = useTranslation()
  const data = courses
  if (!courses) {
    return <Loading />;
  }
  const isGrid = layout === ELayoutType.GRID;
  const changeLayout = () => {
    const layout = isGrid ? ELayoutType.LIST : ELayoutType.GRID;
    setLayout(layout);
    localStorage.setItem(layoutPrifix, layout);
  };
  return (
    <div
      style={{ display: isHide ? 'none' : '' }}
      className={`course-list ${isGrid ? "course-list-layout-grid" : "course-list-layout-list"
        }`}
    >
      <span className="layout-icon" onClick={changeLayout}>
        {/* {isGrid ? <UnorderedListOutlined /> : <AppstoreOutlined />} */}
        <Icon symbol={isGrid ? 'icon-listgrid' : 'icon-list'} />
      </span>
      {data.map((item) => (
        <Link
          key={item.id}
          target="_blank"
          className="course-item"
          href={`/${item.courseId}`}
        >
          {isLiving && <span className="living-icon">
            {item.classStatus === ActionType.START_CLASS && t('course.status.living')}
            {item.classStatus === ActionType.BOOK_CLASS && t('course.status.upcoming')}
          </span>}
          <img className="course-item-cover" src={item.coverUrl} alt="coverUrl" />
          <div className="course-item-content">
            <div className="course-item-info">
              <div className="info-title">{item.title}</div>
              <div className="summary">{item.summary}</div>
            </div>
            <footer>
              <span className="apply-num">
                <span className="apply-num-person">{item.applyCount}</span>{" "}
                {t('home_page.content.registrations')}
              </span>
              <span className="apply-price">{"¥" + item.price}</span>
            </footer>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CourseList;
