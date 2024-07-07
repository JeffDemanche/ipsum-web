import { Close, UnfoldLess, UnfoldMore } from "@mui/icons-material";
import { MiniButton } from "components/atoms/MiniButton";
import { grey100, hueSwatch } from "components/styles";
import React from "react";

import styles from "./PageHeader.less";

interface PageHeaderNavButtonsProps {
  showExpand?: boolean;
  showCollapse?: boolean;
  showClose?: boolean;

  onExpand?: () => void;
  onCollapse?: () => void;
  onClose?: () => void;

  hue?: number;
  onLightBackground?: boolean;
}

export const PageHeaderNavButtons: React.FC<PageHeaderNavButtonsProps> = ({
  showExpand,
  showCollapse,
  showClose,
  onExpand,
  onCollapse,
  onClose,
  hue,
  onLightBackground,
}) => {
  const iconColor =
    hue !== undefined
      ? hueSwatch(
          hue,
          onLightBackground ? "on_light_background" : "on_dark_background"
        )
      : grey100;

  return (
    <div className={styles["page-header-nav-buttons"]}>
      {showCollapse && (
        <MiniButton onClick={onCollapse} foregroundColor={iconColor}>
          <UnfoldLess fontSize="small" />
        </MiniButton>
      )}
      {showExpand && (
        <MiniButton onClick={onExpand} foregroundColor={iconColor}>
          <UnfoldMore fontSize="small" />
        </MiniButton>
      )}
      {showClose && (
        <MiniButton onClick={onClose} foregroundColor={iconColor}>
          <Close fontSize="small" />
        </MiniButton>
      )}
    </div>
  );
};
