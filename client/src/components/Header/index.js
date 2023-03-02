import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Layout, Space, Button, Menu, Input, Form } from "antd";
import "./index.css";

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
    <AntHeader>
      <Logo />

      <Menu
        mode="horizontal"
        items={[{ label: "Nudges" }, { label: "Analytics" }]}
      />

      <Space>
        <Input placeholder="Search" />
        <Button onClick={() => setIsDrawerOpen(true)}>Create Nudge</Button>
      </Space>

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
                  payload: nudges.map((nudge, i) => {
                    return { ...nudge, key: i };
                  }),
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
    </AntHeader>
  );
};

export default Header;
