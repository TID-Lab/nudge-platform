import './index.css';
import { useDispatch, useSelector } from 'react-redux';

const PendingNudge = (props) => {
  const {text, demographics, assigned, order} = props.data;
  const dispatch = useDispatch();
  const pendingNudges = useSelector(state => state.pendingNudges);
  function onDelete() {
    dispatch({ type: 'pendingNudges/delete', payload: order - 1})
  }

return (
  <div className='PendingNudge'>
    <div className='PendingTopBar'>
      {order}
      <button id='Delete' onClick={onDelete}>Delete</button>
      <button id='Edit'>Edit</button>
    </div>
    <h1 className='nudgeText'>{text}</h1>
    <div className='PendingBottomBar'>
      {demographics.map((category) => 
        <div className='NudgeCategory'>{category}</div>)}
      <b className='assigned'>{assigned} assigned</b>
    </div>
    
  </div>
)
}


export default PendingNudge;