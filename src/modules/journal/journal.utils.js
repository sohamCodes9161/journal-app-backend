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

const extractMediaIds = (content) => {
  const mediaIds = [];

  const traverse = (node) => {
    if (!node) return;

    if (node.type === "image" && node.attrs?.mediaId) {
      mediaIds.push(node.attrs.mediaId);
    }

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  };

  traverse(content);

  return mediaIds;
};

export { extractMediaIds };
export { calculateWordCount };
