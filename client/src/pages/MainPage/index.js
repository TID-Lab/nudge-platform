import './index.css';
import PostingMenu from '../../components/PostingMenu'
import PendingNudgeList from '../../components/PendingNudgeList';
const MainPage = () => {

  return (
  <div className='MainPage'>
    <h1> Hello world! </h1>
    <a href='/dashboard'>Check out the dashboard for sample code (ish)</a>

    <PendingNudgeList/> 
    <PostingMenu />
  </div>
  );
};

export default MainPage;