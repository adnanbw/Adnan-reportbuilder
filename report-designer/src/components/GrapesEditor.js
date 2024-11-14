import React, { useEffect } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

function GrapesEditor() {
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      height: '100vh',
      width: 'auto',
      panels: { defaults: [] },
      storageManager: { autoload: 0 },
      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: 'text',
            label: 'Text',
            content: '<div class="text-block">Insert your text here</div>',
            category: 'Basic',
          },
          {
            id: 'image',
            label: 'Image',
            content: '<img src="https://via.placeholder.com/150" alt="Placeholder Image"/>',
            category: 'Basic',
          },
        ],
      },
    });

    // Optional: Customizing the editor UI further if needed
    editor.Panels.addPanel({
      id: 'panel-top',
      el: '.panel__top',
    });

    editor.Panels.addPanel({
      id: 'basic-actions',
      el: '.panel__basic-actions',
      buttons: [
        {
          id: 'visibility',
          active: true, // active by default
          label: '<u>Toggle</u>',
          command: 'sw-visibility', // Built-in command
        },
      ],
    });
  }, []);

  return (
    <div>
      <div id="gjs" style={{ height: '100%', overflow: 'hidden' }}></div>
      <div id="blocks"></div>
    </div>
  );
}

export default GrapesEditor;
