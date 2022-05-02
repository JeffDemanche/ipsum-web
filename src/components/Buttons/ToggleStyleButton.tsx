import React, { useCallback, useState } from "react";
import cx from "classnames";
import styles from "./ToggleStyleButton.less";

interface ToggleStyleButtonProps {
  label: JSX.Element;
  onToggle?: (enabled: boolean) => void;
}

export const ToggleStyleButton: React.FC<ToggleStyleButtonProps> = ({
  label,
  onToggle,
}: ToggleStyleButtonProps) => {
  const [enabled, setEnabled] = useState(false);

  const onClick = useCallback(() => {
    setEnabled(!enabled);
    onToggle?.(!enabled);
  }, [enabled, onToggle]);

  return (
    <button
      role="checkbox"
      className={cx(styles["toggle-style-button"], {
        [styles["enabled"]]: enabled,
      })}
      aria-checked={enabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
