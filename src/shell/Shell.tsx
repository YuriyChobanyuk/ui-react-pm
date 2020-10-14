import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import ApplicationBar from "./components/app-bar";

const useStyles = makeStyles((theme: Theme) => {
  console.log(theme.mixins.toolbar.minHeight);

  return createStyles({
    content: {
      paddingTop: 56,
      [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
        paddingTop: 48,
      },
      [theme.breakpoints.up("sm")]: {
        paddingTop: 64,
      },
    },
  });
});

const Shell: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <ApplicationBar />
      <div className={classes.content}>some content</div>
    </>
  );
};

export default Shell;
