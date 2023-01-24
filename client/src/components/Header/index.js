import { useLocation } from "react-router-dom";
import "./index.css";

import Logo from '../Logo';
import SortSelect from '../SortSelect';
import TextSearch from '../TextSearch';
import PopupModal from '../PopupModal';
// import { Button } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

const Header = () => {
  const { pathname } = useLocation(); // TODO show search only if in dashboard mode
  // const [postingVisible, setPostingVisible] = useState(false);
  const dispatch = useDispatch();
  const postingMenu = useSelector((state) => state.postingMenu);
  function onMenuClick() {
    dispatch({ type: 'postingMenu/set', payload: !postingMenu })
  }
  const [isModelOpen, setIsModelOpen] = useState(false)

  if (pathname === '/dashboard') {
    return (
      <div className='PageHeader'>
        <Logo />
        <SortSelect />
        <TextSearch />
        <button style={{ marginLeft: "auto", marginRight: "1.5rem", marginTop: "0.5rem", marginBottom: "0.5rem", maxHeight: "3rem" }} onClick={onMenuClick}> + Create Post </button>
      </div>
    )
  } else if (pathname === '/') {
    return (
      <div className='PageHeader'>
        <Logo />
        <button onClick={() => setIsModelOpen(true)}>Create Nudge</button>
        {isModelOpen && <PopupModal content={<>
          <h4>Create Nudge</h4>
          <form>
            <div>
              <label for="com-b">Com-B (optional)</label><br />
              <select name="com-b">
                <option value="foo">foo</option>
              </select>
            </div>

            <div>
              <label for="content">Nudge Content</label><br />
              <textarea placeholder='Please input the nudge content' />
            </div>

            <div>
              <label for="comment">Comment</label><br />
              <textarea placeholder='Please input any comment to this nudge' />
            </div>

            <button>Cancel</button>
            <button type="submit">Confirm</button>
          </form>
        </>}  handleClose={() => setIsModelOpen(false)}/>
        }
      </div>
    )
  } else {
    return ( // return nothing for now LOL
      <div></div>
    )
  }
}

export default Header;
