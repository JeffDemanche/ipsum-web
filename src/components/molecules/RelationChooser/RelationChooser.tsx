import cx from "classnames";
import { Button } from "components/atoms/Button";
import { TextField } from "components/atoms/TextField";
import React, { FunctionComponent, useState } from "react";
import { RelationSubject } from "util/apollo";

import { ArcTag } from "../ArcTag";
import styles from "./RelationChooser.less";
import { ArcResult, Relation } from "./types";

interface RelationChooserProps {
  maxArcResults: number;

  defaultSelectedPredicate?: string;

  subjectType: RelationSubject["__typename"];
  subjectId: string;

  defaultSearch: string;
  arcResults: ArcResult[];
  onArcSearch: (search: string) => void;

  allowCreation: boolean;
  onArcCreate: (name: string) => void;

  onRelationChoose: (relation: Relation) => void;
}

export const RelationChooser: FunctionComponent<RelationChooserProps> = ({
  maxArcResults,
  subjectType,
  subjectId,
  defaultSelectedPredicate,
  arcResults,
  defaultSearch,
  onArcSearch,
  allowCreation,
  onArcCreate,
  onRelationChoose,
}) => {
  const [search, setSearch] = useState(defaultSearch);

  const predicateOptions = ["is", "relates to"];

  const arcResultsWithNewOption = allowCreation
    ? [
        {
          id: "new",
          hue: 0,
          name: `${search} (new)`,
        },
        ...arcResults,
      ]
    : arcResults;

  const [selectedPredicate, setSelectedPredicate] = useState(
    predicateOptions.includes(defaultSelectedPredicate)
      ? defaultSelectedPredicate
      : predicateOptions[0]
  );

  const onArcTagClick = (arcResult: ArcResult) => {
    if (arcResult.id === "new") {
      onArcCreate(search);
    }
    onRelationChoose({
      subjectType,
      subjectId,
      objectType: "Arc",
      objectId: arcResult.id,
      predicate: selectedPredicate,
    });
  };

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
              setSearch(e.target.value);
              onArcSearch?.(e.target.value);
            }}
            className={styles["arc-search-field"]}
          />
        </div>
        <div className={styles["arc-results"]}>
          {arcResultsWithNewOption.slice(0, maxArcResults).map((arcResult) => (
            <div
              key={arcResult.id}
              className={cx(styles["row"], styles["arc-result"])}
            >
              <ArcTag
                fontSize="small"
                key={arcResult.id}
                text={arcResult.name}
                hue={arcResult.hue}
                onClick={() => onArcTagClick(arcResult)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
