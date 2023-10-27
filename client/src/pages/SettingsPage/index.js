import { useEffect, useState } from "react";
import { Layout, Typography } from "antd";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import useAuth from "../../hooks/auth";

const { Content } = Layout;
const { Title } = Typography;

const SettingsPage = () => {
  useAuth();

  return (
    <Content>
      <Title>Settings</Title>

      <section>
        <Title level={2}>Participants</Title>

        <p>Participants stuff</p>
      </section>
    </Content>
  );
};

export default SettingsPage;
