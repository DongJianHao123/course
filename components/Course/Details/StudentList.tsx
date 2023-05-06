import { map, isEmpty } from 'lodash'
import { Empty } from 'antd'
import { EUserType } from '../../../api/types'
import { useDeviceDetect } from '@/hooks'
import Icon from '@/components/Icon'
import Image from 'next/image'


const iconMap: Record<string, string> = {
  '2': 'status-teacher.png',
  '4': 'status-ta.png',
  '5': 'status-admin.png'
}

const StudentList = (props: { data?: any[] }) => {
  const md = useDeviceDetect()

  if (isEmpty(props.data)) {
    return (
      <div className="studentlist-wrap">
        <Empty />
      </div>
    )
  }

  if (!!md?.mobile()) {
    return (
      <div className="list-mobile">
        {map(props.data, (student, index) => (
          <div key={student.id} className="list-item">
            <div className="list-item-index">{index + 1}</div>
            <div className="list-item-main-info">
              <div className="info-name">
                {student.name}
                {student.status !== EUserType.STUDENT && (
                  <Image
                    width={14}
                    height={14}
                    src={`/course/img/${iconMap[student.status]}`}
                    alt="student-status-png" />
                )}
              </div>

              <div className="info-other">
                <span className="current-bg">
                  <span className="list-item-label">职业:</span> {student.age}
                </span>
              </div>
            </div>

            <div className={`list-item-gender ${student.gender === '女' ? 'woman' : 'man'}`}>
              {student.gender === '女' ? (
                <Icon symbol="icon-nv" />
              ) : (
                <Icon symbol="icon-xingbienan" />
              )}
            </div>
            <div className="list-item-tag">{student.tag}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="list-wrap">
      <table cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <th>
              <span>昵称</span>
            </th>
            <th>
              <span>年级</span>
            </th>
            <th>
              <span>性别</span>
            </th>
            <th>
              <span>备注</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {map(props.data, (student, index) => (
            <tr key={student.id}>
              <td className="lalign">
                <span className="index">{index + 1}</span>
                <span className="student-name">
                  {student.name}
                  {student.status !== EUserType.STUDENT && (
                    <img
                      width={14}
                      height={14}
                      src={`/course/img/${iconMap[student.status]}`}
                      alt="student-status-png"
                    ></img>
                  )}
                </span>
              </td>
              <td>{student.age}</td>
              <td>{student.gender}</td>
              <td>{student.tag}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentList
