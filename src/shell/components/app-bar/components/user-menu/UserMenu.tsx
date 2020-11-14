import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { AccountCircle } from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PermContactCalendarOutlinedIcon from '@material-ui/icons/PermContactCalendarOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import Box from '@material-ui/core/Box';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { IUser } from '../../../../../interfaces';
import { useMenu } from '../../../../../hooks/use-menu';

const useStyles = makeStyles(() =>
  createStyles({
    userMenuList: {
      minWidth: '10rem',
    },
  }),
);

interface Props {
  user: IUser | null;
  handleLogout: () => void;
}

const UserMenu: React.FC<Props> = ({ user, handleLogout }) => {
  const classes = useStyles();
  const [isOpenedUserMenu, openUserMenu, closeUserMenu, anchorEl] = useMenu();
  const handleLogoutClick = () => {
    handleLogout();
    closeUserMenu();
  };

  return (
    <Box>
      <span>{user?.name}</span>
      <IconButton
        aria-label="user menu button"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={openUserMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted={false}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isOpenedUserMenu}
        onClose={closeUserMenu}
        classes={{
          list: classes.userMenuList,
        }}
      >
        <MenuItem onClick={closeUserMenu}>
          <ListItemIcon>
            <PermContactCalendarOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <ExitToAppOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
