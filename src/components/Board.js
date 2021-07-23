import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./board.css";
import { useParams } from "react-router-dom";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Typography, Input, Modal, Button } from "antd";
import Api from "../Api";
import RetroCard from "./RetroCard";
import RetroWebSocket from "./RetroWebSocket"
const { TextArea } = Input;
const { confirm } = Modal;

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
console.log(result,"result 42 tox")
  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the wells look a bit nicer
  userSelect: "none",
  padding: "8px 8px 0",
  margin: `0 0 8px`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  minHeight: "70vh",
});

const wellDefault = {
  created_by: "",
  text: "",
  card_type: "wells",
  votes: 0,
};
const improveDefault = {
  created_by: "",
  text: "",
  card_type: "improves",
  votes: 0,
};
const actionDefault = {
  created_by: "",
  text: "",
  card_type: "actions",
  votes: 0,
};
const formVisible = {
  wellVisible: false,
  improveVisible: false,
  actionVisible: false,
};

const id2List = {
  dropWell: "wells",
  dropImprove: "improves",
  dropAction: "actions",
};

const Board = ({ cableApp}) => {
  const [show, setShow] = useState(formVisible);
  const [formWell, setFormWell] = useState(wellDefault);
  const [formImprove, setFormImprove] = useState(improveDefault);
  const [formAction, setFormAction] = useState(actionDefault);
  const [isNameModalVisible, setNameModalVisible] = useState(false);
  const [user, setUserName] = useState({ name: "" });
  // const [cardsData, setCards] = useState();
  const { id } = useParams();

  const [state, setState] = useState({
    wells: [],
    improves: [],
    actions: [],
    retro_id: "",
  });
  const { actions, wells, improves, retro_id } = state;

  useEffect(async () => {
    let user = JSON.parse(localStorage.getItem("retro_open_user"));
    if (!user) {
      setNameModalVisible(true);
    } else {
      setUserName({ name: user.name });
    }
    await Api.getRetro(id)
      .get()
      .then((res) => {
        let retro_id = res.data.id;

        setState({
          wells: res.data.cards_data.wells,
          improves: res.data.cards_data.improves,
          actions: res.data.cards_data.actions,
          retro_id: retro_id,
        });
      });
  }, []);

  const getList = (id) => state[id2List[id]];

  const onDragEnd = (result) => {
    // console.log(result, "result for DRAG END");
    const { source, destination } = result;
    console.log(
      improves[source.index],
      "source for DRAG END =====>>>2222222 this shoud be merged and removed"
    );
    console.log(
      improves[destination.index],
      "destination for DRAG END where must be merged"
    );
    // dropped outside the list
    if (!destination) {
      return;
    }
    console.log(source, "source.droppableId");
    console.log(destination, "destination.droppableId");
    if (source.droppableId === destination.droppableId) {
      const columnCards = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      let stateColumn = { columnCards };

      if (
        source.droppableId === "dropImprove" &&
        improves[source.index].id !== improves[destination.index].id
      ) {
        showConfirm(
          improves[source.index],
          improves[destination.index],
          "improves"
        );
        stateColumn = { improves: columnCards };
      } else if (
        source.droppableId === "dropAction" &&
        actions[source.index].id !== actions[destination.index].id
      ) {
        showConfirm(
          actions[source.index],
          actions[destination.index],
          "actions"
        );
        stateColumn = { actions: columnCards };
      } else if (
        source.droppableId === "dropWell" &&
        wells[source.index].id !== wells[destination.index].id
      ) {
        showConfirm(wells[source.index], wells[destination.index], "wells");
        stateColumn = { wells: columnCards };
      }

      setState({ ...state, stateColumn });
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );
      let updatedCard = {}
      console.log(result, "result ==========>>>RESULT");
      if (result.dropWell && result.dropImprove) {
        console.log(wells[source.index],"=========>>>start")
        console.log(improves[destination.index],"=========>>>end")
        console.log(source,"source",destination,"destination")
        if(source.droppableId==='dropWell'){
          updatedCard = {...wells[destination.index],card_type:"improves"}
          console.log(wells[destination.index],"this  card type must be edites to improves")
          Api.editDeleteCard(wells[destination.index].id).put(updatedCard)
        }else{
          updatedCard = {...improves[source.index],card_type:"wells"}
          console.log(improves[source.index],"this  card type must be edites to well")
          Api.editDeleteCard(improves[source.index].id).put(updatedCard)
        }
        setState({
          ...state,
          wells: result.dropWell,
          improves: result.dropImprove,
        });
      } else if (result.dropWell && result.dropAction) {
        if(source.droppableId==='dropWell'){
          updatedCard = {...wells[destination.index],card_type:"actions"}
          console.log(wells[destination.index],"this  card type must be edites to actions")
          Api.editDeleteCard(wells[source.index].id).put(updatedCard)
        }else{
          updatedCard = {...actions[source.index],card_type:"wells"}
          console.log(actions[source.index],"this  card type must be edites to wells")
          Api.editDeleteCard(actions[source.index].id).put(updatedCard)
        }
        setState({
          ...state,
          wells: result.dropWell,
          actions: result.dropAction,
        });
      } else {
        if(source.droppableId==='dropImprove'){
          updatedCard = {...improves[source.index],card_type:"actions"}
          Api.editDeleteCard(improves[source.index].id).put(updatedCard)
          console.log(improves[source.index],"this  card type must be edites to action")
        }else{
          updatedCard = {...actions[destination.index],card_type:"improves"}
          Api.editDeleteCard(actions[destination.index].id).put(updatedCard)
          console.log(actions[destination.index],"this  card type must be edites to improves")
          
        }
        setState({
          ...state,
          improves: result.dropImprove,
          actions: result.dropAction,
        });
      }
    }
  };
  const handleMergeCards = (sourceCard, destinationCard, cardsColumn) => {
    let data = [];
    if (cardsColumn === "wells") {
      data = wells;
    } else if (cardsColumn === "improves") {
      data = improves;
    } else {
      data = actions;
    }
    let filtered = [];
    let filteredDestination = [];
    let removingCard = [];
    let mergedCard = {};
    filtered = data.filter((item) => item.id !== sourceCard.id);
    removingCard = data.filter((item) => item.id === sourceCard.id);
    filteredDestination = data.filter((item) => item.id === destinationCard.id);
    mergedCard = filteredDestination[0];
    mergedCard.text = `<span>${filteredDestination[0].text}</br> -------</br>${removingCard[0].text}</span>`;
    if (
      !filteredDestination[0].created_by.includes(removingCard[0].created_by)
    ) {
      console.log("removed dublicates")
      mergedCard.created_by = `${filteredDestination[0].created_by},${removingCard[0].created_by}`;
      console.log(mergedCard.created_by.trim(),"========trim")
      let arraySplit = mergedCard.created_by.trim().split(',')


      mergedCard.created_by = arraySplit.filter(function(value, index, self) { 
        return self.indexOf(value) === index;
    }).join(',')
    }

    mergedCard.votes = filteredDestination[0].votes + removingCard[0].votes;
    if (
      sourceCard.id !== destinationCard.id &&
      sourceCard.card_type === destinationCard.card_type
    ) {
      Api.editDeleteCard(removingCard[0].id)
        .delete()
        .then((res) => {
          if ((res.statusText = "OK")) {
            Api.editDeleteCard(mergedCard.id)
              .put(mergedCard)
              .then((res) => {
                if ((res.statusText = "OK")) {
                  setState({ ...state, [cardsColumn]: [...filtered] });
                }
              });
          }
        })
        .catch((reqErr) => {
          console.error(reqErr);
          console.log(reqErr.res.status);
        });
    }
  };
  const showConfirm = (sourceCard, destinationCard, cardsColumn) => {
    confirm({
      title: "Do you Want to merge these items?",
      icon: <ExclamationCircleOutlined />,
      content: [
        <div
          dangerouslySetInnerHTML={{
            __html: `${sourceCard.text} </br> ${destinationCard.text}`,
          }}
        ></div>,
      ],
      onOk: () => handleMergeCards(sourceCard, destinationCard, cardsColumn),
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const handleAddWellCard = (e) => {
    console.log(formWell);
    if (
      (e.key === "Enter" || !e.key) &&
      formWell.text.length > 0 &&
      !formWell.text.includes("\n")
    ) {
      setShow({ ...show, wellVisible: false });
      console.log({ ...formWell, retro_id, created_by: user.name });
      Api.cards
        .post({ ...formWell, retro_id, created_by: user.name })
        .then((res) => {
          if ((res.statusText = "OK")) {
            setState({ ...state, wells: [...wells, res.data] });
          }
        })
        .catch((reqErr) => {
          console.error(reqErr);
          console.log(reqErr.res.status);
        });
      setFormWell(wellDefault);
    }
  };

  const handleAddImproveCard = (e) => {
    if (
      (e.key === "Enter" || !e.key) &&
      formImprove.text.length > 0 &&
      !formImprove.text.includes("\n")
    ) {
      setShow({ ...show, improveVisible: false });
      Api.cards
        .post({ ...formImprove, retro_id, created_by: user.name })
        .then((res) => {
          if ((res.statusText = "OK")) {
            setState({ ...state, improves: [...improves, res.data] });
          }
        })
        .catch((reqErr) => {
          console.error(reqErr);
          console.log(reqErr.res.status);
        });
      setFormImprove(improveDefault);
    }
  };

  const handleAddActionCard = (e) => {
    if (
      (e.key === "Enter" || !e.key) &&
      formAction.text.length > 0 &&
      !formAction.text.includes("\n")
    ) {
      setShow({ ...show, actionVisible: false });
      Api.cards
        .post({ ...formAction, retro_id, created_by: user.name })
        .then((res) => {
          if ((res.statusText = "OK")) {
            setState({ ...state, actions: [...actions, res.data] });
          }
        })
        .catch((reqErr) => {
          console.error(reqErr);
          console.log(reqErr.res.status);
        });
      setFormAction(actionDefault);
    }
  };

  const handleShowWell = () => {
    if (show.wellVisible) {
      setShow({ ...show, wellVisible: false });
      setFormWell(wellDefault);
    } else {
      setShow({ ...show, wellVisible: true });
    }
  };
  const handleShowImprove = () => {
    if (show.improveVisible) {
      setShow({ ...show, improveVisible: false });
      setFormImprove(improveDefault);
    } else {
      setShow({ ...show, improveVisible: true });
    }
  };
  const handleShowAction = () => {
    if (show.actionVisible) {
      setShow({ ...show, actionVisible: false });
      setFormAction(actionDefault);
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

  const handleCloseActionForm = () => {
    setFormAction(actionDefault);
    setShow({ ...show, actionVisible: false });
  };
  const handleCloseImproveForm = () => {
    setFormImprove(improveDefault);
    setShow({ ...show, improveVisible: false });
  };
  const handleCloseWellForm = () => {
    setFormWell(wellDefault);
    setShow({ ...show, wellVisible: false });
  };

  const handleNameModalConfirm = () => {
    if (user.name.length > 0) {
      localStorage.setItem("retro_open_user", JSON.stringify(user));
      setNameModalVisible(false);
    }
  };
  const handleModalNameChange = ({ target: { name, value } }) => {
    setUserName({ ...user, [name]: value });
    console.log(user);
  };


  const getRetroData = (id) => {
    Api.getRetro(id).get()
      .then((result) => {
        console.log(result);
      })
  };

  const updateApp=(newData)=>{
    console.log(newData.retro.cards)
    let well = newData.retro.cards.filter((item) => item.card_type === "wells");
        let retro_id = newData.retro.id;
        //setWell(well);
        let improves = newData.retro.cards.filter(
          (item) => item.card_type === "improves"
        );
        //setImproves(improves);
        let action = newData.retro.cards.filter(
          (item) => item.card_type === "actions"
        );
        setState({
          wells: well,
          improves: improves,
          actions: action,
          retro_id: retro_id,
        });

  }
  return (
    <div>
      <Modal
        title="Please type your name"
        footer={[
          <Button
            onClick={handleNameModalConfirm}
            style={{ background: "#3f5b70", color: "white" }}
          >
            Confirm
          </Button>,
        ]}
        visible={isNameModalVisible}
      >
        <Input
          size="large"
          name="name"
          onChange={handleModalNameChange}
          placeholder="Your name"
          prefix={<UserOutlined />}
        />
      </Modal>
      <div className="retro-headers">
        <div style={{ width: "30%" }}>
          <Typography>
            <h3>Went well</h3>
          </Typography>
          <button
            disabled={show.wellVisible}
            onClick={handleShowWell}
            className={show.wellVisible ? "disbled-button" : "prymary-color"}
          >
            {show.wellVisible ? "Close" : "+"}
          </button>
        </div>
        <div style={{ width: "30%" }}>
          <Typography>
            <h3>To improve</h3>
          </Typography>
          <button
            disabled={show.improveVisible}
            onClick={handleShowImprove}
            className={show.improveVisible ? "disbled-button" : "prymary-color"}
          >
            {show.improveVisible ? "Close" : "+"}
          </button>
        </div>
        <div style={{ width: "30%" }}>
          <Typography>
            <h3>Action items</h3>
          </Typography>
          <button
            disabled={show.actionVisible}
            onClick={handleShowAction}
            className={show.actionVisible ? "disbled-button" : "prymary-color"}
          >
            {show.actionVisible ? "Close" : "+"}
          </button>
        </div>
      </div>

      <div className="board-columns column-wrapper">
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ width: "30%" }}>
            <TextArea
              value={formWell.text}
              name="text"
              className="text-field"
              onKeyDown={handleAddWellCard}
              onChange={handleWellChange}
              style={{ display: show.wellVisible ? "inline-block" : "none" }}
              placeholder="What did go well ?"
              autoSize={{ minRows: 3, maxRows: 4 }}
            />
            <div className="icons-right">
              <CloseCircleFilled
                onClick={handleCloseWellForm}
                style={{ display: show.wellVisible ? "inline-block" : "none" }}
                className="remove-icon"
              />
              <CheckCircleFilled
                onClick={handleAddWellCard}
                style={{ display: show.wellVisible ? "inline-block" : "none" }}
                className="accept-icon"
              />
            </div>
            <Droppable droppableId="dropWell">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {state.wells.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <RetroCard
                          state={state}
                          setState={setState}
                          item={item}
                          provided={provided}
                          getItemStyle={getItemStyle}
                          snapshot={snapshot}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div style={{ width: "30%" }}>
            <TextArea
              value={formImprove.text}
              name="text"
              className="text-field"
              onKeyDown={handleAddImproveCard}
              onChange={handleImproveChange}
              style={{ display: show.improveVisible ? "inline-block" : "none" }}
              placeholder="What should be improved ?"
              autoSize={{ minRows: 3, maxRows: 4 }}
            />
            <div className="icons-right">
              <CloseCircleFilled
                onClick={handleCloseImproveForm}
                style={{
                  display: show.improveVisible ? "inline-block" : "none",
                }}
                className="remove-icon"
              />
              <CheckCircleFilled
                onClick={handleAddImproveCard}
                style={{
                  display: show.improveVisible ? "inline-block" : "none",
                }}
                className="accept-icon"
              />
            </div>
            <Droppable droppableId="dropImprove">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {state.improves.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <RetroCard
                          state={state}
                          setState={setState}
                          item={item}
                          provided={provided}
                          getItemStyle={getItemStyle}
                          snapshot={snapshot}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div style={{ width: "30%" }}>
            <TextArea
              value={formAction.text}
              name="text"
              className="text-field"
              style={{ display: show.actionVisible ? "inline-block" : "none" }}
              onKeyDown={handleAddActionCard}
              onChange={handleActionChange}
              placeholder="What are we going to do ?"
              autoSize={{ minRows: 3, maxRows: 4 }}
            />
            <div className="icons-right">
              <CloseCircleFilled
                onClick={handleCloseActionForm}
                style={{
                  display: show.actionVisible ? "inline-block" : "none",
                }}
                className="remove-icon"
              />
              <CheckCircleFilled
                onClick={handleAddActionCard}
                style={{
                  display: show.actionVisible ? "inline-block" : "none",
                }}
                className="accept-icon"
              />
            </div>
            <Droppable droppableId="dropAction">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {state.actions.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <RetroCard
                          state={state}
                          setState={setState}
                          item={item}
                          provided={provided}
                          getItemStyle={getItemStyle}
                          snapshot={snapshot}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
      <RetroWebSocket
        cableApp={cableApp}
        updateApp={updateApp}
        id={id}
        getRetroData={getRetroData}
        // roomData={props.roomData}
      />
    </div>
  );
};

export default Board;
