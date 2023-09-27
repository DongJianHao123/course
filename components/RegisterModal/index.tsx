import { useState } from "react";
import { Modal, Form, Input, Button, Radio, Select, AutoComplete } from "antd";
import { USER_INFO_STORAGE_KEY } from "../../constants";
import { registerCourse, sendEmail } from "../../api";
import { IMyRegister } from "../../api/types";
import { useStore } from "@/store";
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
const grade = [
  "大一",
  "大二",
  "大三",
  "大四",
  "硕士研究生",
  "博士研究生",
  "大学老师",
  "公司技术工程师",
  "其他",
];

const tags = [
  {
    value: "未订阅通知",
    label: "不订阅通知",
  },
  {
    value: "已订阅短信通知",
    label: "订阅短信通知",
  },
  {
    value: "已订阅电话通知",
    label: "订阅电话通知",
  },
  {
    value: "已订阅全部通知",
    label: "订阅全部通知",
  },
];

export const verify_rules = {
  NONE: "0",
  ONLY_ROOM: "1",
  ONLY_PLAYBACK: "2",
  ALL_RIGNHT: "3"
}

const hows = [
  { value: "搜索引擎" },
  { value: "视频网站" },
  { value: "交流论坛" },
  { value: "朋友推荐" },
  { value: "广告链接" },
]

const RegisterForm = (props: {
  courseInfo: any;
  onSubmit: (values: IMyRegister) => void | Promise<boolean>;
}) => {
  const [form] = Form.useForm<IFromProps>();
  const store = useStore();
  const [loading, setLoading] = useState<boolean>(false)
  const client = store.client.client;
  const onFinish = async (values: IFromProps) => {
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
    data.verify = "1";
    data.classId = 1;
    data.createdAt = now;
    data.updatedAt = now;

    const newCourse = await registerCourse(data);
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
  };

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
      <h3>报名</h3>
      <Form.Item
        label="姓名"
        name="name"
        rules={[{ required: true, message: "请输入姓名" }]}
      >
        <Input placeholder="请输入姓名" />
      </Form.Item>

      <Form.Item label="性别" name="gender">
        <Radio.Group>
          <Radio value="男">男</Radio>
          <Radio value="女">女</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="年级" name="age">
        <Select>
          {grade.map((v) => (
            <Select.Option key={v} value={v}>
              {v}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="来源" name="how" className="how">
        <AutoComplete
          options={hows}
          placeholder="通过哪种方式了解到我们"
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          getPopupContainer={triggerNode => triggerNode.parentElement || new HTMLBodyElement()}
        />
      </Form.Item>

      <Form.Item label="备注" name="tag">
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
          确认
        </Button>
      </Form.Item>
    </Form>
  );
};

const   RegisterModal = (props: IProps) => {
  const [visible, setVisible] = useState(props.defaultVisible);
  const store = useStore();

  let myRegisters = store.myRegisters.myRegisters;

  const handleSubmit = (newCourse: IMyRegister) => {
    store.myRegisters.setMyRegisters((myRegisters || []).concat(newCourse));
    props.onRegisterCourse?.(newCourse);
    setVisible(false);
  };
  return (
    <>
      <button className={props.isSpecial ? props.styles["join-btn"] : "btn"} onClick={() => setVisible(true)}>
        立即报名
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
