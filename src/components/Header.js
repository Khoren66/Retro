import React from "react";
import { Typography } from "antd";
const { Title } = Typography;

const headerStyle = {
  style: {
    background: "#f3f6f7",
    display: "flex",
    justifyContent: "space-around",
    alignItems:"center",
    borderBottom:"5px solid #3f5b70"
  },
};

const Header = ({retro}) => {
const {team_name} = retro?retro:""
  return (
    <div {...headerStyle}>
      <div style={{height:"10vh",width:"30%"}}>
        <img height="100%" src="https://res.cloudinary.com/dqoxpicbr/image/upload/v1606742493/Screen_Shot_2020-11-30_at_17.01.01_ejznq3.png" />
      </div>
      {console.log(team_name)}
      <Title style={{color:"rgb(63 91 112)",alignSelf:"center",width:"30%"}}>Retroboard</Title>
      <Title style={{color:"rgb(63 91 112)",width:"30%"}}>{team_name?team_name:""}</Title>
    </div>
  );
};


export default Header