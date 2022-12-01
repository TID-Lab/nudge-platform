import './index.css';

import Filters from '../Filters';
import Posts from '../Posts';
import useAuth from '../../hooks/auth';
import PostingMenu from '../PostingMenu';
import { useState } from 'react';
import DemographicButton from '../DemographicButton';
const AssignMenu = (props) => {
  const { nudge } = props;
  const race = ['Black', 'Latinx', 'White', 'Asian']
  const gender = ['Female', 'Male', 'Non-binary']
  const age = ['18-29', '30-41', '42-53', '54-65']
  const demographicDefinitions = [
    {name: race, entries: ['Black', 'Latinx', 'White', 'Asian']},
    {name: gender, entries: ['Female', 'Male', 'Non-binary']},
    {name: age, entries: ['18-29', '30-41', '42-53', '54-65']},
]
  const [demographics, setDemographics ] = useState([]);

  return (
    <div className='assignMenu'>
    
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

      
      <h1>Race</h1> 
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
      
      <h1>Gender</h1>
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
      
      <h1>Age</h1>
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
    </div>
  )
}

export default AssignMenu;