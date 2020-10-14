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
    paper: {
      top: theme.mixins.toolbar.minHeight,
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
      classes={{
        paper: classes.paper,
      }}
      onClose={handleClose}
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
