import { useEffect, useState } from 'react'
import * as api from '../../api'


export interface ITeachar {
  name: string
  avatarUrl: string
  coursesCount: number
  studentsCount: number
  info: string
  tag: string
}

const TeacharList = ({ showAll }: { showAll: boolean }) => {
  const [allTeachars, setAllTeachars] = useState<ITeachar[]>([])

  const loadData = () => {
    api.getTeachars().then((res) => {
      const { teacherList } = res
      setAllTeachars(teacherList)
    })
  }


  useEffect(() => loadData(), [])

  const recommandTeachars = () => {
    return allTeachars.filter((t) => t.tag === 'star')
  }

  const data = showAll ? allTeachars : recommandTeachars()

  return (
    <div className="teachar-recommand">
      {data.map((teachar) => (
        <div key={teachar.name} className="teachar-intro">
          <img src={teachar.avatarUrl} alt="avatar" className="avatar" />
          <div className="info">
            <div className="teachar-title">
              <div className="teachar-name">{teachar.name}老师</div>
              <span className="teachar-tag">
                课程<span>{teachar.coursesCount}</span>
                学生<span>{teachar.studentsCount}</span>
              </span>
            </div>
            <div className="teach-intro">{teachar.info}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default TeacharList
