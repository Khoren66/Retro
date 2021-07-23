import { Modal, Input, Switch, Typography } from "antd";
import Draggable from "react-draggable";
import React, { useState } from "react";
import { TeamOutlined } from "@ant-design/icons";
const defaultState = {
  disabled: true,
  bounds: { left: 0, top: 0, bottom: 0, right: 0 },
};
const RetroEditModal = ({
  retro,
  visible,
  handleCancel,
  handleOk,
  handleModalInputChange,
  handleModalSwitchChange,
}) => {
  const draggleRef = React.createRef();
  const [state, setState] = useState(defaultState);
  const { bounds, disabled } = state;
  const { team_name, active } = retro;

  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    setState({
      bounds: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y),
      },
    });
  };
  return (
    <>
      <Modal
        title={
          <div
            style={{
              width: "100%",
              cursor: "move",
            }}
            onMouseOver={() => {
              if (disabled) {
                setState({
                  disabled: false,
                });
              }
            }}
            onMouseOut={() => {
              setState({
                disabled: true,
              });
            }}
          >
            Edit Team {team_name}'s retro
          </div>
        }
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Input
          size="large"
          name="team_name"
          onChange={(e) => handleModalInputChange(e)}
          value={team_name}
          placeholder="Team Name"
          prefix={<TeamOutlined />}
        />
        <table style={{ marginTop: "10px" }}>
          <td>
            <Typography>{active ? "Active" : "Closed"}</Typography>
          </td>
          <td>
            <Switch
              name="active"
              checked={active}
              onChange={(e) => handleModalSwitchChange(e)}
            />
          </td>
        </table>
      </Modal>
    </>
  );
};

export default RetroEditModal;
