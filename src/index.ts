import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the cube_lab extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'cube_lab',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension cube_lab is activated!');
  }
};

export default extension;
