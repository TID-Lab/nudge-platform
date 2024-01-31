import "./index.css";

import { useState } from "react";
import DemographicButton from "../DemographicButton";
import { useDispatch, useSelector } from "react-redux";
import { checkAssignment } from "../../api/nudge";

import ErrorBanner from "../ErrorBanner";
const AssignMenu = (props) => {
  const { nudge, nudgeNum, setShowModal } = props;
  const race = ["Black", "Latinx", "White", "Asian"];
  const gender = ["Female", "Male", "Non-binary"];
  const age = ["18-29", "30-41", "42-53", "54-65"];
  //   const demographicDefinitions = [
  //     {name: race, entries: ['Black', 'Latinx', 'White', 'Asian']},
  //     {name: gender, entries: ['Female', 'Male', 'Non-binary']},
  //     {name: age, entries: ['18-29', '30-41', '42-53', '54-65']},
  // ]
  const [demographics, setDemographics] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  // Pending nudges = [{text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore....', categories: ['female'], assigned: 50, id: 'asdfsadfa'}]
  const pendingNudges = useSelector((state) => state.pendingNudges);

  function assignNudge() {
    if (demographics.length === 0) {
      setErrorMessage(
        'No demographics were chosen. Consider "All Remaining" to select every participant.'
      );
      setShowError(true);
      return;
    }

    if (
      demographics.length > 1 &&
      demographics.findIndex((obj) => obj === "All Unassigned") !== -1
    ) {
      setErrorMessage(
        'Cannot select "All Remaining" with other demographics selected.'
      );
      setShowError(true);
      return;
    }

    const reformattedNudges = pendingNudges.map((nudge) => {
      return {
        nudge_id: nudge.id,
        demographics: nudge.demographics,
        nudge_message: nudge.text,
      };
    });

    reformattedNudges.push({
      nudge_id: nudge._id,
      demographics: demographics,
      nudge_message: nudge.message,
    });
    console.log("SENDING");
    console.log(reformattedNudges);
    // console.log("THE FOLLOWING SHOULD BE AN ORDERED LIST OF ASSIGNMENTS IN FORM [{nudge_id, [demographics], [(negative demographic pairings), (negative demographic pairings)]}]");
    checkAssignment(reformattedNudges)
      .then((res) => {
        console.log(res);
        const last_res = res[reformattedNudges.length - 1];
        if (last_res.success_code === "SUCCESS") {
          dispatch({
            type: "pendingNudges/add",
            payload: {
              text: nudge.message,
              demographics: demographics,
              assigned: last_res.num_assigned,
            },
          });
          setShowModal(false);
        } else if (last_res.success_code === "NO_PARTICIPANT") {
          setErrorMessage(
            'No participants are left with this demographic grouping. Please try a different combination, or use "All Remaining."'
          );
          setShowError(true);
        }
      })
      .catch((e) => console.log(e));
  }

  return (
    <div className="assignMenu">
      <h5>
        Nudge #{nudgeNum}: {nudge.message}
      </h5>
      {/*       
      {demographicDefinitions.map(demographic => {<div>
        <h1>demographic.name</h1>
        <div className='groupDiv'>
        {demographic.map((demo) => <DemographicButton label={demo}
          toggleFunction={
            ()=> { 
              if (demographics.includes(demo)) {
                setDemographics(demographics.filter(item => item !== demo))
              } else {
                setDemographics([...demographics, demo])
              }
            }
          }
          />)
        }
      </div>
      </div>
      })} */}

      <h2 className="assignTitle">Race</h2>
      <div className="groupDiv">
        {race.map((demo) => (
          <DemographicButton
            label={demo}
            toggleFunction={() => {
              if (demographics.includes(demo)) {
                setDemographics(demographics.filter((item) => item !== demo));
              } else {
                setDemographics([...demographics, demo]);
              }
            }}
          />
        ))}
      </div>

      <h2 className="assignTitle">Gender</h2>
      <div className="groupDiv">
        {gender.map((demo) => (
          <DemographicButton
            label={demo}
            toggleFunction={() => {
              if (demographics.includes(demo)) {
                setDemographics(demographics.filter((item) => item !== demo));
              } else {
                setDemographics([...demographics, demo]);
              }
            }}
          />
        ))}
      </div>

      <h2 className="assignTitle">Age</h2>
      <div className="groupDiv">
        {age.map((demo) => (
          <DemographicButton
            label={demo}
            toggleFunction={() => {
              if (demographics.includes(demo)) {
                setDemographics(demographics.filter((item) => item !== demo));
              } else {
                setDemographics([...demographics, demo]);
              }
            }}
          />
        ))}
      </div>
      <h2 className="assignTitle"></h2>
      <div className="groupDiv">
        <DemographicButton
          label={"All Unassigned"}
          toggleFunction={() => {
            if (demographics.includes("All Unassigned")) {
              setDemographics(
                demographics.filter((item) => item !== "All Unassigned")
              );
            } else {
              setDemographics([...demographics, "All Unassigned"]);
            }
          }}
        />
      </div>

      <h2 className="assignTitle"></h2>
      <div className="groupDiv">
        <DemographicButton label={"Participant Placeholder"} />
      </div>
      {showError && <ErrorBanner text={errorMessage}></ErrorBanner>}
      {!showError && <div style={{ height: "5em" }}></div>}
      <button onClick={assignNudge}> Submit </button>
    </div>
  );
};

export default AssignMenu;
