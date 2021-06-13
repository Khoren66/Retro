import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button, Input } from "antd";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { TeamOutlined, CopyOutlined } from "@ant-design/icons";
import Api from "../Api/index";
import "./retroForm.css"

const defaultState = {
  loading: false,
  visible: false,
  team_name: "",
  url: null,
  copied: false,
};

const RetroForm = () => {
  const [state, setState] = useState(defaultState);
  // useEffect(()=>{
   
  // },[])
  let history = useHistory();

  const showModal = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const handleOk = () => {
    if(state.url){
      setState(defaultState)
    }else{
      setState({ ...state, loading: true });
      Api.retros.post({"team_name":state.team_name})
      setTimeout(() => {
        setState({ ...state, loading: false, team_name: "",url:"localhost:3000" });
      }, 3000);
    } 
  };

  const handleCancel = () => {
    setState({ defaultState });
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setState({ ...state,team_name: value });
    console.log(value);
  };

  const handleCopy=(e)=>{
    setState({...state,copied: true})
  }
  return (
    <div>
      <Button
        type="primary"
        className="button-radius-bottom"
        style={{
          background: "#f3f6f7",
          color: "#3f5b70",
          height: "50px",
          width: "200px",
          fontSize: "20px",
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
            style={{display: state.url?"none":"inline-block" }}
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
          style={{display: state.url?"none":"flex" }}
          onChange={handleInputChange}
          value={state.team_name}
          placeholder="Team Name"
          prefix={<TeamOutlined />}
        />
        <Input
          size="large"
          name="url"
          style={{display: state.url?"flex" :"none" }}
          onChange={handleInputChange}
          value={state.url}
          prefix={     
            <CopyToClipboard text={state.url}
            onCopy={() => handleCopy()}>
            <Button  size="large">
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
