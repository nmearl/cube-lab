import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import {
  Widget
} from '@phosphor/widgets';

/**
 * Initialization data for the cube_lab extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'cube_lab',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterLab, palette: ICommandPalette) => {
    console.log('JupyterLab extension cube_lab is activated!');

    let widget: Widget = new Widget();
    widget.id = 'cube-lab-palette';
    widget.title.label = 'CubeLab';
    widget.title.closable = true;

    const command: string = 'cube-lab:open';

    app.commands.addCommand(command, {
      label: 'New Tab',
      execute: () => {
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not already there
          app.shell.addToMainArea(widget);
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });

    // Add the command to the palette
    palette.addItem({command, category: 'CubeLab'});

    console.log('ICommandPalette:', palette)
  }
};

export default extension;
