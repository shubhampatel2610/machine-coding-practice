import { useContext, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { LiveContext, LivePreview, LiveProvider } from "react-live";
import Editor from "react-simple-code-editor";
import { parse } from "@babel/parser";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
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

interface PlaygroundDiagnostic {
  line: number;
  column?: number;
  message: string;
}

const cleanErrorMessage = (message: string): string =>
  message.replace(/^SyntaxError:\s*/i, "").replace(/\s*\(\d+:\d+\)\s*$/, "").trim();

interface BabelDiagnosticError {
  message: string;
  loc?: { line: number; column: number };
  pos?: number;
  endPos?: number;
}

const collectParseDiagnostics = (source: string): PlaygroundDiagnostic[] => {
  let workingSource = source;
  const diagnostics: PlaygroundDiagnostic[] = [];
  const maskedPositions = new Set<number>();

  for (let attempt = 0; attempt < 12; attempt += 1) {
    let errors: BabelDiagnosticError[] = [];
    try {
      const result = parse(workingSource, {
        sourceType: "unambiguous",
        plugins: ["jsx", "typescript"],
        errorRecovery: true,
      });
      errors = result.errors as BabelDiagnosticError[];
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        errors = [error as BabelDiagnosticError];
      }
    }

    if (errors.length === 0) break;

    errors.forEach((error) => {
      const line = error.loc?.line ?? 1;
      const column = error.loc?.column;
      const duplicate = diagnostics.some(
        (diagnostic) => diagnostic.line === line && diagnostic.column === column && diagnostic.message === cleanErrorMessage(error.message)
      );
      if (!duplicate) diagnostics.push({ line, column, message: cleanErrorMessage(error.message) });
    });

    const errorToMask = errors.find((error) => typeof error.pos === "number");
    if (!errorToMask?.pos || maskedPositions.has(errorToMask.pos)) break;
    maskedPositions.add(errorToMask.pos);
    const end = Math.max(errorToMask.pos + 1, errorToMask.endPos ?? errorToMask.pos + 1);
    workingSource = `${workingSource.slice(0, errorToMask.pos)}${" ".repeat(end - errorToMask.pos)}${workingSource.slice(end)}`;
  }

  return diagnostics;
};

const getDiagnostics = (source: string, runtimeError?: string, fallbackLine?: number): PlaygroundDiagnostic[] => {
  const diagnostics = collectParseDiagnostics(source);
  if (diagnostics.length > 1) return diagnostics;
  if (diagnostics.length === 1) {
    return fallbackLine ? [{ ...diagnostics[0], line: fallbackLine }] : diagnostics;
  }

  return runtimeError
    ? [{ line: fallbackLine ?? 1, message: cleanErrorMessage(runtimeError) }]
    : [];
};

const escapeHtml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const CODE_LINE_HEIGHT = 1.65;

interface PlaygroundEditorProps {
  value: string;
  language: "tsx" | "scss";
  errorLineOverride?: number;
  onChange: (value: string) => void;
}

const PlaygroundEditor = ({ value, language, errorLineOverride, onChange }: PlaygroundEditorProps) => {
  const { error } = useContext(LiveContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [lineHeight, setLineHeight] = useState(20.064);
  const diagnostics = language === "tsx" ? getDiagnostics(value, error, errorLineOverride) : [];
  const errorLines = Array.from(new Set(diagnostics.map((diagnostic) => diagnostic.line)));
  const lines = value.split("\n");
  const highlightCode = (code: string): string =>
    language === "tsx" ? Prism.highlight(code, Prism.languages.jsx, "jsx") : escapeHtml(code);

  useEffect(() => {
    const textarea = editorRef.current?.querySelector("textarea");
    if (!textarea) return;
    const handleScroll = () => setScrollTop(textarea.scrollTop);
    const fontSize = Number.parseFloat(getComputedStyle(textarea).fontSize) || 12.16;
    setLineHeight(fontSize * CODE_LINE_HEIGHT);
    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (errorLines.length === 0) return;
    const textarea = editorRef.current?.querySelector("textarea");
    if (!textarea) return;
    textarea.scrollTop = Math.max(0, (Math.min(...errorLines) - 3) * lineHeight);
    setScrollTop(textarea.scrollTop);
  }, [errorLines.join(","), lineHeight]);

  return (
    <div className="playground-code-editor" ref={editorRef}>
      <div className="playground-line-numbers" style={{ transform: `translateY(-${scrollTop}px)` }} aria-hidden="true">
        {lines.map((_, index) => (
          <span key={index} className={errorLines.includes(index + 1) ? "is-error-line" : ""}>{index + 1}</span>
        ))}
      </div>
      {errorLines.map((errorLine) => (
        <div
          key={errorLine}
          className="playground-error-code-line"
          style={{ height: `${lineHeight}px`, transform: `translateY(${18 + (errorLine - 1) * lineHeight - scrollTop}px)` }}
          aria-hidden="true"
        />
      ))}
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={highlightCode}
        padding={{ top: 18, right: 18, bottom: 18, left: 18 }}
        textareaClassName="playground-code-textarea"
        preClassName="playground-code-highlight"
        spellCheck={false}
        aria-label={`Edit ${language.toUpperCase()} source`}
      />
    </div>
  );
};

const PlaygroundError = ({ source, errorLineOverride }: { source: string; errorLineOverride?: number }) => {
  const { error } = useContext(LiveContext);
  const diagnostics = getDiagnostics(source, error, errorLineOverride);
  if (!error || diagnostics.length === 0) return null;

  return (
    <div className="playground-error" role="alert">
      <strong>{diagnostics.length} error{diagnostics.length === 1 ? "" : "s"} found</strong>
      <ul>
        {diagnostics.map((diagnostic, index) => (
          <li key={`${diagnostic.line}-${diagnostic.column ?? 0}-${index}`}>
            <b>Line {diagnostic.line}{diagnostic.column ? `:${diagnostic.column}` : ""}</b> {diagnostic.message}
          </li>
        ))}
      </ul>
    </div>
  );
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
  const [lastEditedTsxLine, setLastEditedTsxLine] = useState<number>();
  const [lastSavedTsxLine, setLastSavedTsxLine] = useState<number>();
  const previewStyle = useMemo(() => compileScssForPreview(savedScss), [savedScss]);

  if (!item || !source) {
    return <main className="playground-missing"><p className="playground-kicker">404 / playground</p><h1>That component playground does not exist.</h1><Link to="/" className="playground-back-link"><ArrowLeft size={16} /> Back to components</Link></main>;
  }

  const saveDraft = () => {
    setSavedTsx(draftTsx);
    setSavedScss(draftScss);
    setLastSavedTsxLine(lastEditedTsxLine);
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetDraft = () => {
    setDraftTsx(source.tsx);
    setDraftScss(source.scss);
    setSavedTsx(source.tsx);
    setSavedScss(source.scss);
    setLastEditedTsxLine(undefined);
    setLastSavedTsxLine(undefined);
    setSavedAt("Reset to source");
  };

  const updateTsxDraft = (nextValue: string) => {
    const previousLines = draftTsx.split("\n");
    const nextLines = nextValue.split("\n");
    const changedLine = nextLines.findIndex((line, index) => line !== previousLines[index]);
    setLastEditedTsxLine(changedLine >= 0 ? changedLine + 1 : nextLines.length);
    setDraftTsx(nextValue);
  };

  const handleShortcut = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    if (event.key.toLowerCase() === "s" || event.key === "Enter") { event.preventDefault(); saveDraft(); }
    if (event.key.toLowerCase() === "r" && event.shiftKey) { event.preventDefault(); resetDraft(); }
    if (event.key === "1") { event.preventDefault(); setActiveTab("tsx"); }
    if (event.key === "2") { event.preventDefault(); setActiveTab("scss"); }
  };

  return (
    <LiveProvider code={savedTsx} scope={{ useState }} theme={themes.nightOwl} noInline>
      <div className="playground-page" onKeyDown={handleShortcut}>
        <header className="playground-header">
          <div className="playground-header-main"><Link to={item.route} className="playground-back-link" aria-label={`Back to ${item.name}`}><ArrowLeft size={17} /></Link><div><p className="playground-kicker"><Code2 size={14} /> Isolated playground</p><h1>{item.name}</h1></div></div>
          <div className="playground-header-actions"><span className="playground-saved-state"><span className="playground-status-dot" /> {savedAt}</span><button type="button" className="playground-action playground-action-secondary" onClick={resetDraft}><RotateCcw size={15} /> Reset</button><button type="button" className="playground-action playground-action-primary" onClick={saveDraft}><Save size={15} /> Save</button></div>
        </header>
        <main className="playground-workspace">
          <section className="playground-preview-panel" aria-label="Live preview">
            <div className="playground-panel-heading"><span><Terminal size={15} /> Preview</span><span className="playground-live-label">live view</span></div>
            <div className="playground-preview-canvas"><style>{previewStyle}</style><LivePreview /></div>
            <PlaygroundError source={savedTsx} errorLineOverride={lastSavedTsxLine} />
          </section>
          <section className="playground-editor-panel" aria-label="Component source editor">
            <div className="playground-editor-tabs" role="tablist" aria-label="Source files"><button type="button" role="tab" aria-selected={activeTab === "tsx"} className={activeTab === "tsx" ? "is-active" : ""} onClick={() => setActiveTab("tsx")}><span className="file-dot file-dot-tsx" /> Component.tsx</button><button type="button" role="tab" aria-selected={activeTab === "scss"} className={activeTab === "scss" ? "is-active" : ""} onClick={() => setActiveTab("scss")}><span className="file-dot file-dot-scss" /> Component.scss</button></div>
            <div className="playground-editor-shell">{activeTab === "tsx" ? <PlaygroundEditor value={draftTsx} language="tsx" errorLineOverride={lastEditedTsxLine} onChange={updateTsxDraft} /> : <PlaygroundEditor value={draftScss} language="scss" onChange={setDraftScss} />}</div>
            <div className="playground-editor-footer">Ctrl/Cmd+S save · Ctrl/Cmd+Enter save · Ctrl/Cmd+Shift+R reset · Ctrl/Cmd+1/2 switch files</div>
          </section>
        </main>
      </div>
    </LiveProvider>
  );
};

export default Playground;
