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
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() =>
  createStyles({
    userMenuList: {
      minWidth: '10rem',
    },
    menuListItem: {
      textTransform: 'capitalize',
    },
    listItemIcon: {
      minWidth: 0,
      marginRight: '0.5rem',
    },
  }),
);

interface Props {
  user: IUser | null;
  handleLogout: () => void;
}

const UserMenu: React.FC<Props> = ({ user, handleLogout }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [isOpenedUserMenu, openUserMenu, closeUserMenu, anchorEl] = useMenu();

  const handleLogoutClick = () => {
    handleLogout();
    closeUserMenu();
  };

  const menuItemsList = [
    {
      Icon: () => <PermContactCalendarOutlinedIcon fontSize="small" />,
      action: closeUserMenu,
      label: t('shell.userMenu.profile'),
    },
    {
      Icon: () => <ExitToAppOutlinedIcon fontSize="small" />,
      action: handleLogoutClick,
      label: t('shell.userMenu.logout'),
    },
  ];

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
        {menuItemsList.map(({ Icon, action, label }) => (
          <MenuItem onClick={action} className={classes.menuListItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <Icon />
            </ListItemIcon>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default UserMenu;
