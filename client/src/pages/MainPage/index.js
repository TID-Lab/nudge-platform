import { useEffect, useState } from "react";
import { Col, Layout, Row, Space, Input, Button, Table, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import PendingNudgeList from "../../components/PendingNudgeList";
import AssignDrawer from "../../components/Drawers/AssignDrawer";
import NudgeBar from "../../components/NudgeBar";
import { fetchNudges, fetchTotalParticipants } from "../../api/nudge";
import "./index.css";

const { Content } = Layout;
const { Search } = Input;

const MainPage = () => {
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [assignedNudge, setAssignedNudge] = useState({ key: 0, message: "" });
  const [totalParticipants, setTotalParticipants] = useState(0);
  const pendingNudges = useSelector((state) => state.pendingNudges);

  const dispatch = useDispatch();
  const nudges = useSelector((state) => state.nudges);

  useEffect(() => {
    fetchNudges()
      .then((nudges) => {
        dispatch({
          type: "nudges/set",
          payload: nudges.map((nudge, i) => {
            return { ...nudge, key: i };
          }),
        });
      })
      .catch((e) => console.log(e));

    fetchTotalParticipants()
      .then((numParticipants) => setTotalParticipants(numParticipants))
      .catch((err) => console.log("err:" + err));
  }, [dispatch]);

  if (nudges.length === 0) {
    return <>Loading</>;
  } else {
    return (
      <>
        <StyledContent>
          <Row gutter={32}>
            <Col span={16}>
              <NudgeBar nudges={pendingNudges} total={totalParticipants} />

              <h3>Nudge List</h3>

              <Space>
                <Search
                  placeholder="Search for nudges"
                  allowClear
                  onSearch={() => {}}
                  disabled
                />
                <Button type="primary">Search</Button>
                <Button>Reset</Button>
              </Space>

              <Table
                columns={[
                  {
                    title: "#",
                    render: (nudge) => <>{nudge.key + 1}</>,
                  },
                  {
                    title: "Nudge Content",
                    dataIndex: "message",
                  },
                  {
                    title: "COM-B",
                    dataIndex: "com_b",
                    render: (_, { com_b }) => (
                      <>
                        {com_b.map((tag) => {
                          return <Tag key={tag}>{tag.toUpperCase()}</Tag>;
                        })}
                      </>
                    ),
                  },
                  {
                    title: "Comment",
                  },
                  {
                    title: "Actions",
                    render: (_, nudge) => (
                      <Space>
                        <Button
                          onClick={() => {
                            setIsAssignDrawerOpen(true);
                            setAssignedNudge(nudge);
                          }}
                        >
                          Assign
                        </Button>
                        <Button icon={<DeleteOutlined />} danger />
                      </Space>
                    ),
                  },
                ]}
                dataSource={[...nudges].sort(
                  (a, b) => new Date(b.date_created) - new Date(a.date_created)
                )}
              />
            </Col>
            <Col span={8}>
              <PendingNudgeList total={totalParticipants} />
              {/* <PostingMenu /> */}
            </Col>
          </Row>
        </StyledContent>

        <AssignDrawer
          open={isAssignDrawerOpen}
          onClose={() => setIsAssignDrawerOpen(false)}
          nudge={assignedNudge}
        />
      </>
    );
  }
};

export default MainPage;

const StyledContent = styled(Content)`
  padding: 1rem;
`;
