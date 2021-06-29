import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Table, Anchor } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  LockFilled,
} from "@ant-design/icons";
import Api from "../Api";
const { Column } = Table;
const { Link } = Anchor;

const RetroTable = (user_id) => {
  const [retros, setRetros] = useState([]);
  useEffect(async() => {
    console.log(user_id,"USER ID IN RETRO TABLE AS PROPS")
    // const response = await axios.get("http://localhost:3000/retros", {
    //   params: {
    //     user_id: 1
    //   }
    // });
    // console.log(response ,"responseresponseresponseresponse")
    Api.retros.get({data:{user_id:1}}).then((res) => {
      setRetros(res.data);
      console.log(res.data);
    })

    console.log(retros);
  }, []);

  return (
    <div>
    {/*  <Table columns={columns} dataSource={retros} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} /> */}
      <Table
        scroll={{ y: true }}
        rowKey={(record) => record.id}
        pagination={{pageSize: 15}}
        // pagination = {false}
        dataSource={retros}
      >
        <Column
          key="retroUrl"
          title="Retro link"
          render={(text, record) => (
            <Anchor>
              <Link href={record.retro_url} title={record.retro_url} />
            </Anchor>
          )}
        />
        <Column title="Date" key="date" dataIndex="date" />
        <Column title="Team" key="team_name" dataIndex="team_name" />
        <Column
          title="Status"
          key="status"
          render={(text, record) =>
            record.active === true ? (
              <span>
                <ClockCircleOutlined
                  style={{
                    color: "#3f5b70",
                    marginRight: "5px",
                    fontSize: "30px",
                  }}
                />
                {record.active}
              </span>
            ) : record.active === false ? (
              <span>
                <LockFilled
                  style={{
                    color: "#3f5b70",
                    marginRight: "5px",
                    fontSize: "30px",
                  }}
                />
                {record.active}
              </span>
            ) : (
              <span>
                <ClockCircleOutlined
                  style={{
                    color: " #3f5b70",
                    marginRight: "5px",
                    fontSize: "30px",
                  }}
                />{" "}
                {record.active}
              </span>
            )
          }
        />
      </Table>
    </div>
  );
};

export default RetroTable;
