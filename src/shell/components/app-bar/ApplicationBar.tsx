import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Box from "@material-ui/core/Box";
import SideNavigation from "../side-navigation";
import { Link, useLocation } from "react-router-dom";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { checkIsLoginPage } from "../../../utils/navigation.utils";
import { IUser } from "../../../interfaces";
import { useMenu } from "../../../hooks/use-menu";
import UserMenu from "./components/user-menu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    applicationBarRoot: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    linkButton: {
      textDecoration: "none",
      color: theme.palette.grey[50],
    },
    linkText: {
      color: theme.palette.common.white,
      textTransform: "capitalize",
      display: "inline",
    },
    link: {
      textDecoration: "none",
    },
  })
);

interface Props {
  user: IUser | null;
  handleLogout: () => void;
}

const ApplicationBar: React.FC<Props> = ({ user, handleLogout }) => {
  const { pathname } = useLocation();

  const isAuthenticated = !!user;
  const isLoginPage = checkIsLoginPage(pathname);

  const classes = useStyles();
  const [openNavigation, setOpenNavigation] = useState(false);

  const handleToggleNavigation = () => setOpenNavigation((open) => !open);
  const handleCloseNavigation = () => setOpenNavigation(false);

  return (
    <ClickAwayListener onClickAway={handleCloseNavigation}>
      <div className={classes.applicationBarRoot}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={handleToggleNavigation}
              disabled={isLoginPage}
            >
              <MenuIcon />
            </IconButton>
            <Box component="div" flexGrow={1}>
              <Link
                to="/manager"
                aria-label="logo-link"
                className={classes.link}
              >
                <Typography variant="h6" className={classes.linkText}>
                  manager
                </Typography>
              </Link>
            </Box>

            {isAuthenticated ? (
              <UserMenu
                user={user}
                handleLogout={handleLogout}
              />
            ) : (
              <Link to={"/login"}>
                <Button className={classes.linkButton}>Login</Button>
              </Link>
            )}
          </Toolbar>
        </AppBar>

        <SideNavigation
          open={openNavigation}
          handleClose={handleCloseNavigation}
        />
      </div>
    </ClickAwayListener>
  );
};

export default ApplicationBar;
