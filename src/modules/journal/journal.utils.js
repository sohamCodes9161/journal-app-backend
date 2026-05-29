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
export const extractMediaIds = (content) => {
  const ids = [];

  function walk(node) {
    if (!node) return;

    if (node.type === "image") {
      if (node.attrs?.mediaId) {
        ids.push(node.attrs.mediaId);
      }
    }

    if (node.content) {
      node.content.forEach(walk);
    }
  }

  walk(content);
  return ids;
};

export { calculateWordCount };
