import * as path from 'path';

import * as fs from 'fs-extra';
import * as log from 'loglevel';

import { AppOptions } from '../../shared/src/options/model';
import { normalizeAppName } from './prepareElectronApp';

export const LAUNCHER_README_FILENAME = 'README-LAUNCHER.txt';

const DESKTOP_ICON_FORMATS = ['.png', '.svg', '.xpm'];

export type DesktopEntryFields = {
  name: string;
  url: string;
  exePath: string;
  iconPath?: string;
  desktopName: string;
};

function escapeValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/\r/g, '\\r')
    .replace(/^ /, '\\s'); // parsers strip leading whitespace
}

// Per the Desktop Entry spec, Exec quoting is undone after string escaping,
// so it's applied first, and a literal % must be doubled
function escapeExecArg(arg: string): string {
  const quoted = `"${arg.replace(/["`$\\]/g, '\\$&')}"`;
  return escapeValue(quoted).replace(/%/g, '%%');
}

function shellQuote(arg: string): string {
  return /^[\w./-]+$/.test(arg) ? arg : `'${arg.replace(/'/g, `'\\''`)}'`;
}

export function generateDesktopEntry(fields: DesktopEntryFields): string {
  const lines = [
    '[Desktop Entry]',
    'Type=Application',
    `Name=${escapeValue(fields.name)}`,
    `Comment=${escapeValue(`Nativefier app for ${fields.url}`)}`,
    `Exec=${escapeExecArg(fields.exePath)}`,
    ...(fields.iconPath ? [`Icon=${escapeValue(fields.iconPath)}`] : []),
    'Terminal=false',
    'Categories=Network;',
    `StartupWMClass=${escapeValue(fields.desktopName)}`,
  ];
  return `${lines.join('\n')}\n`;
}

export function generateLauncherReadme(
  name: string,
  url: string,
  exeName: string,
  desktopFileName: string,
): string {
  return `${name} was built with Nativefier for ${url}

To run it, launch the program in this folder:
    ${shellQuote(`./${exeName}`)}

To add ${name} to your application menu (GNOME, KDE, etc.), use the launcher
file next to it (your file manager may hide its .desktop extension):
    ${desktopFileName}

1. Move this folder to wherever you want to keep the app, such as /opt or
   ~/Applications. The launcher points at the folder's current location, so
   after a move, open it in a text editor and update the folder path wherever
   it appears.
2. From this folder, copy the launcher to your applications folder:
       cp ${shellQuote(`./${desktopFileName}`)} ~/.local/share/applications/

If you move the app again later, edit the copy in ~/.local/share/applications
the same way.

For more on launcher files, search for "linux .desktop entry", or see
https://wiki.archlinux.org/title/Desktop_entries
`;
}

/**
 * Writes a .desktop launcher and a README explaining how to install it into
 * the built app folder. It is not installed: users usually move the app after
 * building, which would leave a broken entry in their menu.
 */
export async function writeLinuxLauncher(
  builtAppPath: string,
  options: AppOptions,
): Promise<void> {
  // Launchers don't resolve relative paths, and --out can be relative
  const appPath = path.resolve(builtAppPath);
  const name = options.packager.name as string;
  const url = options.packager.targetUrl;
  const exeName = options.packager.executableName || name;
  const exePath = path.join(appPath, exeName);
  // @electron/packager renames some executables (Windows-reserved names,
  // names over 100 characters), and a launcher pointing elsewhere is broken
  if (!(await fs.pathExists(exePath))) {
    throw new Error(`Executable not found at ${exePath}`);
  }
  const desktopName = normalizeAppName(name, url);
  const desktopFileName = `${desktopName}.desktop`;

  let iconPath: string | undefined;
  const iconExt = path.extname(options.packager.icon ?? '');
  if (DESKTOP_ICON_FORMATS.includes(iconExt)) {
    // Absent when the app is packed into an asar archive
    const candidate = path.join(appPath, 'resources', 'app', `icon${iconExt}`);
    if (await fs.pathExists(candidate)) {
      iconPath = candidate;
    }
  }

  const desktopFilePath = path.join(appPath, desktopFileName);
  log.debug(`Writing Linux launcher to ${desktopFilePath}`);
  await fs.writeFile(
    desktopFilePath,
    generateDesktopEntry({
      name,
      url,
      exePath,
      iconPath,
      desktopName,
    }),
  );
  await fs.writeFile(
    path.join(appPath, LAUNCHER_README_FILENAME),
    generateLauncherReadme(name, url, exeName, desktopFileName),
  );
}
