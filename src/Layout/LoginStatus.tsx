import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Dropdown, Menu, Modal, Form, Input, Button, message } from "antd";
import { USER_INFO_STORAGE_KEY, DETAULT_USER_AVATAR } from "../constants";
import VerificationCode, {
  VerificationCodeNum,
} from "../components/VerificationCode";
import Icon from "@/components/Icon";
import { UserOutlined } from "@ant-design/icons";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { Utils } from "@/common/Utils";
import { getMyRegisters } from "@/api";
import { useDeviceDetect } from "@/hooks";
import { Toast } from "antd-mobile";
import { useTranslation } from "react-i18next";

const PhoneRegex =
  /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;
interface IFromProps {
  phone: string;
  code: string;
}

const LoginForm = (props: {
  onSubmit: (phone: string) => void | Promise<boolean>;
}) => {
  const codeRef = useRef<{
    getCodes: () => number[];
    getCodesAsString: (caseInsensitive?: boolean) => string;
  }>();
  const [codeIsValid, setCodeIsValid] = useState(true);
  const [form] = Form.useForm<IFromProps>();
  const onFinish = (value: IFromProps) => {
    if (
      value.code.length === VerificationCodeNum &&
      value.code.toLowerCase() === codeRef.current?.getCodesAsString(true)
    ) {
      props.onSubmit(value.phone);
    } else {
      setCodeIsValid(false);
    }
  };

  return (
    <Form
      form={form}
      className="normal-form"
      onFinish={onFinish}
      autoComplete="off"
      size="large"
    >
      <h3>请使用手机号登录</h3>
      <Form.Item
        name="phone"
        rules={[
          { required: true, message: "请输入手机号" },
          { pattern: PhoneRegex, message: "请输入正确手机号" },
        ]}
      >
        <Input placeholder="请输入手机号" />
      </Form.Item>

      <Form.Item
        name="code"
        rules={[{ required: true, message: "请输入验证码" }]}
        help={codeIsValid ? undefined : "验证码输入错误"}
        validateStatus={codeIsValid ? undefined : "error"}
      >
        <Input
          placeholder="请输入验证码"
          addonAfter={<VerificationCode ref={codeRef} />}
        />
      </Form.Item>

      <Form.Item>
        <Button style={{ width: "100%" }} type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>

      <span>
        登录即代表阅读并同意{" "}
        <span style={{ color: "#3db477" }}>《服务协议和隐私政策》</span>
      </span>
    </Form>
  );
};
const LoginStatus = () => {
  const store = useStore();
  let loginDialogVisible = store.login.loginDialogVisible;

  const md = useDeviceDetect();
  const isMobile = !!md?.mobile();

  const { t } = useTranslation()

  useEffect(() => {
    const phone = Utils.storage.getUsr();
    !!phone ? store.user.setUserInfo({ phone }) : store.user.setUserInfo({});
  }, []);

  const setLoginVisible = (visible: boolean) => {
    store.login.setLoginDialogVisible(visible);
  };

  const login = async (phone: string) => {
    store.user.setUserInfo({ phone });
    store.user.checkLogined(phone);
    getMyRegisters(phone).then((registers) => {
      store.myRegisters.setMyRegisters(registers);
    });
  };

  const handleSubmit = (phone: string) => {
    localStorage.setItem(USER_INFO_STORAGE_KEY, phone);
    isMobile ? Toast.show({
      icon: "success",
      content: "登录成功"
    }) : message.success("登录成功，欢迎回来!");
    login(phone);
  };
  return (
    <>
      <span className="nav-link" onClick={() => setLoginVisible(true)}>
        {t('home_page.header.login')}
      </span>
      <Modal
        width={350}
        open={loginDialogVisible}
        footer={null}
        onCancel={() => setLoginVisible(false)}
        maskClosable={true}
      >
        <LoginForm onSubmit={handleSubmit} />
      </Modal>
    </>
  );
}

export default observer(LoginStatus);
