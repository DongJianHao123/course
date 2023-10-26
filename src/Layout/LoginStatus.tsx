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
 export const phoneNumberRegex = /^(\+?)(\d{1,4}[\s-]?)?(\d{1,2})[\s-]?(\d{1,4})[\s-]?(\d{1,4})[\s-]?(\d{1,9})$/;





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
  const { t } = useTranslation()
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
      <h3>{t('login.login_form.title')}</h3>
      <Form.Item
        name="phone"
        rules={[
          { required: true, message: t('login.login_form.phone_placeholder') },
          { pattern: phoneNumberRegex, message: t('login.login_form.phone_number_verification') },
        ]}
      >
        <Input placeholder={t('login.login_form.phone_placeholder')} />
      </Form.Item>

      <Form.Item
        name="code"
        rules={[{ required: true, message: t('login.login_form.valcode_placeholder') }]}
        help={codeIsValid ? undefined : t('login.login_form.valcode_error')}
        validateStatus={codeIsValid ? undefined : "error"}
      >
        <Input
          placeholder={t('login.login_form.valcode_placeholder')}
          addonAfter={<VerificationCode ref={codeRef} />}
        />
      </Form.Item>

      <Form.Item>
        <Button style={{ width: "100%" }} type="primary" htmlType="submit">
          {t('login.login_form.submit')}
        </Button>
      </Form.Item>

      <span>
        {t('login.login_form.tip')}{" "}
        <span style={{ color: "#3db477" }}>《{t('login.login_form.agreement')}》</span>
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
      content: t('login.login_form.success_h5')
    }) : message.success(t('login.login_form.success_pc'));
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
