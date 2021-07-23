import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import Header from "../../components/Header";
import Api from "../../Api/index.js";
import Board from "../../components/Board";
import "./retroBoard.css";
import HeaderTabs from "../../components/HeaderTabs";

const RetroBoard = ({ cableApp }) => {
  const [retro, setRetro] = useState([]);
  const { cards } = retro;
  const { id } = useParams();
  useEffect( () => {
     Api.getRetro(id)
      .get()
      .then((res) => {
        setRetro(res.data);
      });
    console.log(cards);
  }, []);


  
  return (
    <div className="wrapper-scroll">
      <HeaderTabs retro={retro ? retro : ""} />
      {/* <Header retro={retro ? retro : ""} /> */}
      <Board
      cableApp={cableApp}
       />
      {/* <RetroWebSocket
        cableApp={cableApp}
        updateApp={updateApp}
        id={id}
        getRetroData={getRetroData}
        // roomData={props.roomData}
      /> */}
    </div>
  );
};

export default RetroBoard;
