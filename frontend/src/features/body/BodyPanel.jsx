import Editor from "@monaco-editor/react";

const BodyPanel = ({ body, setBody }) => {
  return (
    <Editor
      height="200px"
      defaultLanguage="json"
      value={body}
      onChange={(v) => setBody(v)}
      theme="vs-dark"
    />
  );
};

export default BodyPanel;