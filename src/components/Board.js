import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./board.css";
import { useParams } from "react-router-dom";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Card, Typography, Input } from "antd";
import Api from "../Api";
const { TextArea } = Input;

///   start  =======>=======>=======>

// fake data generator
// const getItems = (count, offset = 0) =>
//   Array.from({ length: count }, (v, k) => k).map((k) => ({
//     id: `item-${k + offset}`,
//     content: `item ${k + offset}`,
//   }));

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

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the wells look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  minHeight: "70vh",
  // padding: grid,
  // width: 250,
});

///////////ENDDDDDD=======>

const formWellDefault = {
  created_by: "",
  text: "",
  card_type: null,
  votes: 0,
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
  created_by: "",
  text: "",
  card_type: null,
  votes: 0,
};
const formActionDefault = {
  created_by: "",
  text: "",
  card_type: null,
  votes: 0,
};

const formVisible = {
  wellVisible: false,
  improveVisible: false,
  actionVisible: false,
};

const Board = ({ cards }) => {
  // const [wellData, setWell] = useState([]);
  const [show, setShow] = useState(formVisible);
  const [formWell, setFormWell] = useState(formWellDefault);
  const [formImprove, setFormImprove] = useState(formImproveDefault);
  const [formAction, setFormAction] = useState(formActionDefault);
  // const [improvesData, setImproves] = useState([]);
  // const [actions, setActions] = useState([]);
  const [cardsData, setCards] = useState([]);
  const { id } = useParams(); /////========>>>

  const [state, setState] = useState({
    wells: [],
    improves: [],
    actions: [],
  });
  const { actions, wells, improves } = state;
  const id2List = {
    dropWell: "wells",
    dropImprove: "improves",
    dropAction: "actions",
  };

  const getList = (id) => state[id2List[id]];

  const onDragEnd = (result) => {
    console.log(result, "result for DRAG END");
    const { source, destination } = result;
    console.log(source, "source for DRAG END");
    console.log(destination, "destination for DRAG END");
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const columnCards = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      let stateColumn = { columnCards };
      console.log(
        stateColumn,
        "STATE row 133 if (source.droppableId === destination.droppableId) {"
      );

      console.log(
        source,
        "Ssource.droppableId === (source.droppableId === destination.droppableId) {"
      );
      if (source.droppableId === "dropImprove") {
        stateColumn = { improves: columnCards };
      } else if (source.droppableId === "dropAction") {
        stateColumn = { actions: columnCards };
        console.log(
          state,
          "STATS in else if(source.droppableId === dropAction"
        );
      }

      setState({ ...state, stateColumn });
    } else {
      console.log(
        state,
        "STATE row 133 else ====>{source.droppableId === destination.droppableId) {"
      );
      console.log(
        getList(source.droppableId),
        "getList(source.droppableId)=======>"
      );
      console.log(
        getList(destination.droppableId),
        " getList(destination.droppableId)=======>"
      );

      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );
      console.log(result, "result ==========>>>RESULT");
      if (result.dropWell && result.dropImprove) {
        setState({
          ...state,
          wells: result.dropWell,
          improves: result.dropImprove,
        });
      } else if (result.dropWell && result.dropAction) {
        setState({
          ...state,
          wells: result.dropWell,
          actions: result.dropAction,
        });
      } else {
        setState({
          ...state,
          improves: result.dropImprove,
          actions: result.dropAction,
        });
      }
    }
  };

  //////======>

  useEffect(async () => {
    await Api.getRetro(id)
      .get()
      .then((res) => {
        let well = res.data.cards.filter((item) => item.card_type === "well");

        //setWell(well);
        let improves = res.data.cards.filter(
          (item) => item.card_type === "improve"
        );
        //setImproves(improves);
        let action = res.data.cards.filter(
          (item) => item.card_type === "action"
        );
        setState({
          wells: well,
          improves: improves,
          actions: action,
        });
      });
  }, []);

  const handleAddWellComment = (e) => {
    console.log(e);
    if (e.key === "Enter" || !e.key) {
      setShow({ ...show, wellVisible: false });
      setFormWell(wellDefault);
    }
    // console.log(wellData);
    // setWell([...wellData, formWell]);
  };

  const handleAddImproveComment = (e) => {
    if (e.key === "Enter" || !e.key) {
      setShow({ ...show, improveVisible: false });
      setFormImprove(improveDefault);
    }
    //console.log(improvesData);
    //setImproves([...improvesData, formImprove]);
  };

  const handleAddActionComment = (e) => {
    if (e.key === "Enter" || !e.key) {
      setShow({ ...show, actionVisible: false });
      setFormAction(actionDefault);
      setState({
        ...state,
        actions: [...actions, formAction],
      });
    }
    // console.log(actions);
    // setActions([...actions, formAction]);
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

  const handleCloseActionForm=()=>{
    setFormAction(formActionDefault);
    setShow({ ...show, actionVisible: false });
  }
  const handleCloseImproveForm=()=>{
    setFormImprove(formImproveDefault);
    setShow({ ...show, improveVisible: false });
  }
  const handleCloseWellForm=()=>{
    setFormWell(formWellDefault);
    setShow({ ...show, wellVisible: false });
  }

  return (
    <div>
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
        {/* ============>>>>>>>> */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ width: "30%" }}>
            <TextArea
              value={formWell.textWell}
              name="textWell"
              className="text-field"
              onKeyDown={handleAddWellComment}
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
                onClick={handleAddWellComment}
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
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {item.text}
                        </div>
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
              value={formImprove.textImprove}
              name="textImprove"
              className="text-field"
              onKeyDown={handleAddImproveComment}
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
                onClick={handleAddImproveComment}
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
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {item.text}
                        </div>
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
              value={formAction.textAction}
              name="textAction"
              className="text-field"
              style={{ display: show.actionVisible ? "inline-block" : "none" }}
              onKeyDown={handleAddActionComment}
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
                onClick={handleAddActionComment}
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
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {item.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>

        {/* ============>>>>>>>> */}
        {/* <div className="column-style">
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

          </div>
        </div> 

        {/* <div className="column-style">
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
        </div> */}
      </div>
    </div>
  );
};

export default Board;
