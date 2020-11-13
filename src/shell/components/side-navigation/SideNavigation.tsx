import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: 250,
    },
    drawer: {
      width: 250,
      flexShrink: 0,
    },
    drawerPaper: {
      top: 56,
      [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
        top: 48,
      },
      [theme.breakpoints.up("sm")]: {
        top: 64,
      },
    },
  })
);

interface Props {
  open: boolean;
  handleClose: () => void;
}

const SideNavigation: React.FC<Props> = ({ open, handleClose }) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      className={classes.drawer}
      variant="persistent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.list} role="presentation">
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default SideNavigation;
