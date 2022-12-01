import './index.css';
import PostingMenu from '../../components/PostingMenu'
import PendingNudgeList from '../../components/PendingNudgeList';
import { useDispatch } from 'react-redux';
import PopupModal from '../../components/PopupModal';
import {useState} from 'react';
import AssignMenu from '../../components/assignMenu';
const MainPage = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  function assign() {
    dispatch({type: 'postingMenu/set', payload: true})
  }
  return (
  <div className='MainPage'>
    {showModal && <PopupModal
          content={<AssignMenu />}
          handleClose={() => {setShowModal(!showModal);}}
        />}

    <button onClick={() => setShowModal(true)}>assign</button>
    
    <div></div>
    <PendingNudgeList/> 
    <PostingMenu />
  </div>
  );
};

export default MainPage;