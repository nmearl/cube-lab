import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import '../style/index.css';

import {
  ICommandPalette, InstanceTracker, ToolbarButton
} from '@jupyterlab/apputils';

import {
  JSONExt // new
} from '@phosphor/coreutils';

import {
  Widget,
} from '@phosphor/widgets';

import {
  Message
} from '@phosphor/messaging';
import { CommandRegistry } from '@phosphor/commands';

import { newPlot, Data, PlotlyHTMLElement } from 'plotly.js';

class XkcdWidget extends Widget {
  readonly img: HTMLImageElement;

  constructor() {
    super();

    this.id = 'xkcd-jupyterlab';
    this.title.label = 'xkcd.com';
    this.title.closable = true;
    this.addClass('jp-xkcdWidget');

    this.img = document.createElement('img');
    this.img.className = 'jp-xkcdCartoon';
    this.node.appendChild(this.img);

    this.img.insertAdjacentHTML('afterend',
      `<div class="jp-xkcdAttribution">
        <a href="https://creativecommons.org/licenses/by-nc/2.5/" class="jp-xkcsAttribution" target="_blank">
          <img src="https://licensebuttons.net/l/by-nc/2.5/80x15.png" />
        </a>
      </div>`
    );
  }

  onUpdateRequest(msg: Message): void {
    // Fetch info about a random comic
    fetch('https:////egszlpbmle.execute-api.us-east-1.amazonaws.com/prod').then(response => {
      return response.json();
    }).then(data => {
      this.img.src = data.img;
      this.img.alt = data.title;
      this.img.title = data.alt;
    });
  }
}

class PlotlyWidget extends Widget {
  readonly plot: Promise<PlotlyHTMLElement>;

  constructor() {
    super();

    this.id = 'cl-plotlyWidget';
    this.title.label = 'CubeLab Viewer'
    this.title.closable = true;

    let trace1 : Data = {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: 'scatter'
    };

    let trace2 : Data = {
      x: [1, 2, 3, 4],
      y: [16, 5, 11, 9],
      type: 'scatter'
    };

    let layout = {
      font: {size: 12}
    };

    let data: Data[] = [trace1, trace2];

    this.plot = newPlot(this.node, data, layout, {responsive: true});
  }

  onUpdateRequest(msg: Message): void {
    console.log(msg);
  }
}

function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
  console.log('JupyterLab extension cubelab is activated!');

  // Create xkcd widget
  let widget: PlotlyWidget;

  // Track and restore the widget state
  let tracker = new InstanceTracker<Widget>({ namespace: 'xkcd' });

  // Add an application command
  const command: string = 'cube-lab:open';

  restorer.restore(tracker, {
    command,
    args: () => JSONExt.emptyObject,
    name: () => 'xkcd'
  });

  app.commands.addCommand(command, {
    label: 'New Tab',
    execute: () => {
      if (!widget) {

        // Create a new widget if one does not exist
        widget = new PlotlyWidget();
        widget.update();
      }

      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }

      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not already there
        app.shell.addToMainArea(widget);
      } else {
        widget.update();
      }

      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette
  palette.addItem({command, category: 'CubeLab'});
}

/**
 * Initialization data for the cubelab extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'cubelab',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;