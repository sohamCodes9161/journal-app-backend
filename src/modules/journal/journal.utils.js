const extractTextFromEditorJSON = (node) => {
  let text = "";

  if (node.text) {
    text += node.text + " ";
  }

  if (node.content) {
    for (const child of node.content) {
      text += extractTextFromEditorJSON(child);
    }
  }

  return text;
};

const calculateWordCount = (editorJSON) => {
  const extractedText = extractTextFromEditorJSON(editorJSON);

  return extractedText.trim().split(/\s+/).filter(Boolean).length;
};

export { calculateWordCount };
