import React, { useEffect, useState } from "react";
import { defaultAxios, api } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import { Table, Button, Row, Col, Modal, Input, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Create from "./create";
import dayjs from "dayjs";
import { LINK_MAPPING_DATA } from "../../authData";

const { confirm } = Modal;

const { Title } = Typography;
const RoleManagement = () => {
  const [roleData, setRoleData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalSize, setTotalSize] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reset, setReset] = useState(0);
  const [editValue, setEditValue] = useState();
  const [checked, setChecked] = useState([]);
  const [searchCondition, setSearchCondition] = useState({});

  function showDeleteConfirm(id) {
    confirm({
      title: "確定要刪除?",
      icon: <ExclamationCircleOutlined />,
      content: "刪除後將無法復原",
      okText: "確定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        defaultAxios({
          url: api.deleteRole.url,
          method: api.deleteRole.method,
          data: {
            id,
          },
        })
          .catch((err) => {
            errorNotification(err);
          })
          .finally(() => {
            setChecked([]);
            setReset(Math.random());
          });
      },
    });
  }

  useEffect(() => {
    defaultAxios({
      url: api.getRolePermission.url,
      method: api.getRolePermission.method,
    })
      .then((res) => {
        console.log(res.data);
        setPermissionData(res.data);
      })
      .catch((err) => {
        errorNotification(err);
      });
  }, []);

  useEffect(() => {
    defaultAxios({
      url: api.getRole.url,
      method: api.getRole.method,
      params: {
        ...searchCondition,
        page: { page, pageSize },
      },
    })
      .then((res) => {
        console.log(res.data);
        setRoleData(res.data.content);
        setTotalSize(res.data.totalSize);
      })
      .catch((err) => {
        errorNotification(err);
      });
  }, [page, pageSize, reset]);

  const rowSelection = {
    selectedRowKeys: checked,
    onChange: (selectedRowKeys, selectedRows) => {
      setChecked(selectedRows.map((deta) => deta.id));
    },
    preserveSelectedRowKeys: false,
  };
  return (
    <div className="px-10">
      <Create
        visible={visible}
        setVisible={setVisible}
        reset={setReset}
        defaultValue={editValue}
        permission={permissionData}
      />
      <Title level={5}>條件搜尋</Title>
      <Row
        className="mb-4 border border-gray-200 p-4"
        justify="space-around"
        align="bottom"
      >
        <Col span={6}>
          名稱
          <Input
            placeholder="輸入名稱"
            size="middle"
            onChange={(e) => {
              setSearchCondition({
                ...searchCondition,
                name: e.target.value,
              });
            }}
          />
        </Col>
        <Col span={2}>
          <Button
            onClick={() => {
              setReset(Math.random());
            }}
          >
            搜尋
          </Button>
        </Col>
      </Row>
      <div className="flex justify-end my-5">
        <Button
          disabled={!checked.length}
          type="default"
          className="mr-4"
          onClick={() => {
            showDeleteConfirm(checked);
          }}
        >
          刪除勾選
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setEditValue(null);
            setVisible(true);
          }}
        >
          新增角色
        </Button>
      </div>
      <Table
        rowKey="id"
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={[
          {
            title: "名稱",
            dataIndex: "name",
          },
          {
            title: "每日請求上限",
            dataIndex: "totalApiTime",
          },
          {
            title: "允許頁面",
            dataIndex: "permissions",
            render: (data) => (
              <span className="whitespace-pre-line">
                {data.reduce(
                  (prev, curr) => prev + LINK_MAPPING_DATA[curr.id] + "\n",
                  ""
                )}
              </span>
            ),
          },
          {
            title: "創建時間",
            dataIndex: "createdTime",
            width: 200,
            render: (data) => (
              <span>{dayjs(data).format("YYYY/MM/DD HH:mm:ss")}</span>
            ),
          },
          {
            title: "更新時間",
            dataIndex: "updatedTime",
            width: 200,
            render: (data) => (
              <span>{dayjs(data).format("YYYY/MM/DD HH:mm:ss")}</span>
            ),
          },
          {
            title: "狀態",
            dataIndex: "action",
            render: (_, record) => (
              <span>
                <Button
                  type="link"
                  shape="circle"
                  className="inline-flex justify-center items-center mr-2"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditValue({
                      id: record.id,
                      name: record.name,
                      totalApiTime: record.totalApiTime,
                      permissions: record.permissions.map((data) => data.id),
                    });
                    setVisible(true);
                  }}
                />
                <Button
                  type="link"
                  shape="circle"
                  className="inline-flex justify-center items-center"
                  onClick={() => showDeleteConfirm([record.id])}
                  icon={<DeleteOutlined />}
                />
              </span>
            ),
          },
        ]}
        dataSource={roleData}
        pagination={{
          pageSize: pageSize,
          total: totalSize,
          onChange: (page) => {
            setPage(page);
          },
          onShowSizeChange: (cur, size) => {
            setPageSize(size);
          },
        }}
        sticky
      />
    </div>
  );
};

export default RoleManagement;
