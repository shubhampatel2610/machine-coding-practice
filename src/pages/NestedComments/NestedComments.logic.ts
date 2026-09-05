import { useState } from "react";
import { generateId } from "@/utils/helpers";
import { SEED_COMMENTS, type CommentNode } from "./NestedComments.types";

// Recursively walks the tree and appends a new reply under the matching id
const addReplyToTree = (nodes: CommentNode[], parentId: string, replyText: string): CommentNode[] =>
  nodes.map((node) => {
    if (node.id === parentId) {
      const newReply: CommentNode = {
        id: generateId(),
        author: "you",
        text: replyText,
        replies: [],
      };
      return { ...node, replies: [newReply, ...node.replies] };
    }
    return { ...node, replies: addReplyToTree(node.replies, parentId, replyText) };
  });

// Owns the comment tree state and exposes a single addReply action
export const useNestedCommentsLogic = () => {
  const [comments, setComments] = useState<CommentNode[]>(SEED_COMMENTS);

  const addReply = (parentId: string, replyText: string) => {
    if (!replyText.trim()) return;
    setComments((prev) => addReplyToTree(prev, parentId, replyText));
  };

  return { comments, addReply };
};
