import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Layout, Space, Button, Menu, Input, Drawer } from 'antd'

import Logo from '../Logo';
import SortSelect from '../SortSelect';
import TextSearch from '../TextSearch';
// import { Button } from 'react';
import './index.css';
import CreateNudgeDrawer from '../Drawer/CreateNudgeDrawer';

const { Header: AntHeader } = Layout

const Header = () => {
  const { pathname } = useLocation(); // TODO show search only if in dashboard mode
  // const [postingVisible, setPostingVisible] = useState(false);
  const dispatch = useDispatch();
  const postingMenu = useSelector(state => state.postingMenu);
  function onMenuClick() {
    dispatch({ type: 'postingMenu/set', payload: !postingMenu })
  }
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
      <AntHeader >
        <Logo />

        <Menu mode='horizontal' items={[{ label: 'Nudges' }, { label: 'Analytics' }]} />

        <Space>
          <Input placeholder='Search' />
          <Button onClick={() => setIsDrawerOpen(true)}>Create Nudge</Button>
        </Space>

        <CreateNudgeDrawer onClose={() => setIsDrawerOpen(false)} open={isDrawerOpen} />

      </AntHeader>
    )
  } else {
    return ( // return nothing for now LOL
      <div></div>
    )
  }
}

export default Header;