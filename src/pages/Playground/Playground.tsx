import { useMemo, useState } from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import { themes } from "prism-react-renderer";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Code2, RotateCcw, Save, Terminal } from "lucide-react";
import { GRID_ITEMS } from "@/utils/constants";
import { getPlaygroundSource } from "@/utils/playground";
import "./Playground.scss";

const compileScssForPreview = (scss: string): string => {
  const variables: Record<string, string> = {
    "color-bg": "#0b0b0e",
    "color-surface": "#16161c",
    "color-surface-hover": "#1d1d25",
    "color-border": "#2a2a33",
    "color-text": "#e8e8ec",
    "color-text-muted": "#8b8b96",
    "color-accent-mint": "#5eead4",
    "color-accent-amber": "#f0b429",
    "color-accent-rose": "#fb7185",
    "font-display": "Space Grotesk, sans-serif",
    "font-body": "Inter, sans-serif",
    "font-mono": "JetBrains Mono, monospace",
  };
  const withoutImports = scss
    .replace(/@use[^;]+;/g, "")
    .replace(/\$([\w-]+)\s*:\s*([^;]+);/g, (_, name: string, value: string) => {
      variables[name] = value.trim();
      return "";
    });

  return withoutImports.replace(/\$([\w-]+)/g, (_, name: string) => variables[name] ?? "initial");
};

const Playground = () => {
  const { componentId = "" } = useParams();
  const item = GRID_ITEMS.find((entry) => entry.id === componentId);
  const source = getPlaygroundSource(componentId);
  const [activeTab, setActiveTab] = useState<"tsx" | "scss">("tsx");
  const [draftTsx, setDraftTsx] = useState(source?.tsx ?? "");
  const [draftScss, setDraftScss] = useState(source?.scss ?? "");
  const [savedTsx, setSavedTsx] = useState(source?.tsx ?? "");
  const [savedScss, setSavedScss] = useState(source?.scss ?? "");
  const [savedAt, setSavedAt] = useState("Not saved yet");

  const previewStyle = useMemo(() => compileScssForPreview(savedScss), [savedScss]);

  if (!item || !source) {
    return (
      <main className="playground-missing">
        <p className="playground-kicker">404 / playground</p>
        <h1>That component playground does not exist.</h1>
        <Link to="/" className="playground-back-link"><ArrowLeft size={16} /> Back to components</Link>
      </main>
    );
  }

  const saveDraft = () => {
    setSavedTsx(draftTsx);
    setSavedScss(draftScss);
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetDraft = () => {
    setDraftTsx(source.tsx);
    setDraftScss(source.scss);
    setSavedTsx(source.tsx);
    setSavedScss(source.scss);
    setSavedAt("Reset to source");
  };

  return (
    <LiveProvider code={savedTsx} scope={{ useState }} theme={themes.nightOwl} noInline>
      <div className="playground-page">
        <header className="playground-header">
          <div className="playground-header-main">
            <Link to={item.route} className="playground-back-link" aria-label={`Back to ${item.name}`}>
              <ArrowLeft size={17} />
            </Link>
            <div>
              <p className="playground-kicker"><Code2 size={14} /> Isolated playground</p>
              <h1>{item.name}</h1>
            </div>
          </div>
          <div className="playground-header-actions">
            <span className="playground-saved-state"><span className="playground-status-dot" /> {savedAt}</span>
            <button type="button" className="playground-action playground-action-secondary" onClick={resetDraft}><RotateCcw size={15} /> Reset</button>
            <button type="button" className="playground-action playground-action-primary" onClick={saveDraft}><Save size={15} /> Save</button>
          </div>
        </header>

        <main className="playground-workspace">
          <section className="playground-preview-panel" aria-label="Live preview">
            <div className="playground-panel-heading">
              <span><Terminal size={15} /> Preview</span>
              <span className="playground-live-label">live view</span>
            </div>
            <div className="playground-preview-canvas">
              <style>{previewStyle}</style>
              <LivePreview />
            </div>
            <div className="playground-error"><LiveError /></div>
          </section>

          <section className="playground-editor-panel" aria-label="Component source editor">
            <div className="playground-editor-tabs" role="tablist" aria-label="Source files">
              <button type="button" role="tab" aria-selected={activeTab === "tsx"} className={activeTab === "tsx" ? "is-active" : ""} onClick={() => setActiveTab("tsx")}>
                <span className="file-dot file-dot-tsx" /> Component.tsx
              </button>
              <button type="button" role="tab" aria-selected={activeTab === "scss"} className={activeTab === "scss" ? "is-active" : ""} onClick={() => setActiveTab("scss")}>
                <span className="file-dot file-dot-scss" /> Component.scss
              </button>
            </div>
            <div className="playground-editor-shell">
              {activeTab === "tsx" ? (
                <LiveEditor onChange={setDraftTsx} code={draftTsx} />
              ) : (
                <textarea className="playground-scss-editor" value={draftScss} onChange={(event) => setDraftScss(event.target.value)} spellCheck={false} aria-label="Edit SCSS source" />
              )}
            </div>
            <div className="playground-editor-footer">Changes stay in this browser tab until you leave or reset.</div>
          </section>
        </main>
      </div>
    </LiveProvider>
  );
};

export default Playground;
