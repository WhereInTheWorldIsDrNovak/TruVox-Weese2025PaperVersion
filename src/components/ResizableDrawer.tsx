// Implemented from user Chanandrei at https://stackoverflow.com/questions/64528646/a-resizable-antd-drawer with a few modifications
// Able to be used in place of drawers with placement as either "right" or "bottom"
import React, {useState, useEffect} from 'react';
import {Drawer} from 'antd';

let isResizing = false;
let isSidebar = false;
let isBottombar = false;

const ResizableDrawer = ({children, ...props}: any) => {
  const [drawerWidth, setDrawerWidth] = useState<number | undefined>(undefined);
  const [drawerHeight, setDrawerHeight] = useState<number | undefined>(
    undefined
  );

  const cbHandleMouseMove = React.useCallback(handleMousemove, []);
  const cbHandleMouseUp = React.useCallback(handleMouseup, []);

  useEffect(() => {
    setDrawerHeight(props.height);
    setDrawerWidth(props.width);
  }, [props.visible]);

  function handleMouseup() {
    if (!isResizing) {
      return;
    }
    isResizing = false;
    document.removeEventListener('mousemove', cbHandleMouseMove);
    document.removeEventListener('mouseup', cbHandleMouseUp);
  }

  function handleMousedown(e: any) {
    e.stopPropagation();
    e.preventDefault();
    // we will only add listeners when needed, and remove them afterward
    document.addEventListener('mousemove', cbHandleMouseMove);
    document.addEventListener('mouseup', cbHandleMouseUp);
    isResizing = true;

    // Determines which placement the drawer is based on the cursor style
    const tgt = e.target;
    const mouseType = window.getComputedStyle(tgt)['cursor'];
    if (mouseType === 'ew-resize') {
      isSidebar = true;
      isBottombar = false;
    } else if (mouseType === 'ns-resize') {
      isSidebar = false;
      isBottombar = true;
    }
  }

  function handleMousemove(e: any) {
    if (isSidebar) {
      console.log('Sidebar');

      const offsetRight =
        document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
      const minWidth = 256;
      const maxWidth = window.innerWidth * 0.5;
      if (offsetRight > minWidth && offsetRight < maxWidth) {
        setDrawerWidth(offsetRight);
      }
    } else if (isBottombar) {
      const offsetBottom = window.innerHeight - e.clientY;
      const minHeight = 115;
      const maxHeight = window.innerHeight * 0.75;
      if (offsetBottom > minHeight && offsetBottom < maxHeight) {
        setDrawerHeight(offsetBottom);
      }
    }
  }

  return (
    <Drawer {...props} height={drawerHeight} width={drawerWidth}>
      {children}
      <div
        className={
          props.placement === 'right'
            ? 'sidebar-dragger resize-div'
            : 'topbar-dragger resize-div'
        }
        onMouseDown={handleMousedown}
      />
    </Drawer>
  );
};

export default ResizableDrawer;
