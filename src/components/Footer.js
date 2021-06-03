import React from "react";
import "./footer.css";
import "./../App.css";
import { Typography } from "antd";

const Footer = () => {
  return (
    <footer className="footer main-light-color">
      <div className="footer-text">
        <Typography>Powered by Vineti Implemantation team</Typography>
        <Typography>v0.0.1</Typography>
      </div>
    </footer>
  );
};

export default Footer;
