const editor = new SimpleMDE({
  element: document.getElementById('editor'),
});
editor.toggleSideBySide();

window.api.receive((event, arg) => {
  console.log(arg);
  // message back to main
  window.api.send(`Received ${arg}`);
  if (arg === 'toggle-bold') {
    editor.toggleBold();
  } else if (arg === 'toggle-italic') {
    editor.toggleItalic();
  } else if (arg === 'toggle-strike') {
    editor.toggleStrikethrough();
  }
});

window.api.send('Page Loaded');