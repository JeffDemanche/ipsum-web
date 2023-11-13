import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SimpleBar from "simplebar-react";
import { IpsumDay } from "util/dates";
import styles from "./PaginatedList.less";
import cx from "classnames";
import { usePrevious } from "util/hooks";

interface ElementInfo {
  key: string;
  index: number;
}

interface PaginatedListProps {
  className?: string;
  elements: {
    index: number;
    // Unique string key for each element
    key: string;
    day?: IpsumDay;
    content: React.ReactNode;
  }[];
  amountToLoad: number;
  defaultFocusedElement?: ElementInfo;
  numVisibleAroundFocusedElement: number;
  onFocusedElementChanged?: (focusedElement: ElementInfo) => void;
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

export const PaginatedList: React.FC<PaginatedListProps> = ({
  className,
  elements,
  amountToLoad,
  defaultFocusedElement,
  numVisibleAroundFocusedElement,
  onFocusedElementChanged,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const simpleBarRef: React.ComponentProps<typeof SimpleBar>["ref"] =
    useRef(null);

  const [focusedElementIndex, setFocusedElementIndex] = useState<number>(
    defaultFocusedElement?.index ?? 0
  );

  const prevFocusedElementIndex = usePrevious(focusedElementIndex);

  useEffect(() => {
    if (
      prevFocusedElementIndex !== focusedElementIndex &&
      elements?.[focusedElementIndex]
    ) {
      onFocusedElementChanged?.({
        key: elements?.[focusedElementIndex].key,
        index: focusedElementIndex,
      });
    }
  }, [
    elements,
    focusedElementIndex,
    onFocusedElementChanged,
    prevFocusedElementIndex,
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    if (scrollRef.current) {
      const topFocusedElement = Array.from(contentRef.current?.children).find(
        (node) => {
          return (
            isTopBorderInView(scrollRef.current, node as HTMLDivElement) ||
            isElementEntireView(scrollRef.current, node as HTMLDivElement)
          );
        }
      );
      setFocusedElementIndex(
        topFocusedElement
          ? parseInt((topFocusedElement as HTMLDivElement).dataset.elementindex)
          : 0
      );
    }
  }, []);

  const visibleElements = useMemo(() => {
    return elements?.slice(
      Math.max(focusedElementIndex - numVisibleAroundFocusedElement, 0),
      Math.min(
        focusedElementIndex + numVisibleAroundFocusedElement,
        elements.length
      )
    );
  }, [elements, focusedElementIndex, numVisibleAroundFocusedElement]);

  return (
    <SimpleBar
      ref={simpleBarRef}
      scrollableNodeProps={{ onScroll, ref: scrollRef }}
      className={cx(className, styles["infinite-scroller"])}
    >
      <div ref={contentRef}>
        {visibleElements?.map((elem) => (
          <div
            key={elem.key}
            data-elementindex={elem.index}
            className={styles["infinite-scroller-element"]}
          >
            {elem.content}
          </div>
        ))}
      </div>
    </SimpleBar>
  );
};

export default PaginatedList;
