import type { PlaygroundSource } from "./interfaces.types";

const starRatingSource: PlaygroundSource = {
  tsx: `const Demo = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const value = hover || rating;

  return (
    <div className="demo-star-rating">
      <div className="demo-stars" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="demo-star"
            onMouseEnter={() => setHover(star)}
            onClick={() => setRating(star)}
            aria-label={"Rate " + star + " stars"}
          >
            {star <= value ? "★" : "☆"}
          </button>
        ))}
      </div>
      <p>{rating ? "You rated " + rating + " / 5" : "Not rated yet"}</p>
    </div>
  );
};

render(<Demo />);`,
  scss: `@use "../../utils/global.scss" as *;

.demo-star-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding: 2rem;
  color: $color-text;
}

.demo-stars {
  display: flex;
  gap: 0.3rem;
}

.demo-star {
  border: 0;
  background: transparent;
  color: $color-accent-amber;
  cursor: pointer;
  font-size: 2.5rem;
}

.demo-star-rating p {
  color: $color-text-muted;
  font-family: $font-mono;
}`,
};

const nestedCommentsSource: PlaygroundSource = {
  tsx: `const initialComments = [
  { id: 1, author: "Maya", text: "This is a thoughtful solution." },
  { id: 2, author: "Sam", text: "The interaction feels really clear." },
];

const Demo = () => {
  const [comments, setComments] = useState(initialComments);
  const [reply, setReply] = useState("");

  const addReply = () => {
    if (!reply.trim()) return;
    setComments([...comments, { id: Date.now(), author: "You", text: reply }]);
    setReply("");
  };

  return (
    <div className="demo-comments">
      {comments.map((comment) => (
        <article className="demo-comment">
          <strong>{comment.author}</strong>
          <p>{comment.text}</p>
        </article>
      ))}
      <div className="demo-reply-box">
        <input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply..." />
        <button onClick={addReply}>Reply</button>
      </div>
    </div>
  );
};

render(<Demo />);`,
  scss: `@use "../../utils/global.scss" as *;

.demo-comments {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.5rem;
}

.demo-comment {
  border: 1px solid $color-border;
  border-radius: 10px;
  background: $color-surface;
  padding: 1rem;
}

.demo-comment strong {
  color: $color-accent-mint;
  font-family: $font-display;
}

.demo-comment p {
  color: $color-text;
  margin: 0.4rem 0 0;
}

.demo-reply-box {
  display: flex;
  gap: 0.5rem;
}

.demo-reply-box input {
  flex: 1;
  border: 1px solid $color-border;
  border-radius: 6px;
  background: $color-bg;
  color: $color-text;
  padding: 0.7rem;
}

.demo-reply-box button {
  border: 0;
  border-radius: 6px;
  background: $color-accent-mint;
  color: $color-bg;
  cursor: pointer;
  padding: 0.7rem 1rem;
}`,
};

export const PLAYGROUND_SOURCES: Record<string, PlaygroundSource> = {
  "star-rating": starRatingSource,
  "nested-comments": nestedCommentsSource,
};

export const getPlaygroundSource = (id: string): PlaygroundSource | undefined =>
  PLAYGROUND_SOURCES[id];
