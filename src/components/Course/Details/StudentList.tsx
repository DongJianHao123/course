import { isEmpty, set } from 'lodash'
import { Button, Empty, Input, Pagination, Space, Table, Tooltip, message } from 'antd'
import { EUserType, IMyRegister } from '../../../api/types'
import Icon from '@/components/Icon'
import { useContext, useEffect, useRef, useState } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { useTranslation } from 'react-i18next'
import useOptions from '@/hooks/useOptions'
import { ClientContext } from '@/store/context/clientContext'
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import { updateStudent } from '@/api'
import { useStore } from '@/store'
import { MyRegisters } from '@/store/stores/myRegistersStore'

const iconMap: Record<string, string> = {
  '2': 'status-teacher.png',
  '4': 'status-ta.png',
  '5': 'status-admin.png'
}

const StudentList = (props: { data: any[], pageChange?: (pageHeight?: number) => void, isMobile: boolean | undefined }) => {
  // const { data } = props;

  const [data, setData] = useState<any[]>([])
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageNum, setPageNum] = useState<number>(0);
  const [list, setList] = useState<IMyRegister[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('')

  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation()
  const { user } = useContext(ClientContext)
  const { grade, tags, genders } = useOptions();
  const { myRegisters } = useStore()

  useEffect(() => {
    data.length < 1 && setData(props.data)
  }, [props.data])
  
  const columns: ColumnsType<IMyRegister> = [
    {
      title: t('course.table.header.index'),
      dataIndex: 'id',
      key: 'id',
      align: "center",
      width: 80,
      render: (_, row, index) => index + 1 + pageNum * pageSize
    },
    {
      title: t('course.table.header.nickname'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      align: "center",
      render: (name, row, index) => {
        if (user && user === row.phone) {
          return isEdit ?
            <Space.Compact style={{ width: '100%' }}>
              <Input autoFocus bordered={false} style={{ borderBottom: "1px solid #ccc" }} onPressEnter={() => nameEdit(row, index)} value={editName} onChange={(e) => setEditName(e.target.value)} />
              <Tooltip placement="top" title={t('common.button.confirm')}>
                <Button type="link" icon={<CheckOutlined />} onClick={() => nameEdit(row, index)} />
              </Tooltip>
              <Tooltip placement="top" title={t('common.button.cancel')}>
                <Button type="link" danger icon={<CloseOutlined />} onClick={() => setIsEdit(false)} />
              </Tooltip>
            </Space.Compact>
            : <span>
              <span>{name}</span>
              <Tooltip placement="top" title={t('common.button.edit')}>
                <Button type="link" shape="circle" onClick={() => nameEdit(row, index)} icon={<EditOutlined />} />
              </Tooltip>
            </span>
        } else {
          return name
        }
      }
    },
    {
      title: t('course.table.header.identity'),
      dataIndex: 'age',
      key: 'age',
      align: "center",
      render: (txt) => grade.find((item) => item.value === txt)?.label
    },
    {
      title: t('course.table.header.gender'),
      dataIndex: 'gender',
      key: 'gender',
      align: "center",
      render: (txt) => genders.find((item) => item.value === txt)?.label
    },
    {
      title: t('course.table.header.remark'),
      dataIndex: 'tag',
      key: 'tag',
      align: "center",
      render: (txt) => tags.find((item) => item.value === txt)?.label
    },
  ];

  const nameEdit = (row: IMyRegister, index: number) => {
    if (isEdit) {
      if (editName) {
        updateStudent({
          id: row.id,
          name: editName
        }).then((res) => {
          message.success(t('course.table.name.edit_success'))
          let realIndex = index + pageSize * pageNum
          data[realIndex].name = editName
          updateStoreInfo(row)
          setData([...data])
          setIsEdit(false)
        }).catch((err) => {
          message.error(t('course.table.name.edit_error'))
          setIsEdit(false)
        })
      } else {
        message.warn(t("course.table.name.edit_empty"))
      }
    } else {
      setEditName(row.name)
      setIsEdit(true)
    }
  }
  const updateStoreInfo = (row: IMyRegister) => {
    let storeIndex = myRegisters.myRegisters?.findIndex((item) => item.id === row.id);
    let registers = myRegisters.myRegisters!
    registers[storeIndex!].name = editName;
    myRegisters.setMyRegisters([...registers])
  }

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
                      src={`../../../../public/img/${iconMap[student.status]}`}
                      alt={iconMap[student.status]}
                    ></img>
                  )}
                </div>

                <div className="info-other">
                  <span className="current-bg">
                    <span className="list-item-label">{t('course.table.header.identity')}:</span> {student.age}
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
          showTotal={(e) => t('course.table.paging.total', { num: e.toString() })}
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
