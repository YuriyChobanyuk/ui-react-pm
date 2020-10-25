import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SideNavigation from "../side-navigation";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.modal + 1,
    },
    linkButton: {
      underline: "none",
      color: theme.palette.grey[50],
    },
  })
);

const ApplicationBar: React.FC = () => {
  const classes = useStyles();
  const [openNavigation, setOpenNavigation] = useState(false);

  const handleToggle = () => setOpenNavigation((open) => !open);
  const handleClose = () => setOpenNavigation(false);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          <Link to={"/login"}>
            <Button className={classes.linkButton}>Login</Button>
          </Link>
        </Toolbar>
      </AppBar>

      <SideNavigation open={openNavigation} handleClose={handleClose} />
    </div>
  );
};

export default ApplicationBar;
