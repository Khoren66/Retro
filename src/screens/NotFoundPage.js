import React from "react";
import { Link } from "react-router-dom";
import { Typography, Row, Layout, Button, Col } from "antd";
// import NavBar from "../Components/NavBar";
// import { useTranslation } from "react-i18next";
// import SEO from "../Components/SEO";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const NotFoundPage = () => {
  
  // const { t } = useTranslation();

  return (
    <div id="not-found-page">
      {/* <SEO
        pageProps={{
          title: "404 Not Found - OwlTech Agency - E-Commerce demo",
          thumbnail: "",
          url: window.location,
        }}
      /> */}
      <Content style={{ margin: "24px 24px", maxWidth: "100%", minHeight: "100vh" }}>
      <Row justify="space-around" align="middle">
        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
          <Typography className="notFound">
            <Title>404</Title>
            <Paragraph>Page Not Found</Paragraph>
            <Link to="/">
            <Button type="primary" key="console">
              Back To Sign In
            </Button>
          </Link>
          </Typography>
          </Col>
        </Row>
      </Content>
    </div>
  );
};

export default NotFoundPage;