import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";
import { api, defaultAxios } from "../../environment/api";

const CreateAndEdit = ({ isVisible, setIsVisible, initVal, reload }) => {
  const [form] = Form.useForm();
  console.log(initVal);
  useEffect(() => {
    if (initVal) {
      form.setFieldsValue(initVal);
    }
  }, [initVal]);
  return (
    <Modal
      title={`${initVal ? "修改" : "新增"}股票`}
      visible={isVisible}
      cancelText="取消"
      okText="確認"
      onCancel={() => {
        form.resetFields();
        setIsVisible(false);
      }}
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(value) => {
          console.log(value);
          const axiosType = initVal ? "putStock" : "postStock";
          console.log({
            url: api[axiosType].url,
            method: api[axiosType].method,
          });
          defaultAxios({
            url: api[axiosType].url,
            method: api[axiosType].method,
            data: { ...value, groupId: [] },
          }).then(() => {
            form.resetFields();
            setIsVisible(false);
            reload(Math.random());
          });
        }}
      >
        <Form.Item
          label="ID"
          name="id"
          rules={[{ required: true, message: "Require" }]}
        >
          <Input disabled={!!initVal} />
        </Form.Item>
        <Form.Item
          label="漲停價格"
          name="closedPrice"
          rules={[{ required: true, message: "Require" }]}
        >
          <InputNumber type="number" className="w-full" min={0} />
        </Form.Item>
        <Form.Item
          label="價格上限"
          name="priceLimit"
          rules={[{ required: true, message: "Require" }]}
        >
          <InputNumber type="number" className="w-full" min={0} />
        </Form.Item>
        <Form.Item
          label="最近價格"
          name="currentPrice"
          rules={[{ required: true, message: "Require" }]}
        >
          <InputNumber type="number" className="w-full" min={0} />
        </Form.Item>
        <Form.Item
          label="類別"
          name="type"
          rules={[{ required: true, message: "Require" }]}
        >
          <InputNumber type="number" className="w-full" min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAndEdit;
