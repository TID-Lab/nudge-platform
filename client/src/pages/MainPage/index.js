import './index.css';
import PostingMenu from '../../components/PostingMenu'
import PendingNudgeList from '../../components/PendingNudgeList';
import { useDispatch } from 'react-redux';
import PopupModal from '../../components/PopupModal';
import {useEffect, useState} from 'react';
import AssignMenu from '../../components/assignMenu';
import { fetchNudges, createNudge } from '../../api/nudge';

console.log(fetchNudges());

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
      message: 'testing testing',
      date_created: Date(),
      com_b: ['motivation', 'capability']
      })
    // SOME LOGIC TO REFETCH THE NUDGE LIST -> Likely refetch nudges using api/nudge.js and update the redux state
  }


  useEffect(() => {
    fetchNudges()
      .then((nudges) => setNudges(nudges))
      .catch((e) => console.log(e));
  }, []);

  console.log(nudges);
  //<p>{nudge.message}</p>
  //<p>{nudge.com_b}</p>
  //<button onClick={() => {setShowModal(true); setCurrNudge(nudge)}}>assign</button>
  var count = 1;
  return (
  <div className='MainPage'>
    
    {showModal && <PopupModal
          content={<AssignMenu nudge={currNudge} nudgeNum={1 + nudges.findIndex((obj) => obj === currNudge)} setShowModal={setShowModal}/>}
          handleClose={() => {setShowModal(!showModal);}}
        />}

      <div className="NudgeList">
        <h2 className="NudgeListTitle">Nudge List</h2>

      <div className= 'NudgeList'>
      <h2 className="NudgeListTitle">Nudge List</h2>
      
      <button style={{height:"3rem "}} onClick={submitNudgeCreation}>Test Create Nudge using Preset Value </button>
      {nudges.map((nudge) => 
        
        <div className="flex-container">
          <div class="card">
            <p>#{count++}</p>
          </div>
        ))}
      </div>

            <button className="assignButton" onClick={() => {setShowModal(true); setCurrNudge(nudge);}}>Assign</button>
          </div>
        </div>)}
        
        </div>
      
    
    
    <div></div>
    <PendingNudgeList/> 
    <PostingMenu />
  </div>
  );
};

export default MainPage;
