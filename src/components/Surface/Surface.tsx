import React from "react";
import styles from "./Surface.less";
import { SurfaceEditor } from "./SurfaceEditor";

export const Surface = () => {
  // const { domEditorRef, moveFocusToEnd } = useContext(SurfaceEditorContext);

  // const onSurfaceClick = useCallback(() => {
  //   domEditorRef.current.focus();
  //   moveFocusToEnd();
  // }, [domEditorRef.current, moveFocusToEnd]);

  return (
    <div className={styles["surface"]}>
      <SurfaceEditor />
    </div>
  );
};
