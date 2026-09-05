import { useState } from "react";
import type { CommentNode } from "./NestedComments.types";

interface CommentProps {
  node: CommentNode;
  onReply: (parentId: string, text: string) => void;
}

// Renders a single comment, its reply box, and recursively its child replies
const Comment = ({ node, onReply }: CommentProps) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const submitReply = () => {
    onReply(node.id, replyText);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className="comment">
      <p className="comment-author">{node.author}</p>
      <p className="comment-text">{node.text}</p>
      <button className="comment-reply-toggle" onClick={() => setShowReplyBox((prev) => !prev)}>
        Reply
      </button>

      {showReplyBox && (
        <div className="comment-reply-box">
          <input
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            placeholder="Write a reply..."
          />
          <button onClick={submitReply}>Post</button>
        </div>
      )}

      {/* Recursive case: each reply is rendered by the same Comment component */}
      {node.replies.length > 0 && (
        <div className="comment-children">
          {node.replies.map((child) => (
            <Comment key={child.id} node={child} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
