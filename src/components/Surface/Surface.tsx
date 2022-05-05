import React, { useCallback, useContext } from "react";
import styles from "./Surface.less";
import { SurfaceEditor } from "./SurfaceEditor";
import { SurfaceEditorContext } from "./SurfaceEditorContext";

export const Surface: React.FC<{}> = () => {
  const { domEditorRef } = useContext(SurfaceEditorContext);

  const onSurfaceClick = useCallback(() => {
    domEditorRef.current.focus();
  }, [domEditorRef.current]);

  return (
    <div className={styles["surface"]} onClick={onSurfaceClick}>
      <SurfaceEditor />
    </div>
  );
};
