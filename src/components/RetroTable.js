import React from "react";
import { Table, Anchor } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
const { Column } = Table;
const { Link } = Anchor;

const data = [
  {
    retroUrl: "http://localhost:3000/retro",
    teamName: "Nemesis",
    date: "20-Oct-2020",
    status: "closed",
  },
  {
    retroUrl: "http://localhost:3000/retro",
    teamName: "Tardis",
    date: "28-Oct-2020",
    status: "closed",
  },
  {
    retroUrl: "http://localhost:3000/retro",
    teamName: "Convoy",
    date: "20-Oct-2020",
    status: "closed",
  },
  {
    retroUrl: "http://localhost:3000/retro",
    teamName: "Nemesis",
    date: "20-Oct-2020",
    status: "closed",
  },
  {
    retroUrl: "http://localhost:3000/retro",
    teamName: "Tardis",
    date: "28-Oct-2020",
    status: "closed",
  },
  {
    retroUrl: "http://localhost:3000/retro",
    teamName: "Convoy",
    date: "20-Oct-2020",
    status: "closed",
  },
  {
    retroUrl: "http://localhost:3000/retro",
    teamName: "Nemesis",
    date: "20-Oct-2020",
    status: "closed",
  },
  {
    retroUrl: "http://localhost:3000/retro",
    teamName: "Tardis",
    date: "28-Oct-2020",
    status: "closed",
  },
  {
    retroUrl: "http://localhost:3000/retro",
    teamName: "Convoy",
    date: "20-Oct-2020",
    status: "closed",
  },
  // {
  //   retroUrl: "http://localhost:3000/retro",
  //   teamName: "Nemesis",
  //   date: "20-Oct-2020",
  //   status: "closed",
  // },
  // {
  //   retroUrl: "http://localhost:3000/retro",
  //   teamName: "Tardis",
  //   date: "28-Oct-2020",
  //   status: "closed",
  // },
  // {
  //   retroUrl: "http://localhost:3000/retro",
  //   teamName: "Convoy",
  //   date: "20-Oct-2020",
  //   status: "closed",
  // },
  // {
  //   retroUrl: "http://localhost:3000/retro",
  //   teamName: "Nemesis",
  //   date: "20-Oct-2020",
  //   status: "closed",
  // },
  // {
  //   retroUrl: "http://localhost:3000/retro",
  //   teamName: "Tardis",
  //   date: "28-Oct-2020",
  //   status: "closed",
  // },
  // {
  //   retroUrl: "http://localhost:3000/retro",
  //   teamName: "Convoy",
  //   date: "20-Oct-2020",
  //   status: "closed",
  // },
];

const RetroTable = () => {
  return (
    <div>
      <Table
      scroll={{y:true}}
        rowKey={(record) => record.id}
        pagination={false}
        dataSource={data}
      >
        <Column
          key="retroUrl"
          title="Retro link"
          render={(text, record) => (
            <Anchor>
              <Link href={record.retroUrl} title={record.retroUrl} />
            </Anchor>
          )}
        />
        <Column title="Date" key="date" dataIndex="date" />
        <Column title="Team" key="teamName" dataIndex="teamName" />
        <Column
          title="Status"
          key="status"
          render={(text, record) =>
            record.approved === "accepted" ? (
              <span>
                <CheckCircleFilled
                  style={{
                    color: "orange",
                    marginRight: "5px",
                  }}
                />
                {record.approved}
              </span>
            ) : record.approved === "declined" ? (
              <span>
                <CloseCircleFilled
                  style={{
                    color: "red",
                    marginRight: "5px",
                  }}
                />
                {record.approved}
              </span>
            ) : (
              <span>
                <ClockCircleOutlined
                  style={{ color: "#595959", marginRight: "5px" }}
                />{" "}
                {record.approved}
              </span>
            )
          }
        />
      </Table>
    </div>
  );
};

export default RetroTable;
