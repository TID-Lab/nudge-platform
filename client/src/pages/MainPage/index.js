import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
  const [nudges, setNudges] = useState([]);
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
      .then((nudges) => setNudges(nudges))
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

            <Space>
              <Search
                placeholder="Search for nudges"
                allowClear
                onSearch={() => {}}
              />

              <Button type="primary">Search</Button>
              <Button>Reset</Button>

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
  );
};

export default MainPage;

const StyledContent = styled(Content)`
  padding: 1rem;
`;
