const editor = new SimpleMDE({
  element: document.getElementById('editor'),
});
editor.toggleSideBySide();

function updateTitle(title) {
  const titles = document.getElementsByTagName('title');
  if (titles.length > 0) {
    titles[0].innerText = title;
  }
}

window.api.receive((event, ...args) => {
  console.log(`api.receive: ${args}`);

  if (args.length <= 0) return;

  const arg = args[0];

  // message back to main
  if (arg === 'toggle-bold') {
    editor.toggleBold();
  } else if (arg === 'toggle-italic') {
    editor.toggleItalic();
  } else if (arg === 'toggle-strike') {
    editor.toggleStrikethrough();
  } else if (arg === 'save') {
    window.api.save(editor.value());
  } else if (arg === 'set-title') {
    updateTitle(args[1]);
  } else if (arg === 'open') {
    updateTitle(args[1]);
    editor.value(args[2]);
  }
});

window.api.send('Page Loaded');
