import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import './index.css';

import DateFilter from '../DateFilter';
import TopicFilter from '../TopicFilter';
import AccountFilters from '../AccountFilters';
import PlatformFilter from '../PlatformFilter';
import { getPosts } from '../../api/post';
import notify from '../../util/notify';
import PendingNudge from '../PendingNudge';
import { fetchTotalParticipants } from '../../api/nudge';
import ErrorBanner from '../ErrorBanner';


const PendingNudgeList = () => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector(state => state.pendingNudges);
  const [numParticipants, setNumParticipants] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [ showError, setShowError ] = useState(false)
  const [ showSuccess, setShowSuccess ] = useState(false)
  // dispatch({ type: 'pendingNudges/set', payload: [{text: 'lorum ipsum', categories: ['female'], assigned: 50}]})
  useEffect(() => {
    // console.log("hello")
    fetchTotalParticipants().then((numParticipants) => setTotalParticipants(numParticipants)).catch((err) => console.log("err:" + err));
    // dispatch({ type: 'pendingNudges/add', payload: {text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore....', demographics: ['female'], assigned: 50}})
    // dispatch({ type: 'pendingNudges/add', payload: {text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore....', demographics: ['female', 'asian'], assigned: 50}})
  }, [  ])

  useEffect(() => {
    let participants = 0;
    pendingNudges.forEach((nudge) => participants += nudge.assigned);
    setNumParticipants(participants);
    setShowSuccess(false);
    setShowError(false);
  }, [ pendingNudges ])

  function submitCheck() {
    if (numParticipants == totalParticipants) {
      console.log("TODO: Call backend API");
      dispatch({ type: 'pendingNudges/set', payload: []})
      setShowSuccess(true);
    } else {
      setShowError(true);
    }
  }
  return (
    <div className='PendingNudges'>
      <div className="vl"></div>
      <div className="totalAssigned"><h1 className="assignedText">{numParticipants}/{totalParticipants} Assigned </h1></div>
        <div className="ToSendColumn">
          <button onClick={() => dispatch({ type: 'pendingNudges/set', payload: []})}> Clear </button>
          <h3> Nudges to Send </h3>
          {pendingNudges.map((pendingNudge, index) => (
              <PendingNudge data={{...pendingNudge, order: index + 1}} key={pendingNudge.text} />
            ))}
            {showError && <ErrorBanner text={"Not all participants assigned nudges!"}></ErrorBanner>}
            {showSuccess && <h3>Success!</h3>}
            {!showError && <div style={{"height": "5em"}}></div>}
           <button onClick={() => submitCheck()}> Submit </button>
        </div> 
    </div>
  );
}

export default PendingNudgeList;