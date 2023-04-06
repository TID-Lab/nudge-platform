import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Layout, Space, Button, Menu, Input, Form } from "antd";
import { FormOutlined } from "@ant-design/icons";
import styled from "styled-components";

import Logo from "../Logo";
import CreateNudgeDrawer from "../Drawers/CreateNudgeDrawer";
import { createNudge, fetchNudges } from "../../api/nudge";

const { Header: AntHeader } = Layout;

const Header = () => {
  const { pathname } = useLocation(); // TODO show search only if in dashboard mode
  const dispatch = useDispatch();
  const postingMenu = useSelector((state) => state.postingMenu);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [resp, setResp] = useState({
    state: "",
  });

  function onMenuClick() {
    dispatch({ type: "postingMenu/set", payload: !postingMenu });
  }

  return (
    <StyledHeader>
      <nav className="nav">
        <Space>
          <Logo />

          <Menu
            mode="horizontal"
            items={[{ label: "Nudges" }, { label: "Analytics" }]}
          />
        </Space>

        <Space>
          <Input.Search placeholder="Search" disabled size="large" />
          <Button
            size="large"
            type="primary"
            icon={<FormOutlined />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Create Nudge
          </Button>
        </Space>

        <Space style={{ width: 300 }}> </Space>
      </nav>

      <Form.Provider
        onFormFinish={(name, { values }) => {
          if (name === "createNudgeForm") {
            const newNudge = {
              ...values,
              date_created: Date(),
              is_active: true,
            };

            createNudge(newNudge)
              // TODO: More elegant way to sync/refetch. https://redux.js.org/tutorials/essentials/part-5-async-logic
              .then(() => fetchNudges())
              .then((nudges) =>
                dispatch({
                  type: "nudges/set",
                  payload: nudges,
                })
              )
              .catch((err) => {
                // TODO: Make alert messages more user-readable
                setResp({
                  state: "error",
                  message: err.message,
                });
              });
          }

          setIsDrawerOpen(false);
        }}
      >
        <CreateNudgeDrawer
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
        />
      </Form.Provider>
    </StyledHeader>
  );
};

export default Header;

const StyledHeader = styled(AntHeader)`
  &.ant-layout-header {
    background-color: var(--body-background);
    padding: 1rem;
  }

  .ant-menu {
    min-width: 15rem;
    margin-left: 1rem;
    margin-right: 1rem;
    background-color: var(--body-background);
  }

  .menu-action-group {
    display: flex;
  }

  .nav {
    display: flex;
    justify-content: space-between;
  }
`;
