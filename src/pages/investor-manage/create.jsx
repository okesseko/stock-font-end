import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { defaultAxios, api } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";

const Create = ({ visible, setVisible, defaultValue, reset, role = [] }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (defaultValue) {
      form.setFieldsValue(defaultValue);
    }
  }, [defaultValue]);
  return (
    <Modal
      title={defaultValue ? "修改權限" : "新增權限"}
      visible={visible}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        form.resetFields();
        setVisible(false);
        console.log("cancel");
      }}
      okText="確認"
      cancelText="取消"
    >
      <Form
        name="basic"
        layout="vertical"
        form={form}
        onFinish={(value) => {
          const { totalApiTime, restApiTime, ...other } = value;
          if (defaultValue) {
            defaultAxios({
              url: api.putRole.url,
              method: api.putRole.method,
              data: {
                id: defaultValue.id,
                totalApiTime: parseInt(totalApiTime),
                restApiTime: parseInt(restApiTime),
                ...other,
              },
            })
              .catch((err) => {
                errorNotification(err?.response?.data);
              })
              .finally(() => {
                reset(Math.random());
                form.resetFields();
                setVisible(false);
              });
          } else {
            defaultAxios({
              url: api.postRole.url,
              method: api.postRole.method,
              data: {
                totalApiTime: parseInt(totalApiTime),
                restApiTime: parseInt(restApiTime),
                ...other,
              },
            })
              .catch((err) => {
                errorNotification(err?.response?.data);
              })
              .finally(() => {
                reset(Math.random());
                form.resetFields();
                setVisible(false);
              });
          }
        }}
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="帳戶名稱"
          name="account"
          rules={[{ required: true, message: "請輸入帳戶名稱" }]}
        >
          <Input placeholder="請輸入帳戶名稱" />
        </Form.Item>
        <Form.Item
          label="密碼"
          name="password"
          rules={[{ required: !defaultValue, message: "請輸入密碼" }]}
        >
          <Input placeholder="請輸入密碼" />
        </Form.Item>
        <Form.Item
          label="api 可打上限"
          name="totalApiTime"
          rules={[{ required: true, message: "請輸入上限" }]}
        >
          <Input type="number" placeholder="請輸入數字" />
        </Form.Item>
        <Form.Item
          label="api 重製上限"
          name="restApiTime"
          rules={[{ required: true, message: "請輸入上限" }]}
        >
          <Input type="number" placeholder="請輸入數字" />
        </Form.Item>
        <Form.Item
          label="權限"
          name="roleId"
          rules={[{ required: true, message: "請選擇" }]}
        >
          <Select
            placeholder="請選擇"
            options={role?.map((val) => ({ value: val.id, label: val.name }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Create;
