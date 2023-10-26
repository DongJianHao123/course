import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Radio, Select, AutoComplete } from "antd";
import { ActionType, CLIENT_ID, RoleNameMap, USER_INFO_STORAGE_KEY } from "../../constants";
import { registerCourse, sendEmail, studentAction } from "../../api";
import { IMyRegister, RoomActionType } from "../../api/types";
import { useStore } from "@/store";
import { Utils } from "@/common/Utils";
import { useTranslation } from "react-i18next";
import useOptions from "@/hooks/useOptions";
interface IProps {
  courseInfo: any;
  applyStudents?: any[];
  defaultVisible?: boolean;
  onRegisterCourse?: (newCourse: IMyRegister) => void;
  isSpecial?: boolean
  styles?: any
}

interface IFromProps {
  status: string | number;
  name: string;
  gender: string;
  age: string;
  tag: string;
  how: string;
}


export const verify_rules = {
  NONE: "0",
  ONLY_ROOM: "1",
  ONLY_PLAYBACK: "2",
  ALL_RIGNHT: "3"
}



const RegisterForm = (props: {
  courseInfo: any;
  onSubmit: (values: IMyRegister) => void | Promise<boolean>;
}) => {
  const [form] = Form.useForm<IFromProps>();
  const store = useStore();
  const [loading, setLoading] = useState<boolean>(false)
  const client = store.client.client;
  const onFinish = Utils.common.throttle(async (values: IFromProps) => {
    setLoading(true)
    const now = new Date();
    let data: any = { ...values };

    if (data.status == 2 && !data.name.endsWith("老师")) {
      data.name = data.name + "老师";
    }
    data.status = data.status || 1;
    data.phone = localStorage.getItem(USER_INFO_STORAGE_KEY);
    data.clientId = props.courseInfo.clientId;
    data.courseId = props.courseInfo.courseId;
    data.uniCourseId = props.courseInfo.id;
    data.course = props.courseInfo.title;
    data.verify = props.courseInfo.showqr.toString()
    data.classId = 1;
    data.createdAt = now;
    data.updatedAt = now;

    const newCourse = await registerCourse(data);
    sendRegisterAction(newCourse, data.how)
    !!newCourse && sendEmail({
      content:
        ` 您好，课程《${data.course}》新增一条报名记录：
        姓名：${data.name}，
        性别：${data.gender}，
        年级：${data.age || "未知"}，
        联系方式：${data.phone}，
        报名时间：${new Date().toLocaleString()}，
        来源：${data.how || "其他"}
        备注：${data.tag}，
        链接：${location.href}`,
      subject: `${client.clientName}—课程报名—${data.course}`,
      toEmail: "all@maodou.io"
      // toEmail: "2995251733@qq.com"
    })
    props.onSubmit(newCourse);
    setLoading(false)
  }, 3000);
  const sendRegisterAction = (register: IMyRegister, how: string) => {
    let data: RoomActionType = {
      userId: register.phone,
      userName: register.name,
      role: RoleNameMap[1],
      clientId: client.clientId,
      clientName: client.clientName || "",
      actionType: ActionType.REGISTER,
      description: '来源：' + how,
      actionTime: new Date(),
      courseId: register.courseId,
      courseName: props.courseInfo.title,
      roomId: '100' + CLIENT_ID + (register.courseId as string)
    }
    studentAction(data)
  }

  const { t } = useTranslation()

  const { grade, tags, hows } = useOptions()

  return (
    <Form
      form={form}
      className="normal-form"
      onFinish={onFinish}
      autoComplete="off"
      size="large"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={{ gender: "男", tag: tags[1].value }}
    >
      <h3>{t('register.form.title')}</h3>
      <Form.Item
        label={t('register.form.name')}
        name="name"
        rules={[
          { required: true },
          () => ({
            validator(_, value) {

              if (value === '' || value.trim()) {
                return Promise.resolve(value.trim());
              }
              return Promise.reject(new Error(t('register.form.name_verify')));
            },
          })
        ]}
      >
        <Input placeholder={t('register.form.name_verify')} />
      </Form.Item>

      <Form.Item label={t('register.form.gender')} name="gender">
        <Radio.Group>
          <Radio value="男">{t('register.form.gender_male')}</Radio>
          <Radio value="女">{t('register.form.gender_female')}</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={t('register.form.identity')} name="age">
        <Select>
          {grade.map(({ label, value }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={t('register.form.source')} name="how" className="how">
        <AutoComplete
          options={hows}
          placeholder={t('register.form.source_placeholder')}
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          getPopupContainer={triggerNode => triggerNode.parentElement || new HTMLBodyElement()}
        />
      </Form.Item>

      <Form.Item label={t('register.form.remark')} name="tag">
        <Select>
          {tags.map(({ label, value }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }}>
        <Button loading={loading} style={{ width: "100%" }} type="primary" htmlType="submit">
          {t('common.button.confirm')}
        </Button>
      </Form.Item>
    </Form>
  );
};

const RegisterModal = (props: IProps) => {
  const [visible, setVisible] = useState(props.defaultVisible);
  const store = useStore();

  let myRegisters = store.myRegisters.myRegisters;
  const { t } = useTranslation()
  const handleSubmit = (newCourse: IMyRegister) => {
    store.myRegisters.setMyRegisters((myRegisters || []).concat(newCourse));
    props.onRegisterCourse?.(newCourse);
    setVisible(false);
  }
  return (
    <>
      <button className={props.isSpecial ? props.styles["join-btn"] : "btn"} onClick={() => setVisible(true)}>
        {t('register.action.register_now')}
      </button>
      <Modal
        width={350}
        open={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        maskClosable={false}
      >
        <RegisterForm onSubmit={handleSubmit} courseInfo={props.courseInfo} />
      </Modal>
    </>
  );
};

export default RegisterModal;
