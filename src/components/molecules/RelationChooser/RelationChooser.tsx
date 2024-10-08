import cx from "classnames";
import { Button } from "components/atoms/Button";
import { TextField } from "components/atoms/TextField";
import React, { FunctionComponent, useState } from "react";

import { ArcTag } from "../ArcTag";
import styles from "./RelationChooser.less";
import { ArcResult, Relation } from "./types";

interface RelationChooserProps {
  maxArcResults: number;

  defaultSelectedPredicate?: string;

  arcResults: ArcResult[];

  search: string;
  onArcSearch: (search: string) => void;

  onRelationChoose: (relation: Relation) => void;
}

export const RelationChooser: FunctionComponent<RelationChooserProps> = ({
  maxArcResults,
  defaultSelectedPredicate,
  arcResults,
  search,
  onArcSearch,
}) => {
  const predicateOptions = ["is", "relates to"];

  const [selectedPredicate, setSelectedPredicate] = useState(
    predicateOptions.includes(defaultSelectedPredicate)
      ? defaultSelectedPredicate
      : predicateOptions[0]
  );

  return (
    <div className={styles["relation-chooser"]}>
      <div className={styles["column-left"]}>
        {predicateOptions.map((predicate) => {
          const isSelected = predicate === selectedPredicate;

          return (
            <div
              key={predicate}
              className={cx(styles["row"], styles["predicate"])}
            >
              <Button
                variant="text"
                className={cx(
                  styles["predicate"],
                  isSelected && styles["selected"]
                )}
                onClick={() => {
                  setSelectedPredicate(predicate);
                }}
              >
                {predicate}
              </Button>
            </div>
          );
        })}
      </div>
      <div className={styles["column-right"]}>
        <div className={styles["row"]}>
          <TextField
            variant="underlined"
            autoFocus
            autoComplete="off"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              onArcSearch?.(e.target.value);
            }}
            className={styles["arc-search-field"]}
          />
        </div>
        {arcResults.slice(0, maxArcResults).map((arcResult) => (
          <div
            key={arcResult.id}
            className={cx(styles["row"], styles["arc-result"])}
          >
            <ArcTag
              fontSize="x-small"
              key={arcResult.id}
              text={arcResult.name}
              hue={arcResult.hue}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
