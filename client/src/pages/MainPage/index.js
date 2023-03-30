import { useEffect, useState } from "react";
import {
  Col,
  Layout,
  Row,
  Space,
  Input,
  Button,
  Table,
  Tag,
  Popconfirm,
  message,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Fuse from "fuse.js";

import PendingNudgeList from "../../components/PendingNudgeList";
import AssignDrawer from "../../components/Drawers/AssignDrawer";
import NudgeBar from "../../components/NudgeBar";
import {
  deactivateNudge,
  fetchNudges,
  fetchTotalParticipants,
} from "../../api/nudge";
import "./index.css";

const { Content } = Layout;
const { Search } = Input;

const MainPage = () => {
  const dispatch = useDispatch();
  const nudges = useSelector((state) => state.nudges);
  const pendingNudges = useSelector((state) => state.pendingNudges);

  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [assignedNudge, setAssignedNudge] = useState({ key: 0, message: "" });
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [query, setQuery] = useState("");

  const fuse = new Fuse(nudges, { keys: ["message"] });

  useEffect(() => {
    fetchNudges()
      .then((nudges) => {
        dispatch({
          type: "nudges/set",
          payload: nudges,
        });
      })
      .catch((e) => console.log(e));

    fetchTotalParticipants()
      .then((numParticipants) => setTotalParticipants(numParticipants))
      .catch((err) => console.log("err:" + err));
  }, [dispatch]);

  const onNudgeArchive = async (nudge) => {
    const inActiveNudge = {
      ...nudge,
      is_active: false,
    };

    try {
      await deactivateNudge(nudge._id);
      dispatch({
        type: "nudges/replace",
        payload: inActiveNudge,
      });
      message.success("Nudge archived.");
    } catch (e) {
      message.error("An error occurred. Please try again.");
    }
  };

  const onSearch = (value) => {
    setQuery(value);
  };

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

              <Space style={{ marginBottom: "1rem" }}>
                <Search
                  placeholder="Search for nudges"
                  allowClear
                  enterButton="Search"
                  onSearch={onSearch}
                />
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
                    filters: [
                      {
                        value: "c-psy",
                        text: "Psychological Capability",
                      },
                      {
                        value: "c-phy",
                        text: "Physical Capability",
                      },

                      {
                        value: "o-soc",
                        text: "Social Opportunity",
                      },
                      {
                        value: "o-phy",
                        text: "Physical Opportunity",
                      },
                      {
                        value: "m-ref",
                        text: "Reflective Motivation",
                      },
                      {
                        value: "m-auto",
                        text: "Automatic Motivation",
                      },
                    ],
                    render: (_, { com_b }) => (
                      <>
                        {com_b.map((tag) => {
                          return <Tag key={tag}>{tag.toUpperCase()}</Tag>;
                        })}
                      </>
                    ),
                    onFilter: (value, record) => record.com_b.includes(value),
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
                        <Popconfirm
                          title="Archive nudge"
                          description="Are you sure you want to archive this nudge?"
                          onConfirm={() => onNudgeArchive(nudge)}
                        >
                          <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
                dataSource={[
                  ...(query === ""
                    ? nudges
                    : fuse.search(query).map(({ item }) => item)),
                ].filter((nudge) => nudge.is_active)}
              />
            </Col>
            <Col span={8} style={{ borderLeft: "2px solid #f0f0f0" }}>
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
