import cx from "classnames";
import { useQuery } from "@apollo/client";
import { Add } from "@mui/icons-material";
import {
  Autocomplete,
  createFilterOptions,
  IconButton,
  TextField,
} from "@mui/material";
import { ArcChip, ArcChipConnected } from "components/ArcChip";
import React, { useCallback, useMemo, useState } from "react";
import { isString } from "underscore";
import { gql } from "util/apollo";
import styles from "./ArcSearchAutocomplete.less";

interface ArcSearchAutocompleteProps {
  className?: string;

  defaultExpanded?: boolean;
  allowCreate?: boolean;
  multiple?: boolean;

  /** Return the ID of the created arc. */
  onNewArc?: (name: string) => string;

  value: string[];
  onChange?: (arcs: ArcSearchResult[]) => void;

  onExpand?: () => void;
  onCollapse?: () => void;
}

interface ArcSearchResult {
  label: string;

  arcId?: string;
  newArcProps?: {
    hue: number;
  };
}

const ArcSearchAutocompleteQuery = gql(`
  query ArcSearchAutocomplete {
    arcs(sort: ALPHA_DESC) {
      id
      name
    }
  }
`);

export const ArcSearchAutocomplete: React.FC<ArcSearchAutocompleteProps> = ({
  className,
  defaultExpanded,
  allowCreate,
  multiple,
  onNewArc,
  value: valueArcIds,
  onChange,
  onExpand,
  onCollapse,
}) => {
  const { data } = useQuery(ArcSearchAutocompleteQuery);

  const value = useMemo(
    () =>
      data?.arcs
        ?.filter((arc) => valueArcIds.includes(arc.id))
        .map((arc) => ({ label: arc.name, arcId: arc.id })) ?? [],
    [data?.arcs, valueArcIds]
  );

  const [expanded, setExpandedState] = useState(defaultExpanded ?? false);

  const setExpanded = useCallback(
    (expanded: boolean) => {
      if (expanded) {
        onExpand?.();
      } else {
        onCollapse?.();
      }
      setExpandedState(expanded);
    },
    [onCollapse, onExpand]
  );

  const collapsedJsx = useMemo(() => {
    return (
      <IconButton size="small" onClick={() => setExpanded(true)}>
        <Add />
      </IconButton>
    );
  }, [setExpanded]);

  const [searchText, setSearchText] = useState<string>("");

  const options = useMemo((): ArcSearchResult[] => {
    const arcOptions: ArcSearchResult[] =
      data?.arcs?.map((arc) => ({
        label: arc.name,
        arcId: arc.id,
      })) ?? [];

    if (allowCreate && searchText.trim().length > 0) {
      return [
        { label: searchText.trim(), newArcProps: { hue: 0 } },
        ...arcOptions,
      ];
    } else {
      return arcOptions;
    }
  }, [allowCreate, data?.arcs, searchText]);

  const onAutocompleteChange = useCallback(
    (options: ArcSearchResult | ArcSearchResult[]) => {
      if (!options) {
        return;
      }

      const optionsArray = Array.isArray(options) ? options : [options];

      if (allowCreate) {
        optionsArray.forEach((option) => {
          if (option.newArcProps) {
            const newArcId = onNewArc?.(option.label);
            option.arcId = newArcId;
            delete option.newArcProps;
          }
        });
      }

      onChange?.(optionsArray);
    },
    [allowCreate, onChange, onNewArc]
  );

  const filterOptions = useMemo(
    () =>
      createFilterOptions<ArcSearchResult>({
        matchFrom: "start",
        stringify: (option) => option.label,
      }),
    []
  );

  const expandedJsx = useMemo(() => {
    return (
      <Autocomplete
        size="small"
        freeSolo={false}
        className={styles["arc-search-autocomplete"]}
        multiple={multiple}
        value={value}
        onInputChange={(event, value) => {
          setSearchText(value);
        }}
        onBlur={() => setExpanded(false)}
        onChange={(event, value) => {
          if (!isString(value)) {
            onAutocompleteChange(value);
          }
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              autoFocus
              label="Find or create arc"
              variant="outlined"
            />
          );
        }}
        renderTags={(tags, getTagProps) =>
          tags.map((tag, index) =>
            tag.arcId ? (
              <ArcChipConnected
                key={tag.arcId}
                chipProps={getTagProps({ index })}
                arcId={tag.arcId}
              />
            ) : (
              <ArcChip
                key={tag.label}
                chipProps={getTagProps({ index })}
                label={tag.label}
                hue={tag.newArcProps.hue}
              />
            )
          )
        }
        renderOption={(props, option) => {
          if (option.newArcProps) {
            return (
              <li {...props} key={option.label}>
                <ArcChip label={option.label} hue={option.newArcProps.hue} />
              </li>
            );
          } else {
            return (
              <li {...props} key={option.arcId}>
                <ArcChipConnected arcId={option.arcId} />
              </li>
            );
          }
        }}
        options={options}
        getOptionLabel={(option) => {
          return (option as unknown as ArcSearchResult[])?.[0]?.label ?? "";
        }}
        isOptionEqualToValue={(option, value) =>
          option.arcId === value.arcId && option.label === value.label
        }
        filterOptions={filterOptions}
      />
    );
  }, [
    filterOptions,
    multiple,
    onAutocompleteChange,
    options,
    setExpanded,
    value,
  ]);

  return (
    <div className={cx(styles["arc-search"], className)}>
      {expanded ? <>{expandedJsx}</> : <>{collapsedJsx}</>}
    </div>
  );
};
