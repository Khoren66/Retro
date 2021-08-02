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
import RetroWebSocket from "./RetroWebSocket";
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
  console.log(result, "result 42 tox");
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

const defaultCard={
  created_by: "",
  // text: "",
  card_type: "",
  votes: 0,
}

const id2List = {
  wells: "wells",
  improves: "improves",
  actions: "actions",
};

const Board = ({ cableApp }) => {
  const [show, setShow] = useState({});
  const [formCard, setFormCard] = useState(defaultCard);
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
    let form = ["wells", "improves", "actions"].map((item) => ({
      [item]: false,
    }));
    console.log(form);
    setShow(form);
    // let stateColumns ={}
    await Api.getRetro(id)
      .get()
      .then((res) => {
        let retro_id = res.data.id;
        let stateColumns =  ["wells", "improves", "actions"].map((type) => (
          {[type]: res.data.cards_data[type]}
        ))
        stateColumns = stateColumns.reduce(function(result, item) {
          var key = Object.keys(item)[0];
          result[key] = item[key];
          return result;
        }, {})
      
        setState({
          ...stateColumns,
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
        source.droppableId === "improves" &&
        improves[source.index].id !== improves[destination.index].id
      ) {
        showConfirm(
          improves[source.index],
          improves[destination.index],
          "improves"
        );
        stateColumn = { improves: columnCards };
      } else if (
        source.droppableId === "actions" &&
        actions[source.index].id !== actions[destination.index].id
      ) {
        showConfirm(
          actions[source.index],
          actions[destination.index],
          "actions"
        );
        stateColumn = { actions: columnCards };
      } else if (
        source.droppableId === "wells" &&
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
      let updatedCard = {};
      console.log(result, "result ==========>>>RESULT");
      if (result.wells && result.improves) {
        console.log(wells[source.index], "=========>>>start");
        console.log(improves[destination.index], "=========>>>end");
        console.log(source, "source", destination, "destination");
        if (source.droppableId === "wells") {
          updatedCard = { ...wells[destination.index], card_type: "improves" };
          console.log(
            wells[destination.index],
            "this  card type must be edites to improves"
          );
          Api.editDeleteCard(wells[destination.index].id).put(updatedCard);
        } else {
          updatedCard = { ...improves[source.index], card_type: "wells" };
          console.log(
            improves[source.index],
            "this  card type must be edites to well"
          );
          Api.editDeleteCard(improves[source.index].id).put(updatedCard);
        }
        setState({
          ...state,
          wells: result.wells,
          improves: result.improves,
        });
      } else if (result.wells && result.actions) {
        if (source.droppableId === "wells") {
          updatedCard = { ...wells[destination.index], card_type: "actions" };
          console.log(
            wells[destination.index],
            "this  card type must be edites to actions"
          );
          Api.editDeleteCard(wells[source.index].id).put(updatedCard);
        } else {
          updatedCard = { ...actions[source.index], card_type: "wells" };
          console.log(
            actions[source.index],
            "this  card type must be edites to wells"
          );
          Api.editDeleteCard(actions[source.index].id).put(updatedCard);
        }
        setState({
          ...state,
          wells: result.wells,
          actions: result.actions,
        });
      } else {
        if (source.droppableId === "improves") {
          updatedCard = { ...improves[source.index], card_type: "actions" };
          Api.editDeleteCard(improves[source.index].id).put(updatedCard);
          console.log(
            improves[source.index],
            "this  card type must be edites to action"
          );
        } else {
          updatedCard = {
            ...actions[destination.index],
            card_type: "improves",
          };
          Api.editDeleteCard(actions[destination.index].id).put(updatedCard);
          console.log(
            actions[destination.index],
            "this  card type must be edites to improves"
          );
        }
        setState({
          ...state,
          improves: result.improves,
          actions: result.actions,
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
      console.log("removed dublicates");
      mergedCard.created_by = `${filteredDestination[0].created_by},${removingCard[0].created_by}`;
      console.log(mergedCard.created_by.trim(), "========trim");
      let arraySplit = mergedCard.created_by.trim().split(",");

      mergedCard.created_by = arraySplit
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        })
        .join(",");
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

  const handleAddCard = (e,type) => {
    
    if (
      (e.key === "Enter" || !e.key) &&
      formCard[`${type}-text`].length > 0 &&
      !formCard[`${type}-text`].includes("\n")
    ) {
      setShow({ ...show, [type]: false });
     let newCard = { ...formCard,text:formCard[`${type}-text`], retro_id, created_by: user.name ,card_type:type }
       Api.cards
        .post(newCard)
        .then((res) => {
          if ((res.statusText = "OK")) {
            setState({ ...state, [type]: [...state[type], res.data] });
          }
        })
        .catch((reqErr) => {
          console.error(reqErr);
          console.log(reqErr.res.status);
        });
      setFormCard({...formCard,[`${type}-text`]:""});
    }
  };

  const handleShowCardForm = (item) => {
    setShow({...show,[item]:true})
  };

  const handleCardChange = ({ target: { name, value } }) => {
    setFormCard({ ...formCard, [name]: value });
    console.log(formCard)
  };

  const handleCloseCardForm = (type) => {
    console.log(type,"type close")
    // setFormCard(wellDefault);
    setShow({ ...show, [type]: false });
    setFormCard(defaultCard)
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
    Api.getRetro(id)
      .get()
      .then((result) => {
        console.log(result);
      });
  };

  const updateApp = (newData) => {
    console.log(newData.retro.cards);
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
  };
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
      </div>

      <div className="board-columns column-wrapper">
        <DragDropContext onDragEnd={onDragEnd}>
          {["wells", "improves", "actions"].map((type, index) => (
            <div style={{ width: "30%" }}>
              <div>
                <Typography>
                  <h3>{type}</h3>
                </Typography>
                <button
                  disabled={show[type]}
                  onClick={()=>handleShowCardForm(type)}
                  className={
                    show[type] ? "disbled-button" : "prymary-color"
                  }
                >
                  {show[type] ? "Close" : "+"}
                </button>
              </div>
              <TextArea
                value={formCard[`${type}-text`]}
                name={`${type}-text`}
                className="text-field"
                onKeyDown={(e)=>handleAddCard(e,type)}
                onChange={handleCardChange}
                style={{ display: show[type] ? "inline-block" : "none" }}
                placeholder="What ?"
                autoSize={{ minRows: 3, maxRows: 4 }}
              />
              <div className="icons-right">
                <CloseCircleFilled
                  onClick={()=>handleCloseCardForm(type)}
                  style={{
                    display: show[type] ? "inline-block" : "none",
                  }}
                  className="remove-icon"
                />
                <CheckCircleFilled
                  onClick={(e)=>handleAddCard(e,type)}
                  style={{
                    display: show[type]? "inline-block" : "none",
                  }}
                  className="accept-icon"
                />
              </div>

              <Droppable droppableId={type}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {state[type].map((item, index) => (
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
          ))}
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
