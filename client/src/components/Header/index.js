import { useLocation } from "react-router-dom";
import "./index.css";

import Logo from '../Logo';
import SortSelect from '../SortSelect';
import TextSearch from '../TextSearch';
import PopupModal from '../PopupModal';
// import { Button } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { createNudge } from '../../api/nudge';

const Header = () => {
  const { pathname } = useLocation(); // TODO show search only if in dashboard mode
  // const [postingVisible, setPostingVisible] = useState(false);
  const dispatch = useDispatch();
  const postingMenu = useSelector((state) => state.postingMenu);
  function onMenuClick() {
    dispatch({ type: 'postingMenu/set', payload: !postingMenu })
  }

  const [isModelOpen, setIsModelOpen] = useState(false)
  const [resp, setResp] = useState({
    state: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const newNudge = {
      message: '',
      date_created: Date(),
      com_b: []
    };

    [...formData.entries()].forEach(field => {
      const label = field[0]
      const value = field[1]

      if (label === 'com_b') {
        newNudge['com_b'].push(value)
      } else {
        newNudge[label] = value
      }
    })

    try {
      await createNudge(newNudge)
      dispatch({ type: 'nudges/add', payload: newNudge })
      setIsModelOpen(false)
    } catch (error) {
      console.error(error);



      setResp({
        state: 'error',
        message: error
      })
    }
  }

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
          <form method='post' onSubmit={handleSubmit}>
            <div>
              <label>
                Com-B (optional)
                <select name="com_b" multiple>
                  <option value="capability">Capability</option>
                  <option value="opportunity">Opportunity</option>
                  <option value="motivation">Motivation</option>
                </select>
              </label>
            </div>

            <div>
              <label>
                Nudge Content
                <textarea name="message" placeholder='Please input the nudge content' />
              </label>
            </div>

            <div>
              <label>
                Comment
                <textarea name="comment" placeholder='Please input any comment to this nudge' />
              </label>
            </div>

            <button>Cancel</button>
            <button type="submit">Confirm</button>
          </form>
        </>} handleClose={() => setIsModelOpen(false)} />
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
