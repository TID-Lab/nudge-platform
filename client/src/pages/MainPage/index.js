import { useEffect, useState } from "react";
import {
  Col,
  Layout,
  Row,
  Progress,
  Card,
  Statistic,
  Space,
  Input,
  Button,
  Table,
  Tag,
} from "antd";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import PostingMenu from "../../components/PostingMenu";
import PendingNudgeList from "../../components/PendingNudgeList";
import PopupModal from "../../components/PopupModal";
import AssignMenu from "../../components/assignMenu";
import { fetchNudges } from "../../api/nudge";
import "./index.css";
import AssignDrawer from "../../components/Drawer/AssignDrawer";

const { Content } = Layout;
const { Search } = Input;

const MainPage = () => {
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [assignedNudge, setAssignedNudge] = useState({ key: 0, message: "" });

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
  }, [dispatch]);

  function assign() {
    dispatch({ type: "postingMenu/set", payload: true });
  }

  if (nudges.length === 0) {
    return <>Loading</>;
  } else {
    return (
      <>
        <StyledContent>
          <Row gutter={32}>
            <Col span={16}>
              <Progress percent={30} />
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic title="Assigned" value={69} suffix="/ 100" />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <h3>Nudge List</h3>

              <Space>
                <Search
                  placeholder="Search for nudges"
                  allowClear
                  onSearch={() => {}}
                />
                <Button type="primary">Search</Button>
                <Button>Reset</Button>
              </Space>

              <Table
                columns={[
                  {
                    title: "#",
                    dataIndex: "key",
                    render: (key) => <>{key + 1}</>,
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
                      <Button
                        onClick={() => {
                          setIsAssignDrawerOpen(true);
                          setAssignedNudge(nudge);
                        }}
                      >
                        Assign
                      </Button>
                    ),
                  },
                ]}
                dataSource={nudges}
              />
            </Col>
            <Col span={8}>
              <PendingNudgeList />
              <PostingMenu />
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
