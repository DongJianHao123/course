import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../../api";
import Loading from "../../components/Loading";
import Icon from "../../components/Icon";
import { useRouter } from "next/router";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import Link from "next/link";
// import './index.scss'
export enum ELayoutType {
  LIST = "LIST",
  GRID = "GRID",
}

export const layoutPrifix = "course-layout-type";
const CourseList = ({courses}: {courses:any[]}) => {
  const [layout, setLayout] = useState(ELayoutType.LIST);
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
      className={`course-list ${
        isGrid ? "course-list-layout-grid" : "course-list-layout-list"
      }`}
    >
      <span className="layout-icon" onClick={changeLayout}>
        {/* {isGrid ? <UnorderedListOutlined /> : <AppstoreOutlined />} */}
        <Icon symbol={isGrid ? 'icon-listgrid' : 'icon-list'} />
      </span>
      {data.map((item) => (
        <Link
          key={item.id}
          // target="_blank"
          className="course-item"
          href={`/course/${item.courseId}`}
        >
          <img
            className="course-item-cover"
            src={item.coverUrl}
            alt="coverUrl"
          />
          <div className="course-item-content">
            <div className="course-item-info">
              <div className="info-title">{item.title}</div>
              <div className="summary">{item.summary}</div>
            </div>
            <footer>
              <span className="apply-num">
                <span className="apply-num-person">{item.applyCount}</span>{" "}
                人报名学习
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
