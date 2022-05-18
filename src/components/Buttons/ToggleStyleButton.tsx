import React, { useCallback, MouseEvent } from "react";
import cx from "classnames";
import styles from "./ToggleStyleButton.less";

interface ToggleStyleButtonProps {
  label: JSX.Element;
  enabled: boolean;
  onToggle?: (enabled: boolean) => void;
}

export const ToggleStyleButton: React.FC<ToggleStyleButtonProps> = ({
  label,
  enabled,
  onToggle,
}: ToggleStyleButtonProps) => {
  const onClick = useCallback(() => {
    onToggle?.(!enabled);
  }, [enabled, onToggle]);

  const onMouseDown = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  }, []);

  return (
    <button
      role="checkbox"
      className={cx(styles["toggle-style-button"], {
        [styles["enabled"]]: enabled,
      })}
      onMouseDown={onMouseDown}
      aria-checked={enabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
