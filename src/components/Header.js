import React from "react";
import { Typography, Image } from "antd";

const { Title } = Typography;

const headerStyle = {
  style: {
    background: "#f3f6f7",
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
    alignItems:"center",
    borderBottom:"5px solid #3f5b70"
  },
};

const Header = ({team_name}) => {
  return (
    <div {...headerStyle}>
      <div style={{height:"10vh"}}>
        <img height="100%" src="https://res.cloudinary.com/dqoxpicbr/image/upload/v1606742493/Screen_Shot_2020-11-30_at_17.01.01_ejznq3.png" />
      </div>
      <Title style={{color:"rgb(63 91 112)",alignSelf:"center"}}><i>Retroboard</i></Title>
      <Title style={{marginRight:"10px",color:"rgb(243 246 247)"}}>{team_name?team_name:"default Team"}</Title>
    </div>
  );
};

export default Header;
