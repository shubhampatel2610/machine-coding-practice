import PageHeader from "@/components/PageHeader/PageHeader";
import Comment from "./Comment";
import { useNestedCommentsLogic } from "./NestedComments.logic";
import "./NestedComments.scss";

// Recursive comment thread - each comment can itself contain replies
const NestedComments = () => {
  const { comments, addReply } = useNestedCommentsLogic();

  return (
    <div className="page-shell">
      <PageHeader title="Nested Comments" />

      <main className="nested-comments">
        {comments.map((node) => (
          <Comment key={node.id} node={node} onReply={addReply} />
        ))}
      </main>
    </div>
  );
};

export default NestedComments;
