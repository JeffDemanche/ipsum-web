import React from "react";
import { IpsumDay } from "util/dates";

import { Entry } from "../Entry";

interface CommentsProps {
  today: IpsumDay;
  comments: {
    id: string;
    day: IpsumDay;
    commentEntry: {
      highlights: React.ComponentProps<typeof Entry>["highlights"];
      htmlString: string;
    };
  }[];
  onCreateComment: (htmlString: string) => string;
  onUpdateComment: (args: { entryKey: string; htmlString: string }) => boolean;
}

export const Comments: React.FunctionComponent<CommentsProps> = ({
  onCreateComment,
  onUpdateComment,
}) => {
  return <div>{/* Comment entry */}</div>;
};
