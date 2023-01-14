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

const PendingNudgeList = () => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector(state => state.pendingNudges);
  const [numParticipants, setNumParticipants] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  // dispatch({ type: 'pendingNudges/set', payload: [{text: 'lorum ipsum', categories: ['female'], assigned: 50}]})
  useEffect(() => {
    // console.log("hello")
    fetchTotalParticipants().then((numParticipants) => setTotalParticipants(numParticipants));
    // dispatch({ type: 'pendingNudges/add', payload: {text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore....', demographics: ['female'], assigned: 50}})
    // dispatch({ type: 'pendingNudges/add', payload: {text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore....', demographics: ['female', 'asian'], assigned: 50}})
  }, [  ])

  useEffect(() => {
    let participants = 0;
    pendingNudges.forEach((nudge) => participants += nudge.assigned);
    setNumParticipants(participants);
  
  }, [ pendingNudges ])
  return (
    <div className='PendingNudges'>
      <div className="vl"></div>
      <div className="totalAssigned"><h1 className="assignedText">{numParticipants}/{totalParticipants} Assigned </h1></div>
        <div className="ToSendColumn">
          <h3> Nudges to Send </h3>
          {pendingNudges.map((pendingNudge, index) => (
              <PendingNudge data={{...pendingNudge, order: index + 1}} key={pendingNudge.text} />
            ))}
        </div>
    </div>
  );
}

export default PendingNudgeList;