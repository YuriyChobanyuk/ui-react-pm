import React from "react";

export function useMenu(): [
  boolean,
  (event: React.MouseEvent<HTMLElement>) => void,
  () => void,
  null | HTMLElement
] {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return [open, handleOpenMenu, handleCloseMenu, anchorEl];
}
