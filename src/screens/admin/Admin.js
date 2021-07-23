import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import RetroEditModal from "../../components/RetroEditModal";
// import RetroForm from "../../components/RetroForm";
// import { LogoutOutlined } from "@ant-design/icons";
import "./admin.css";
import RetroTable from "../../components/RetroTable";
// import Header from "../../components/Header";
import HeaderTabs from "../../components/HeaderTabs";
import Api from "../../Api";

const defaultState = {
  visible: false,
};
const defaultRetro = {
  slug:"",
  active: false,
};

const Admin = () => {
  const [modalState, setShowModalState] = useState(defaultState);
  const [retro, setRetro] = useState(defaultRetro);
  const {slug} = retro
  const { visible } = modalState;
  useEffect(() => {}, []);



  const handleOk = ({ target: { name, value } }) => {
    console.log({ [name]: value });
    setShowModalState({
      ...modalState,
      visible: false,
    });
    Api.editRetro(slug).put({retro})
  };

  const handleCancel = (e) => {
    console.log(e);
    setShowModalState({
      ...modalState,
      visible: false,
    });
  };

  const handleModalInputChange = ({ target: { name, value } }) => {
    setRetro({
      ...retro,
      [name]: value,
    });
    console.log(retro)
  };
  const handleModalSwitchChange = (checked) => {
    console.log(checked, "active");
    setRetro({
      ...retro,
      active: checked,
    });
    console.log(retro);
  };
  const showModal = ({ team_name, active,slug }) => {
    return {
      onClick: () => {
        setRetro({
          ...retro,
          active: active,
          team_name: team_name,
          slug:slug
        });
        setShowModalState({
          visible: true,
        });
      },
    };
  };

  return (
    <div className="admin-wrapper">
      <HeaderTabs />

      <div className="table-scroll">
        <RetroEditModal
          retro={retro}
          handleModalSwitchChange={handleModalSwitchChange}
          handleModalInputChange={handleModalInputChange}
          handleOk={handleOk}
          handleCancel={handleCancel}
          visible={visible}
        />
        <RetroTable showModal={showModal} />
      </div>
    </div>
  );
};

export default Admin;
