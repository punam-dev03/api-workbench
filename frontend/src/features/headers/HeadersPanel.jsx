import Editor from "@monaco-editor/react";

const HeadersPanel = ({ headers, setHeaders }) => {
  return (
    <Editor
      height="150px"
      defaultLanguage="json"
      value={headers}
      onChange={(v) => setHeaders(v)}
      theme="vs-dark"
    />
  );
};

export default HeadersPanel;