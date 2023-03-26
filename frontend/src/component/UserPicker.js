import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { FaBars } from "react-icons/fa"
import Subtitle from './Subtitle';
import Button from './Button';
import './UserPicker.css';

// 参考
// https://codesandbox.io/s/react-select-all-checkbox-jbub2?file=/src/index.js

function UserPicker(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [checked, setChecked] = React.useState([]);

  const handleToggleAll = (users) => () => {
    setCheckedAll(!checkedAll);
    setChecked(users.map((user) => user.user_id));

    if (checkedAll){
      setChecked([]);
    }
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    let newChecked = [];
    props.checkedUsers.map(user => {
      newChecked.push(user.user_id);
    })
    setChecked(newChecked);
    setIsOpen(open);
  };

  const handleClick = () => {
    setIsOpen(false);
    props.onSelect(checked);
  }

  const list = (users) => (
    <Box
      sx={{ width: 'auto' }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
    <div className="subtitle-wrapper">
      <Subtitle type="arrow" text="ユーザーを選択してください"/>
    </div>
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}> 
      <ListItem
        key="selectAll"
        disablePadding
        sx={{height: 60}}
      >
        <ListItemButton role={undefined} onClick={handleToggleAll(users)} dense sx={{height: 60}}>
          <ListItemIcon sx={{'padding-left': 10}}>
            <Checkbox
              checked={checkedAll}
              inputProps={{ 'aria-labelledby': "checkbox-list-label-selectAll" }}
              sx={{
                color: "#DDDDDD",  
                '&.Mui-checked': {
                  color: "#50CED6",
                },
              }}
            />
          </ListItemIcon>

          <ListItemText id="checkbox-list-label-selectAll" primary="ユーザーをまとめて選択" sx={{'padding-left': 8}}/>
        </ListItemButton>
      </ListItem>
      {users.map((user) => {
        
        const labelId = `checkbox-list-label-${user.user_id}`;
        return (
          <ListItem
            key={user.user_id}
            disablePadding
            sx={{height: 60}}
          >
            <ListItemButton role={undefined} onClick={handleToggle(user.user_id)} dense sx={{height: 60}}>
              <ListItemIcon sx={{'padding-left': 10}}>
                <Checkbox
                  checked={checked.indexOf(user.user_id) !== -1}
                  inputProps={{ 'aria-labelledby': labelId }}
                  sx={{
                    color: "#DDDDDD",  
                    '&.Mui-checked': {
                      color: "#50CED6",
                    },
                  }}
                />
              </ListItemIcon>

              <ListItemAvatar sx={{'padding-left': 0}}>
                <Avatar
                  alt={user.name}
                  src={user.picture_url}
                  sx={{ width: 45, height: 45}}
                />
              </ListItemAvatar>

              <ListItemText id={labelId} primary={user.name} sx={{'padding-left': 8}}/>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
    <div className="picker-button-wrapper">
      <Button text="決定" onClick={handleClick}/>
    </div>
    </Box>
  );

  return (
    <React.Fragment key={props.anchor}>
      <button className="user-picker" onClick={toggleDrawer(true)}>
        <FaBars/> 
        <div className="text">メンバー編集</div>
      </button>
      <SwipeableDrawer
        anchor={'bottom'}
        open={isOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list(props.users)}
      </SwipeableDrawer>
    </React.Fragment>
  )
}

export default UserPicker