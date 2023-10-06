import { isEmpty } from 'lodash'
import { Empty, Pagination, Table } from 'antd'
import { EUserType } from '../../../api/types'
import Icon from '@/components/Icon'
import { useEffect, useRef, useState } from 'react'
import { ColumnsType } from 'antd/lib/table'

const iconMap: Record<string, string> = {
  '2': 'status-teacher.png',
  '4': 'status-ta.png',
  '5': 'status-admin.png'
}
interface DataType {
  name: string
  age: string
  gender: string
  tag: string
}

const StudentList = (props: { data?: any[], pageChange?: (pageHeight?: number) => void, isMobile: boolean | undefined }) => {
  const { data } = props;
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageNum, setPageNum] = useState<number>(0);
  const [list, setList] = useState<any[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      align: "center",
      width: 80,
      render: (_, row, index) => index + 1 + pageNum * pageSize
    },
    {
      title: '昵称',
      dataIndex: 'name',
      key: 'name',
      align: "center"
    },
    {
      title: '年级',
      dataIndex: 'age',
      key: 'age',
      align: "center",
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      align: "center",
    },
    {
      title: '备注',
      dataIndex: 'tag',
      key: 'tag',
      align: "center",
    },
  ];

  useEffect(() => {
    setList(data?.slice(pageNum * pageSize, (pageNum + 1) * pageSize) || [])
  }, [data, pageSize, pageNum])

  useEffect(() => {
    props.pageChange && props.pageChange(ref.current?.clientHeight || 0)
  }, [pageSize, pageNum])

  if (isEmpty(props.data)) {
    return (
      <div className="studentlist-wrap">
        <Empty />
      </div>
    )
  }

  if (props.isMobile) {
    return (
      <div className="list-mobile">
        {
          props.data?.map((student, index) => {
            return <div key={student.id} className="list-item">
              <div className="list-item-index">{index + 1}</div>
              <div className="list-item-main-info">
                <div className="info-name">
                  {student.name}
                  {student.status !== EUserType.STUDENT && (
                    <img
                      height="14"
                      src={`/img/${iconMap[student.status]}`}
                      alt="student-status-png"
                    ></img>
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
          })
        }
      </div>
    )
  }

  return (
    <div ref={ref} className="list-wrap">
      <Table columns={columns} dataSource={list} pagination={false} />
      <div className='paging-wrap'>
        <Pagination
          showTotal={(e) => "共 " + e + " 人"}
          defaultCurrent={1} total={data?.length}
          onChange={(e) => { setPageNum(e - 1) }}
          onShowSizeChange={(current, pageSize) => { setPageSize(pageSize) }}
          pageSize={pageSize}
          showQuickJumper
        />
      </div>
    </div>
  )
}

export default StudentList
