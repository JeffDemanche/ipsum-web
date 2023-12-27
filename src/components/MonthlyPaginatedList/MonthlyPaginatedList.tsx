import React, { useCallback, useMemo, useRef } from "react";
import { IpsumDay } from "util/dates";
import styles from "./MonthlyPaginatedList.less";
import { Button, Divider, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";

interface ElementInfo {
  key: string;
}

interface MonthlyPaginatedListProps {
  elements: {
    index: number;
    // Unique string key for each element
    key: string;
    day: IpsumDay;
    content: React.ReactNode;
  }[];
  rangeMode?: "month";
  focusedElement?: ElementInfo;
  onFocusedDayChanged?: (day: IpsumDay) => void;
}

function isTopBorderInView(
  scrollDiv: HTMLDivElement,
  childDiv: HTMLDivElement
) {
  if (!childDiv) return false;

  return (
    childDiv.offsetTop >= scrollDiv.scrollTop &&
    childDiv.offsetTop <= scrollDiv.scrollTop + scrollDiv.clientHeight
  );
}

function isElementEntireView(
  scrollDiv: HTMLDivElement,
  childDiv: HTMLDivElement
) {
  if (!childDiv) return false;

  return (
    childDiv.offsetTop <= scrollDiv.scrollTop &&
    childDiv.offsetTop + childDiv.clientHeight >=
      scrollDiv.scrollTop + scrollDiv.clientHeight
  );
}

function nextDayWithElement(
  elements: MonthlyPaginatedListProps["elements"],
  day: IpsumDay
) {
  if (!day) return undefined;

  const daysWithElements = elements.map((elem) => elem.day);
  const sorted = daysWithElements.sort(
    (a, b) => a.toJsDate().getTime() - b.toJsDate().getTime()
  );
  const nextDay = sorted.find((d) => d.equals(day) || d.isAfter(day));
  return nextDay;
}

function monthHasElement(
  elements: MonthlyPaginatedListProps["elements"],
  day: IpsumDay
) {
  return elements.some((elem) =>
    elem.day.isBetween(day.firstDayOfMonth(), day.lastDayOfMonth())
  );
}

function anyElementsAfter(
  elements: MonthlyPaginatedListProps["elements"],
  day: IpsumDay
) {
  return elements.some((elem) => elem.day.isAfter(day));
}

function anyElementsBefore(
  elements: MonthlyPaginatedListProps["elements"],
  day: IpsumDay
) {
  return elements.some((elem) => elem.day.isBefore(day));
}

export const MonthlyPaginatedList: React.FC<MonthlyPaginatedListProps> = ({
  elements,
  focusedElement,
  rangeMode = "month",
  onFocusedDayChanged,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  const focusedDay = useMemo(() => {
    if (focusedElement) {
      const foundElement = nextDayWithElement(
        elements,
        IpsumDay.fromString(focusedElement.key, "url-format")
      );
      return foundElement ?? IpsumDay.today();
    } else {
      return IpsumDay.today();
    }
  }, [focusedElement, elements]);

  const startDay = useMemo(() => {
    if (rangeMode === "month") {
      return focusedDay.firstDayOfMonth();
    }
  }, [focusedDay, rangeMode]);

  const endDay = useMemo(() => {
    if (rangeMode === "month") {
      return focusedDay.lastDayOfMonth();
    }
  }, [focusedDay, rangeMode]);

  const visibleElements = useMemo(() => {
    return elements.filter((elem) => {
      return elem.day.isBetween(startDay, endDay);
    });
  }, [elements, startDay, endDay]);

  const rangeText = useMemo(() => {
    if (rangeMode === "month") {
      return `${startDay.toString("month-and-year")}`;
    }
  }, [rangeMode, startDay]);

  const nextTimeRange = useMemo(() => {
    if (rangeMode === "month") {
      if (!anyElementsAfter(elements, focusedDay.lastDayOfMonth())) {
        return undefined;
      } else if (monthHasElement(elements, focusedDay.add(0, 1))) {
        return focusedDay.add(0, 1).firstDayOfMonth();
      } else {
        let additionCounter = 2;
        while (!monthHasElement(elements, focusedDay.add(0, additionCounter))) {
          additionCounter++;
        }
        return focusedDay.add(0, additionCounter).firstDayOfMonth();
      }
    }
  }, [elements, focusedDay, rangeMode]);

  const prevTimeRange = useMemo(() => {
    if (rangeMode === "month") {
      if (!anyElementsBefore(elements, focusedDay.firstDayOfMonth())) {
        return undefined;
      } else if (monthHasElement(elements, focusedDay.add(0, -1))) {
        return focusedDay.add(0, -1).firstDayOfMonth();
      } else {
        let additionCounter = -2;
        while (!monthHasElement(elements, focusedDay.add(0, additionCounter))) {
          additionCounter--;
        }
        return focusedDay.add(0, additionCounter).firstDayOfMonth();
      }
    }
  }, [elements, focusedDay, rangeMode]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [topFocusedElement, setTopFocusedElement] = React.useState<Element>(
    () => {
      if (!contentRef.current) return undefined;

      return Array.from(contentRef.current?.children).find((node) => {
        return (
          isTopBorderInView(scrollRef.current, node as HTMLDivElement) ||
          isElementEntireView(scrollRef.current, node as HTMLDivElement)
        );
      });
    }
  );

  const onScroll = useCallback(() => {
    if (scrollRef.current) {
      const newTopFocusedElement = Array.from(
        contentRef.current?.children
      ).find((node) => {
        return (
          isTopBorderInView(scrollRef.current, node as HTMLDivElement) ||
          isElementEntireView(scrollRef.current, node as HTMLDivElement)
        );
      });

      if (
        !newTopFocusedElement?.isEqualNode(topFocusedElement) &&
        newTopFocusedElement?.getAttribute("data-elementdate")
      ) {
        onFocusedDayChanged?.(
          IpsumDay.fromString(
            newTopFocusedElement?.getAttribute("data-elementdate"),
            "url-format"
          )
        );
        setTopFocusedElement(newTopFocusedElement);
      }
    }
  }, [onFocusedDayChanged, topFocusedElement]);

  const onPrev = useCallback(() => {
    onFocusedDayChanged?.(nextDayWithElement(elements, prevTimeRange));
  }, [elements, onFocusedDayChanged, prevTimeRange]);

  const onNext = useCallback(() => {
    onFocusedDayChanged?.(nextDayWithElement(elements, nextTimeRange));
  }, [onFocusedDayChanged, elements, nextTimeRange]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", overflowY: "hidden" }}
    >
      <div className={styles["time-navigation"]}>
        {prevTimeRange && (
          <Button onClick={onPrev} startIcon={<ArrowLeft />}>
            {prevTimeRange.toString("month-and-year")}
          </Button>
        )}
        <Typography>{rangeText}</Typography>
        {nextTimeRange && (
          <Button onClick={onNext} endIcon={<ArrowRight />}>
            {nextTimeRange.toString("month-and-year")}
          </Button>
        )}
      </div>
      <Divider />
      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{ height: "100%", overflowY: "auto", paddingRight: "4px" }}
      >
        <div ref={contentRef}>
          {visibleElements?.map((elem) => (
            <div
              key={elem.key}
              data-elementindex={elem.index}
              data-elementdate={elem.day.toString("url-format")}
              className={styles["infinite-scroller-element"]}
            >
              {elem.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyPaginatedList;
