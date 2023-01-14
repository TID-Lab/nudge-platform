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
  return (
  <div className='MainPage'>
    {showModal && <PopupModal
          content={<AssignMenu nudge={currNudge}/>}
          handleClose={() => {setShowModal(!showModal);}}
        />}

    {
      nudges.map((nudge) => 
        <>
        <h5>{nudge.message}</h5>
        <button onClick={() => {setShowModal(true); setCurrNudge(nudge)}}>assign</button>
        </>
      )
    }
    <button onClick={() => setShowModal(true)}>assign</button>
    
    <div></div>
    <PendingNudgeList/> 
    <PostingMenu />
  </div>
  );
};

export default MainPage;