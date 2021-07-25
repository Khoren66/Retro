import React from "react";
import { Modal } from "antd";
import Api from "../Api";
import CardDropdown from "./CardDropdown"
import {
  LikeFilled,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const RetroCard = ({
  item,
  state,
  setState,
  snapshot,
  provided,
  getItemStyle,
}) => {
  const { actions, wells, improves } = state;
  const { confirm } = Modal;

  const handleLike = (card) => {
    let filtered = [];
    if (card.card_type === "wells") {
      filtered = wells.filter((item) => item.id !== card.id);
    } else if (card.card_type === "improves") {
      filtered = improves.filter((item) => item.id !== card.id);
    } else {
      filtered = actions.filter((item) => item.id !== card.id);
    }
    Api.editDeleteCard(card.id)
      .put({ ...card, votes: card.votes + 1 })
      .then((res) => {
        if ((res.statusText = "OK")) {
          setState({ ...state, [card.card_type]: [...filtered, res.data] });
        }
      })
      .catch((reqErr) => {
        console.error(reqErr);
        console.log(reqErr.res.status);
      });
  };
  const showDeleteConfirm = (card) => {
    confirm({
      title: "Are you sure delete this item?",
      icon: <ExclamationCircleOutlined />,
      content: [
        <div
          dangerouslySetInnerHTML={{
            __html: ` ${card.text}`,
          }}
        ></div>,
      ],
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleRemoveCard(card);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const handleRemoveCard = (card) => {
    let filtered = [];
    if (card.card_type === "wells") {
      filtered = wells.filter((item) => item.id !== card.id);
    } else if (card.card_type === "improves") {
      filtered = improves.filter((item) => item.id !== card.id);
    } else {
      filtered = actions.filter((item) => item.id !== card.id);
    }
    Api.editDeleteCard(card.id)
      .delete()
      .then((res) => {
        if ((res.statusText = "OK")) {
          setState({ ...state, [card.card_type]: [...filtered] });
        }
      })
      .catch((reqErr) => {
        console.error(reqErr);
        console.log(reqErr.res.status);
      });
  };
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
    >
      
      <div className="close-remove-icon">
        <CloseOutlined
        onClick={() => showDeleteConfirm(item)}/>
        </div>
      <div className="more-icon">
      <CardDropdown/>
      </div>
    
      <div dangerouslySetInnerHTML={{__html:item.text}}></div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>{item.created_by}</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <LikeFilled onClick={() => handleLike(item)} className="like-icon" />
          <span>{item.votes} </span>
          {/* <EditFilled className="edit-icon" /> */}
        </div>
      </div>
    </div>
  );
};

export default RetroCard;
