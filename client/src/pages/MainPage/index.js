import './index.css';
import PostingMenu from '../../components/PostingMenu'
import PendingNudgeList from '../../components/PendingNudgeList';
import { useDispatch } from 'react-redux';
import PopupModal from '../../components/PopupModal';
import {useEffect, useState} from 'react';
import AssignMenu from '../../components/assignMenu';
import { fetchNudges } from '../../api/nudge';

console.log(fetchNudges());

const MainPage = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [nudges, setNudges] = useState([]);
  const [ currNudge, setCurrNudge ] = useState(null);
  function assign() {
    dispatch({type: 'postingMenu/set', payload: true})
  }

  useEffect(() => {
    fetchNudges().then(nudges =>
      setNudges(nudges)
    ).catch(e => console.log(e));
  }, []);

  console.log(nudges)
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


      <div className= 'NudgeList'>
      <h2 className="NudgeListTitle">Nudge List</h2>
      {nudges.map((nudge) => 
        
        <div className="flex-container">
          <div class="card">
            <p>#{count++}</p>
          </div>
          <div class="card">
            <p>{nudge.message}</p>
          </div>
          <div className="assignCard">
            <p>{nudge.com_b.join(', ')} </p>

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