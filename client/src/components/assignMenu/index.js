import './index.css';

import Filters from '../Filters';
import Posts from '../Posts';
import useAuth from '../../hooks/auth';
import PostingMenu from '../PostingMenu';
import { useState } from 'react';
import DemographicButton from '../DemographicButton';
import { useDispatch, useSelector } from 'react-redux';
import { checkNudges } from '../../api/nudge'
const AssignMenu = (props) => {
  const { nudge } = props;
  const race = ['Black', 'Latinx', 'White', 'Asian']
  const gender = ['Female', 'Male', 'Non-binary']
  const age = ['18-29', '30-41', '42-53', '54-65']
//   const demographicDefinitions = [
//     {name: race, entries: ['Black', 'Latinx', 'White', 'Asian']},
//     {name: gender, entries: ['Female', 'Male', 'Non-binary']},
//     {name: age, entries: ['18-29', '30-41', '42-53', '54-65']},
// ]
  const [demographics, setDemographics ] = useState([]);

  const dispatch = useDispatch();
  
  // Pending nudges = [{text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore....', categories: ['female'], assigned: 50, id: 'asdfsadfa'}]
  const pendingNudges = useSelector(state => state.pendingNudges);

  function assignNudge() {
    const reformattedNudges = pendingNudges.map((nudge) => {return {nudge_id: nudge.id, demographics: nudge.demographics}})

    reformattedNudges.push({nudge_id: nudge._id, demographics: demographics});
    console.log("SENDING"); 
    console.log(reformattedNudges)
    // console.log("THE FOLLOWING SHOULD BE AN ORDERED LIST OF ASSIGNMENTS IN FORM [{nudge_id, [demographics], [(negative demographic pairings), (negative demographic pairings)]}]");
    checkNudges(reformattedNudges).then((res) => console.log(res)).catch(e => console.log(e));
  }


  return (
    <div className='assignMenu'>
      <h5>Nudge Message: {nudge.message}</h5>
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

      
      <h2>Race</h2> 
      <div className='groupDiv'>
        {race.map((demo) => <DemographicButton label={demo}
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
      
      <h2>Gender</h2>
      <div className='groupDiv'>
        {gender.map((demo) => <DemographicButton label={demo}
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
      
      <h2>Age</h2>
      <div className='groupDiv'>
        {age.map((demo) => <DemographicButton label={demo}
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
      <button onClick={assignNudge}> Submit </button>
    </div>
  )
}

export default AssignMenu;