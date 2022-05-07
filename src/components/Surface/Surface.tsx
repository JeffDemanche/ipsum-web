import React, { useCallback, useContext } from "react";
import styles from "./Surface.less";
import { SurfaceEditor } from "./SurfaceEditor";
import { SurfaceEditorContext } from "./SurfaceEditorContext";

export const Surface: React.FC<{}> = () => {
  const { domEditorRef, moveFocusToEnd } = useContext(SurfaceEditorContext);

  const onSurfaceClick = useCallback(() => {
    domEditorRef.current.focus();
    moveFocusToEnd();
  }, [domEditorRef.current, moveFocusToEnd]);

  return (
    <div className={styles["surface"]} onClick={onSurfaceClick}>
      <SurfaceEditor />
    </div>
  );
};
