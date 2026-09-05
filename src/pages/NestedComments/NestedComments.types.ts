// A comment node that may contain nested reply comments
export interface CommentNode {
  id: string;
  author: string;
  text: string;
  replies: CommentNode[];
}

// Seed comment thread demonstrating arbitrary nesting depth
export const SEED_COMMENTS: CommentNode[] = [
  {
    id: "c1",
    author: "asha",
    text: "Great write-up on recursive rendering!",
    replies: [
      {
        id: "c1-r1",
        author: "devraj",
        text: "Agreed - the base case is the key part to get right.",
        replies: [
          {
            id: "c1-r1-r1",
            author: "asha",
            text: "Exactly, an empty replies array stops the recursion.",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    author: "meera",
    text: "Would love a live example with add-reply support.",
    replies: [],
  },
];
