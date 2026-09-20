import { BrowserWindow, ContextMenuParams } from 'electron';
import contextMenu from 'electron-context-menu';

import { nativeTabsSupported, openExternal } from '../helpers/helpers';
import * as log from '../helpers/loggingHelper';
import { setupNativefierWindow } from '../helpers/windowEvents';
import { createNewWindow } from '../helpers/windowHelpers';
import {
  OutputOptions,
  outputOptionsToWindowOptions,
} from '../../../shared/src/options/model';

export function initContextMenu(
  options: OutputOptions,
  window?: BrowserWindow,
): void {
  log.debug('initContextMenu');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  contextMenu({
    prepend: (actions: contextMenu.Actions, params: ContextMenuParams) => {
      log.debug('contextMenu.prepend', { actions, params });
      const items = [];
      if (params.linkURL && window) {
        items.push({
          label: 'Open Link in Default Browser',
          click: () => {
            openExternal(params.linkURL).catch((err) =>
              log.error('contextMenu Open Link in Default Browser ERROR', err),
            );
          },
        });
        items.push({
          label: 'Open Link in New Window',
          click: () =>
            createNewWindow(
              outputOptionsToWindowOptions(options, nativeTabsSupported()),
              setupNativefierWindow,
              params.linkURL,
            ),
        });
        if (nativeTabsSupported()) {
          items.push({
            label: 'Open Link in New Tab',
            click: () =>
              window.emit('new-window-for-tab', {
                ...new Event('new-window-for-tab'),
                url: params.linkURL,
              }),
          });
        }
      }
      return items;
    },
    showCopyImage: true,
    showCopyImageAddress: true,
    showSaveImage: true,
  });
}
