import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Layout, Space, Button, Menu, Input, Drawer } from "antd";
import "./index.css";

import Logo from "../Logo";
import CreateNudgeDrawer from "../Drawer/CreateNudgeDrawer";
import { createNudge } from "../../api/nudge";

const { Header: AntHeader } = Layout;

const Header = () => {
  const { pathname } = useLocation(); // TODO show search only if in dashboard mode
  // const [postingVisible, setPostingVisible] = useState(false);
  const dispatch = useDispatch();
  const postingMenu = useSelector((state) => state.postingMenu);
  function onMenuClick() {
    dispatch({ type: "postingMenu/set", payload: !postingMenu });
  }
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [resp, setResp] = useState({
    state: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const newNudge = {
      message: "",
      date_created: Date(),
      com_b: [],
    };

    [...formData.entries()].forEach((field) => {
      const label = field[0];
      const value = field[1];

      if (label === "com_b") {
        newNudge["com_b"].push(value);
      } else {
        newNudge[label] = value;
      }
    });

    try {
      await createNudge(newNudge);
      dispatch({ type: "nudges/add", payload: newNudge });
      setIsModelOpen(false);
    } catch (err) {
      // TODO: Make alert messages more user-readable
      setResp({
        state: "error",
        message: err.message,
      });
    }
  };
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
        
                <CreateNudgeDrawer
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
        />
      </AntHeader>
        <button onClick={() => setIsModelOpen(true)}>Create Nudge</button>
        {isModelOpen && (
          <PopupModal
            content={
              <>
                <h4>Create Nudge</h4>
                <form method="post" onSubmit={handleSubmit}>
                  <div>
                    <label>
                      Com-B (optional)
                      <select name="com_b" multiple>
                        <option value="capability">Capability</option>
                        <option value="opportunity">Opportunity</option>
                        <option value="motivation">Motivation</option>
                      </select>
                    </label>
                  </div>
                  
                  <div>
                    <label>
                      Nudge Content
                      <textarea
                        name="message"
                        placeholder="Please input the nudge content"
                      />
                    </label>
                  </div>
                  
                  <div>
                    <label>
                      Comment
                      <textarea
                        name="comment"
                        placeholder="Please input any comment to this nudge"
                      />
                    </label>
                  </div>
                  {resp.state === "error" && <p>{resp.message}</p>}

                  <button>Cancel</button>
                  <button type="submit">Confirm</button>
                </form>
              </>
            }
            handleClose={() => setIsModelOpen(false)}
          />
        )}
      </div>
    );
};

export default Header;
