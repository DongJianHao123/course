import { isEmpty, set } from 'lodash'
import { Button, Empty, Input, Pagination, Popover, Space, Table, Tag, Tooltip, message } from 'antd'
import { EUserType, IMyRegister } from '../../../api/types'
import Icon from '@/components/Icon'
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { useTranslation } from 'react-i18next'
import useOptions from '@/hooks/useOptions'
import { ClientContext } from '@/store/context/clientContext'
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import { updateStudent } from '@/api'
import { useStore } from '@/store'
import { MyRegisters } from '@/store/stores/myRegistersStore'
import { Modal } from 'antd-mobile'
import { RoleNameMap } from '@/constants'

const iconMap: Record<string, string> = {
  '2': 'status-teacher.png',
  '4': 'status-ta.png',
  '5': 'status-admin.png'
}
type Role = {
  label: string,
  color?: string,
  value: string
}


const StudentList = (props: { data: any[], setData: Dispatch<SetStateAction<any[]>>, pageChange?: (pageHeight?: number) => void, isMobile: boolean | undefined }) => {
  // const { data } = props;
  let data = props.data;
  let setData = props.setData

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

  const roleList: Role[] = [
    {
      label: t('common.role.student'),
      color: 'cyan',
      value: EUserType.STUDENT,
    },
    {
      label: t('common.role.teacher'),
      color: 'geekblue',
      value: EUserType.TEACHER,
    },
    // {
    //   label: t('common.role.visitor'),
    //   value: EUserType.VISITOR,
    // },
    {
      label: t('common.role.TA'),
      color: 'blue',
      value: EUserType.TUTOR,
    },
    // {
    //   label: t('common.role.admin'),
    //   value: EUserType.ADMIN,
    // },
  ]
  const getRole = (role: string) => {
    return roleList.find((item) => item.value === role)!
  }

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
      width: 260,
      align: "center",
      render: (name, row, index) => {
        const role = getRole(row.status);
        const content = <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 15 }}>
          {roleList.filter(item => item.value !== role.value).map(item => <li style={{ cursor: 'pointer' }} onClick={(e) => { changeRole(row, index, item) }} key={item.value}><Tag color={item.color}>{item.label}</Tag></li>)}
        </ul>
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
            : <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1,textAlign:'right' }}>{name} </span>
                <Tooltip placement="top" title={t('common.button.edit')}>
                  <Button type="link" shape="circle" onClick={() => nameEdit(row, index)} icon={<EditOutlined />} />
                </Tooltip>
              </div>
              {role && <Popover placement="right" title={'修改角色'} content={content} trigger="click">
                <Tag style={{ cursor: 'pointer' }} color={role.color}>{role.label}</Tag>
              </Popover>}
            </div>
        } else {
          return <div style={{ display: 'flex' }}><span style={{ flex: 1 }}>{name} </span>{role && role.value !== EUserType.STUDENT && <Tag color={role.color}>{role.label}</Tag>}</div>
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
  const changeRole = (row: IMyRegister, index: number, role: Role) => {
    Modal.confirm({
      content: t('course.table.edit.role_modal', { role: role.label }),
      closeOnMaskClick: true,
      confirmText: t('common.button.confirm'),
      onConfirm: () => {
        updateStudent({
          id: row.id,
          status: role.value
        }).then((res) => {
          message.success(t('course.table.edit.edit_success'))
          let realIndex = index + pageSize * pageNum
          data[realIndex].status = role.value
          updateStoreInfo(row, { status: role.value })
          setData([...data])
        }).catch((err) => {
          message.error(t('course.table.edit.edit_error'))
        })
      },
      cancelText: t('common.button.cancel')
    })
  }

  const nameEdit = (row: IMyRegister, index: number) => {
    if (isEdit) {
      if (editName) {
        Modal.confirm({
          content: t('course.table.edit.name_modal'),
          closeOnMaskClick: true,
          confirmText: t('common.button.confirm'),
          onConfirm: () => {
            updateStudent({
              id: row.id,
              name: editName
            }).then((res) => {
              message.success(t('course.table.edit.edit_success'))
              let realIndex = index + pageSize * pageNum
              data[realIndex].name = editName
              updateStoreInfo(row, { name: editName })
              setData([...data])
              setIsEdit(false)
            }).catch((err) => {
              message.error(t('course.table.edit.edit_error'))
              setIsEdit(false)
            })
          },
          cancelText: t('common.button.cancel'),
          onCancel: () => { setIsEdit(false) }
        })
      } else {
        message.warn(t("course.table.edit.edit_empty"))
      }
    } else {
      setEditName(row.name)
      setIsEdit(true)
    }
  }
  
  const updateStoreInfo = (row: IMyRegister, obj: any) => {
    let storeIndex = myRegisters.myRegisters?.findIndex((item) => item.id === row.id)!;
    let registers = myRegisters.myRegisters!
    registers[storeIndex] = { ...registers[storeIndex], ...obj };
    myRegisters.setMyRegisters([...registers])
  }

  useEffect(() => {
    setList(data?.slice(pageNum * pageSize, (pageNum + 1) * pageSize) || [])
    console.log(data);
  }, [data, pageSize, pageNum])
  useEffect(() => {
    props.pageChange && props.pageChange(ref.current?.clientHeight || 0)
  }, [list.length])

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
          data.map((student, index) => {
            return <div key={student.id} className="list-item" style={user === student.phone ? { border: '1px solid #00000090' } : {}}>
              <div className="list-item-index">{index + 1}</div>
              <div className="list-item-main-info">
                <div className="info-name">
                  {
                    student.phone === user ?
                      isEdit ? <Space.Compact style={{ width: '100%' }}>
                        <Input autoFocus bordered={false} style={{ borderBottom: "1px solid #ccc" }} onBlur={() => setIsEdit(false)} onPressEnter={() => nameEdit(student, index)} value={editName} onChange={(e) => setEditName(e.target.value)} />
                        <Button type="link" icon={<CheckOutlined />} onClick={() => nameEdit(student, index)} />
                      </Space.Compact>
                        : <span onClick={() => nameEdit(student, index)}>
                          <span>{student.name}</span>
                          <Button type="link" shape="circle" icon={<EditOutlined />} />
                        </span>
                      : student.name}
                  {student.status !== EUserType.STUDENT && (
                    <img
                      height="14"
                      src={`/course/img/${iconMap[student.status]}`}
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
