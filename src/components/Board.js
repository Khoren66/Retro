import React, { useEffect, useState } from "react";
import "./board.css";
import { useParams } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";
import { Card, Typography, Input } from "antd";
import Api from "../Api";
const { TextArea } = Input;

const formWellDefault = {
  uid: "",
  textWell: "",
};
const wellDefault = {
  uid: "",
  textWell: "",
};
const improveDefault = {
  uid: "",
  textImprove: "",
};
const actionDefault = {
  uid: "",
  textAction: "",
};
const formImproveDefault = {
  uid: "",
  textImprove: "",
};
const formActionDefault = {
  uid: "",
  textAction: "",
};

const formVisible = {
  wellVisible: false,
  improveVisible: false,
  actionVisible: false,
};

const Board = ({ cards }) => {
  const [wellData, setWell] = useState([]);
  const [show, setShow] = useState(formVisible);
  const [formWell, setFormWell] = useState(formWellDefault);
  const [formImprove, setFormImprove] = useState(formImproveDefault);
  const [formAction, setFormAction] = useState(formActionDefault);
  const [improvesData, setImproves] = useState([]);
  const [actions, setActions] = useState([]);
  const [cardsData, setCards] = useState([]);
  const { id } = useParams();
  useEffect(async () => {
    await Api.getRetro(id)
      .get()
      .then((res) => {
        let well = res.data.cards.filter((item) => item.card_type === "well");
        setWell(well);
        let improves= res.data.cards.filter((item) => item.card_type === "improve");
        setImproves(improves);
        let action = res.data.cards.filter((item) => item.card_type === "action");
      });
  }, []);

  const handleAddWellComment = () => {
    console.log(wellData);
    setWell([...wellData, formWell]);
    setShow({ ...show, wellVisible: false });
    setFormWell(wellDefault);
  };

  const handleAddImproveComment = () => {
    console.log(improvesData);
    setImproves([...improvesData, formImprove]);
    setShow({ ...show, improveVisible: false });
    setFormImprove(improveDefault);
  };

  const handleAddActionComment = () => {
    console.log(actions);
    setActions([...actions, formAction]);
    setShow({ ...show, actionVisible: false });
    setFormAction(actionDefault);
  };

  const handleShowWell = () => {
    if (show.wellVisible) {
      setShow({ ...show, wellVisible: false });
      setFormWell(formWellDefault);
    } else {
      setShow({ ...show, wellVisible: true });
    }
  };
  const handleShowImprove = () => {
    if (show.improveVisible) {
      setShow({ ...show, improveVisible: false });
      setFormImprove(formImproveDefault);
    } else {
      setShow({ ...show, improveVisible: true });
    }
  };
  const handleShowAction = () => {
    if (show.actionVisible) {
      setShow({ ...show, actionVisible: false });
      setFormAction(formActionDefault);
    } else {
      setShow({ ...show, actionVisible: true });
    }
  };

  const handleWellChange = ({ target: { name, value } }) => {
    setFormWell({ ...formWell, [name]: value });
  };

  const handleImproveChange = ({ target: { name, value } }) => {
    setFormImprove({ ...formImprove, [name]: value });
  };

  const handleActionChange = ({ target: { name, value } }) => {
    setFormAction({ ...formAction, [name]: value });
  };

  return (
    <div>
      <div className="retro-headers">
        <div>
          <Typography>
            <h3>Went well</h3>
          </Typography>
          <button onClick={handleShowWell} className="prymary-color">
            {show.wellVisible ? "Close" : "New"}
          </button>
        </div>
        <div>
          <Typography>
            <h3>To improve</h3>
          </Typography>
          <button onClick={handleShowImprove} className="prymary-color">
            {show.improveVisible ? "Close" : "New"}
          </button>
        </div>
        <div>
          <Typography>
            <h3>Action items</h3>
          </Typography>
          <button onClick={handleShowAction} className="prymary-color">
            {show.actionVisible ? "Close" : "New"}
          </button>
        </div>
      </div>

      <div className="board-columns column-wrapper">
        <div className="column-style">
          <div style={{ width: "30%", position: "absolute" }}>
            <TextArea
              value={formWell.textWell}
              name="textWell"
              className="text-field"
              onChange={handleWellChange}
              style={{ display: show.wellVisible ? "inline-block" : "none" }}
              placeholder="What did go well ?"
              autoSize={{ minRows: 3, maxRows: 4 }}
            />
            <CheckCircleFilled
              onClick={handleAddWellComment}
              style={{ display: show.wellVisible ? "inline-block" : "none" }}
              className="accept-icon"
            />
            {wellData.map((item) => {
              console.log(item, "itemitemitem", wellData);
              return <Card className="went-well card-style">{item.text}</Card>;
            })}
            {/* <Card className="went-well card-style">Card content</Card> */}
          </div>
        </div>

        <div className="column-style">
          <div style={{ width: "30%", position: "absolute" }}>
            <TextArea
              value={formImprove.textImprove}
              name="textImprove"
              className="text-field"
              onChange={handleImproveChange}
              style={{ display: show.improveVisible ? "inline-block" : "none" }}
              placeholder="What should be improved ?"
              autoSize={{ minRows: 3, maxRows: 4 }}
            />
            <CheckCircleFilled
              onClick={handleAddImproveComment}
              style={{ display: show.improveVisible ? "inline-block" : "none" }}
              className="accept-icon"
            />
            {improvesData &&
              improvesData.map((item) => {
                return (
                  <Card className="to-improve card-style">
                    {item.textImprove}
                  </Card>
                );
              })}
            <Card className="to-improve card-style">Card content</Card>
          </div>
        </div>

        <div className="column-style">
          <div style={{ width: "30%", position: "absolute" }}>
            <TextArea
              value={formAction.textAction}
              name="textAction"
              className="text-field"
              style={{ display: show.actionVisible ? "inline-block" : "none" }}
              onChange={handleActionChange}
              placeholder="What are we going to do ?"
              autoSize={{ minRows: 3, maxRows: 4 }}
            />
            <CheckCircleFilled
              onClick={handleAddActionComment}
              style={{ display: show.actionVisible ? "inline-block" : "none" }}
              className="accept-icon"
            />
            {actions &&
              actions.map((item) => {
                return (
                  <Card className="actions card-style">{item.textAction}</Card>
                );
              })}
            <Card className="actions card-style">Card content</Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
