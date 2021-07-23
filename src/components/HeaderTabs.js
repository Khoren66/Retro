import { useHistory } from "react-router-dom";
// import { LogoutOutlined } from "@ant-design/icons";
import { Typography, Button, Row, Col } from "antd";
import RetroForm from "./RetroForm";
const { Title } = Typography;



const headerStyle = {
  style: {
    background: "#f3f6f7",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "5px solid #3f5b70",
  },
};
const HeaderTabs = ({retro}) => {
    const {team_name} = retro?retro:""
  let history = useHistory();
  const handleLogOut = () => {
    history.push("/");
    localStorage.removeItem("retro");
  };
  function callback(key) {
    history.push("/admin");
  console.log(key);
}
  return (
    <div {...headerStyle}>
      <div style={{ height: "10vh", display: "flex", alignItems: "center" }}>
        <img
          height="100%"
          src="https://res.cloudinary.com/dqoxpicbr/image/upload/v1606742493/Screen_Shot_2020-11-30_at_17.01.01_ejznq3.png"
        />
        {console.log(team_name,"retro team_name")}
        <Typography onClick={callback} className={team_name?'tab-no-line':'tab'}>DASHBOARD</Typography>
      </div>

      <Title
        style={{ color: "rgb(63 91 112)", alignSelf: "center", width: "30%",display:"contents" }}
      >
        {team_name?team_name+" Retro":"Retroboard"}
      </Title>

      <Row style={{marginRight:"5px"}}>
        <Col>
          <RetroForm />
        </Col>
        <Col>
          <Button style={{ borderRadius:"4px"}}>
            <Typography onClick={handleLogOut}>Log out</Typography>
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default HeaderTabs;
