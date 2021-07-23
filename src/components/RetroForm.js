import React, { useState, useEffect } from "react";
import { Modal, Button, Input } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { TeamOutlined, CopyOutlined } from "@ant-design/icons";
import Api from "../Api/index";
import "./retroForm.css";

const defaultState = {
  loading: false,
  visible: false,
  team_name: "",
  retro_url: null,
  copied: false,
};

const RetroForm = () => {
  const [state, setState] = useState(defaultState);
  const [user,setUser] = useState({user_id: null})
  const {user_id} = user
  const { team_name } = state;
  useEffect(() => {
    let u_id = JSON.parse(localStorage.getItem("retro")).user_id;
    setUser({user_id:u_id});
  }, []);

  const showModal = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const handleOk = async () => {
    if (state.retro_url) {
      setState(defaultState);
    } else {
      setState({ ...state, loading: true });
      console.log({ team_name, user_id });
      await Api.retros
        .post({ team_name, user_id })
        .then((res) => {
          if (res.statusText = "OK") {
            setState({ ...state, retro_url: res.data.retro_url });
            setTimeout(() => {
              setState({
                ...state,
                loading: false,
                team_name: res.data.team_name,
                retro_url: res.data.retro_url,
              });
            }, 3000);
          }
        })
        .catch((reqErr) => {
          console.error(reqErr);
          console.log(reqErr.res.status);
        });
    }
  };

  const handleCancel = () => {
    setState({ defaultState });
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setState({ ...state, team_name: value });
    console.log(value);
  };

  const handleCopy = (e) => {
    setState({ ...state, copied: true });
  };
  return (
    <div>
      <Button
        type="primary"
        // className="button-radius-bottom"
        style={{
          
          background:"#2D89CD",
          // background: "#f3f6f7",
          // color: "#3f5b70",
          // height: "50px",
          // width: "200px",
          // fontSize: "20px",
          marginRight:"4px",
          borderRadius:"4px"
        }}
        onClick={showModal}
      >
        Create Retro
      </Button>
      <Modal
        visible={state.visible}
        title="Create retroboard"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ display: state.retro_url ? "none" : "inline-block" }}
            loading={state.loading}
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <Input
          size="large"
          name="team_name"
          style={{ display: state.retro_url ? "none" : "flex" }}
          onChange={handleInputChange}
          value={state.team_name}
          placeholder="Team Name"
          prefix={<TeamOutlined />}
        />
        <Input
          size="large"
          name="retro_url"
          style={{ display: state.retro_url ? "flex" : "none" }}
          onChange={handleInputChange}
          value={state.retro_url}
          prefix={
            <CopyToClipboard text={state.retro_url} onCopy={() => handleCopy()}>
              <Button size="large">
                Copy <CopyOutlined />
              </Button>
            </CopyToClipboard>
          }
        />
      </Modal>
    </div>
  );
};

export default RetroForm;
