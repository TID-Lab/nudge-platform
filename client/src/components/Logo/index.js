import { Link } from "react-router-dom";

import { Flex } from "antd";

const Logo = () => {
  return (
    // <a href='https://www.projectpeach.org/' target='_blank' rel='noopener noreferrer'>
    <Link to="/">
      <Flex align="center" style={{ userSelect: "none" }}>
        <img
          src="/images/projectpeach.png"
          alt="Project Peach"
          style={{ height: 40, marginLeft: 10 }}
        ></img>

        <Flex style={{ textAlign: "left", marginLeft: "0.5em" }} gap={8}>
          <span style={{ margin: "0px" }}>
            Project <b className="bold">PEACH</b>
          </span>
          <span style={{ fontSize: "80%" }}>Nudge Dashboard</span>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Logo;
