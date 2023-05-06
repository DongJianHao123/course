import { find, map } from "lodash";
import { useDeviceDetect } from "@/hooks";
import { useParams } from "react-router-dom";
import { Modal } from "antd-mobile";
import { useRouter } from "next/router";
import { PlayCircleOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import Icon from "@/components/Icon";

const headers = [
  "教室号",
  "课程名称",
  "开始时间",
  "上课地点",
  "备注",
  "课堂回放",
];

const ReplayList = (props: { data?: any[] }) => {
  const md = useDeviceDetect();
  const router = useRouter();
  const store = useStore();
  const { id } = router.query;
  // const { id: courseId } = useParams<{ id: string }>();

  const openReplay = async (replay: any) => {
    return router.push(`${id}/replay/${replay.id}`);
  };
  let myRegisters = store.myRegisters.myRegisters;
  const replayClick = (replay: any) => {
    if (store.user.currentUser?.phone) {
      const registerCourse = find(
        myRegisters,
        (course) => course.courseId === id
      );
      if (registerCourse) {
        let { verify } = registerCourse;
        verify === "1"
          ? openReplay(replay)
          : Modal.alert({
            content: "报名信息审核通过即可观看",
            closeOnMaskClick: true,
          });
      } else {
        Modal.alert({
          content: "请报名后观看",
          closeOnMaskClick: true,
        });
      }
    } else {
      store.login.setLoginDialogVisible(true);
    }
  };

  if (!!md?.mobile()) {
    return (
      <div className="list-mobile">
        {map(props.data, (replay) => (
          <div
            key={replay.id}
            className="list-item"
            onClick={() => replayClick(replay)}
          >
            <div className="list-item-main-info">
              <div className="info-name">
                {replay.className}
                <span className="location-tag">{replay.location}</span>
              </div>
              <div>
                <span className="list-item-label">教室号:</span> {replay.roomId}
              </div>

              <div>
                <span className="list-item-label">开始时间:</span>{" "}
                {replay.startAt}
              </div>
              <div>
                <span className="list-item-label">备注:</span> {replay.remark}
              </div>
            </div>
            <div className="list-item-actions">
              <Icon symbol="icon-bofang" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="list-wrap">
      <table cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>
                <span>{h}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {map(props.data, (replay, index) => (
            <tr key={replay.id}>
              <td className="lalign">
                <span className="index">{index + 1}</span>
                {replay.roomId}
              </td>
              <td>{replay.className}</td>
              <td>{replay.startAt}</td>
              <td>{replay.location}</td>
              <td>{replay.remark}</td>
              <td>
                <span
                  className="player-btn"
                  onClick={() => replayClick(replay)}
                >
                  <Icon symbol="icon-bofang" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default observer(ReplayList);
