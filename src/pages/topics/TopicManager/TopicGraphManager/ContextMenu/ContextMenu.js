import React from 'react';
import {useContextMenuStyle} from "../styles";

function ContextMenu({
  top, left, right, bottom,
  children,
  ...props
}) {

  const contextMenuStyle = useContextMenuStyle()

  return (
    <div
      style={{ top, left, right, bottom }}
      className={contextMenuStyle.root}
      {...props}
    >
      {children}
    </div>
  );
}

export default ContextMenu
