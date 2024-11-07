import React, { useState, useEffect } from "react";
import axios from "axios";
import { Flex, message, Select, Table } from "antd";
import Page500 from "../components/500";
import dayjs from "dayjs";

export default function ViewHistoryIdpel({ path }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [type, setType] = useState("WKAI");

  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const onChange = (value) => {
    setType(value);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "nama",
      key: "nama",
    },
    Table.EXPAND_COLUMN,
    {
      title: "Type",
      dataIndex: "tipe",
      key: "tipe",
    },
    {
      title: "Nomor HP",
      dataIndex: "hp",
      key: "hp",
    },
    Table.SELECTION_COLUMN,
    {
      title: "#",
      dataIndex: "",
      key: "",
    },
  ];

  const columnsMobile = [
    Table.SELECTION_COLUMN,
    Table.EXPAND_COLUMN,
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "Type",
      dataIndex: "tipe",
      key: "tipe",
    },

  ];

  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);

  useEffect(() => {
    if (!token) {
      setErr(true);
    }
  }, [token]);

  useEffect(() => {
    getTransaksiList(type);
  }, [type]);

  const getTransaksiList = async (type) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/app/history_idpel`,
        {
          token,
          type: type,
        }
      );

      let datas = response.data || [];

      datas.data = datas.data.map((x, i) => ({
        ...x,
        key: i + 1,
        hp: x.hp == "" || x.hp == null ? "-" : x.hp,
      }));

      if (type == "TP") {
        datas.data = datas.data.map((x, i) => ({
          ...x,
          nama: x.nama_depan + x.nama_belakang,
        }));
      }

      setData(datas.data);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setErrPage(true);
    }
  };

  const handleExpand = (expanded, record) => {
    setExpandedRowKey(expanded ? record.key : null);
  };

  return (
    <>
      {contextHolder}
      <div>
        {err ? (
          <Page500 />
        ) : errPage ? (
          <Page500 />
        ) : isLoading ? (
          <div className="w-full mt-12 flex justify-center items-center">
            <div className="text-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.8130 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="block mt-12">
              <div className="select">
                <Select
                  showSearch
                  placeholder="Select Type"
                  optionFilterProp="label"
                  onChange={onChange}
                  style={{ width: 200 }}
                  value={type}
                  options={[
                    {
                      value: "WKAI",
                      label: "Train",
                    },
                    {
                      value: "TP",
                      label: "Plane",
                    },
                    {
                      value: "SHPPELNI",
                      label: "Pelni",
                    },
                  ]}
                />
              </div>
              {/* desktop */}
              <div className="mt-6">
                <div className="hidden xl:block">
                <Flex gap="middle" vertical>
                  <Table
                    columns={columns}
                    rowSelection={{}}
                    expandable={{
                      expandedRowRender: (record) => (
                        <p style={{ margin: 0 }}>{record.nik}</p>
                      ),
                      expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
                      onExpand: handleExpand,
                    }}
                    pagination={{ pageSize: 5 }}
                    dataSource={data}
                    rowKey="key"
                  />
                </Flex>
                </div>
                {/* for mobile */}
                <div className="block xl:hidden">
                <Flex gap="middle" vertical>
                    <Table
                     rowSelection={{}}
                      expandable={{
                        expandedRowRender: (record) => (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-8">
                                <div className="my-2">
                                  <p style={{ margin: 0 }} className="text-xs">
                                    <strong>NIK:</strong> {record.nik}
                                  </p>
                                </div>
                                <div className="my-2">
                                  <p style={{ margin: 0 }} className="text-xs">
                                    <strong>Nomor HP:</strong> {record.hp && record.hp !== '' ? record.hp : '-'}
                                  </p>
                                </div>
                                <div className="my-2">
                                  <p style={{ margin: 0 }}  className="text-xs">
                                    <strong>Tanggal Lahir:</strong> {dayjs(record.ttl).format("DD/MM/YYYY")}
                                  </p>
                                </div>
                              </div>
                          </>
                        ),
                      }}
                      columns={columnsMobile}
                      dataSource={data}
                      pagination={{pageSize:5}}
                    />
                </Flex>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
