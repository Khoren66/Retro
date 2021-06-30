import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Api from "../../Api/index.js";
import Board from "../../components/Board";
import "./retroBoard.css";

const RetroBoard = () => {
  const [retro, setRetro] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    Api.getRetro(id)
      .get()
      .then((res) => {
        setRetro(res.data);
      });
  }, []);

  return (
    <div className="wrapper-scroll">
      <Header retro={retro?retro:""} />    
      <Board />
    </div>
  );
};

export default RetroBoard;
