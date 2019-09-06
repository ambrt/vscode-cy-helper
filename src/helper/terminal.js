const { window } = require('vscode');
const { editDocument } = require('./utils');
const { TERMINAL_NAME, FOCUS_TAG, ONLY_BLOCK } = require('./constants');

let _activeTerminal = null;

const removeTags = terminal => {
  if (terminal.name === TERMINAL_NAME) {
    if (!terminal.disposed) {
      disposeTerminal();
    }
    const editor = window.activeTextEditor;
    const fullText = editor.document.getText().split('\n');
    const testRows = fullText
      .map((line, row) => {
        if (
          line.trim().startsWith(FOCUS_TAG) ||
          line.trim().includes(ONLY_BLOCK)
        ) {
          return row;
        }
      })
      .filter(e => Boolean(e));
    const newTexts = [];
    const markAsOnly = testRows.map(row => {
      const { text, range } = editor.document.lineAt(row);
      const newText = text.replace(FOCUS_TAG, '').replace(ONLY_BLOCK, '');
      newTexts.push(newText);
      return range;
    });
    editDocument(markAsOnly, newTexts);
  }
};

const createTerminal = () => {
  _activeTerminal = window.createTerminal(TERMINAL_NAME);
  return _activeTerminal;
};

const disposeTerminal = () => {
  _activeTerminal.disposed = true;
  _activeTerminal.dispose();
  _activeTerminal = null;
};

const getTerminal = () => {
  if (_activeTerminal) {
    _activeTerminal.reused = true;
  } else {
    createTerminal();
  }
  return _activeTerminal;
};

module.exports = {
  getTerminal: getTerminal,
  removeTags: removeTags
};