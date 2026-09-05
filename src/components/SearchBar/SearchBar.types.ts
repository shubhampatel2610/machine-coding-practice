// Props for the generic, controlled search bar
export interface SearchBarProps {
  value: string; // current search text (controlled by parent)
  onChange: (value: string) => void; // called on every keystroke
  placeholder?: string; // optional custom placeholder
}
