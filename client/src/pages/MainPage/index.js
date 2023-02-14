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
import { fetchNudges, createNudge } from "../../api/nudge";
import "./index.css";

console.log(fetchNudges());

const { Content } = Layout;
const { Search } = Input;

const MainPage = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [_, setNudges] = useState([]);
  const nudges = useSelector((state) => state.nudges);
  const [currNudge, setCurrNudge] = useState(null);
  function assign() {
    dispatch({ type: "postingMenu/set", payload: true });
  }

  function submitNudgeCreation() {
    createNudge({
      message: "testing testing",
      date_created: Date(),
      com_b: ["motivation", "capability"],
    });
    // SOME LOGIC TO REFETCH THE NUDGE LIST -> Likely refetch nudges using api/nudge.js and update the redux state
  }

  useEffect(() => {
    fetchNudges()
      .then((nudges) => dispatch({ type: "nudges/set", payload: nudges }))
      .catch((e) => console.log(e));
  }, []);

  console.log(nudges);
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
    <div className="MainPage">
      {showModal && (
        <PopupModal
          content={
            <AssignMenu
              nudge={currNudge}
              nudgeNum={1 + nudges.findIndex((obj) => obj === currNudge)}
              setShowModal={setShowModal}
            />
          }
          handleClose={() => {
            setShowModal(!showModal);
          }}
        />
      )}

            <Space>
              <Search
                placeholder="Search for nudges"
                allowClear
                onSearch={() => {}}
              />
      <div className="NudgeList">
        <h2 className="NudgeListTitle">Nudge List</h2>

              <Button type="primary">Search</Button>
              <Button>Reset</Button>
        {nudges.map((nudge, i) => (
          <div className="flex-container" key={i}>
            <div className="card">
              <p>#{count++}</p>
            </div>
            <div className="card">
              <p>{nudge.message}</p>
            </div>
            <div className="assignCard">
              <p>{nudge.com_b.join(", ")} </p>

              <button
                className="assignButton"
                onClick={() => {
                  setShowModal(true);
                  setCurrNudge(nudge);
                }}
              >
                Assign
              </button>
            </div>
          </div>
        ))}
      </div>

              <Button onClick={submitNudgeCreation} type="dashed">
                Test Create Nudge using Preset Value
              </Button>
            </Space>

            <Table
              columns={[
                {
                  title: "#",
                  dataIndex: "index",
                  render: (_, __, i) => <>{i + 1}</>,
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
                        setShowModal(true);
                        setCurrNudge(nudge);
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
            {/* <PendingNudgeList /> */}
            <PostingMenu />
          </Col>
        </Row>
      </StyledContent>

      {showModal && (
        <PopupModal
          content={
            <AssignMenu
              nudge={currNudge}
              nudgeNum={1 + nudges.findIndex((obj) => obj === currNudge)}
              setShowModal={setShowModal}
            />
          }
          handleClose={() => {
            setShowModal(!showModal);
          }}
        />
      )}
    </>
      <PendingNudgeList />
      <PostingMenu />
    </div>
  );
};

export default MainPage;

const StyledContent = styled(Content)`
  padding: 1rem;
`;

