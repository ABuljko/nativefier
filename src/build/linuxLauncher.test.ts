import * as path from 'path';

import * as fs from 'fs-extra';

import { getTempDir } from '../helpers/helpers';
import { AppOptions } from '../../shared/src/options/model';
import {
  generateDesktopEntry,
  generateLauncherReadme,
  LAUNCHER_README_FILENAME,
  writeLinuxLauncher,
} from './linuxLauncher';

describe('generateDesktopEntry', () => {
  test('it writes a launcher matching the app window', () => {
    expect(
      generateDesktopEntry({
        name: 'Trello',
        url: 'https://trello.com',
        exePath: '/opt/Trello-linux-x64/Trello',
        iconPath: '/opt/Trello-linux-x64/resources/app/icon.png',
        desktopName: 'trello-nativefier-679e8e',
      }),
    ).toBe(
      [
        '[Desktop Entry]',
        'Type=Application',
        'Name=Trello',
        'Comment=Nativefier app for https://trello.com',
        'Exec="/opt/Trello-linux-x64/Trello"',
        'Icon=/opt/Trello-linux-x64/resources/app/icon.png',
        'Terminal=false',
        'Categories=Network;',
        'StartupWMClass=trello-nativefier-679e8e',
        '',
      ].join('\n'),
    );
  });

  test('it escapes Exec as the Desktop Entry spec requires', () => {
    const entry = generateDesktopEntry({
      name: 'App',
      url: 'https://example.com',
      exePath: '/a b/"q"/$x/100%/back\\slash/App',
      desktopName: 'app-nativefier-123456',
    });
    expect(entry).toContain(
      'Exec="/a b/\\\\"q\\\\"/\\\\$x/100%%/back\\\\\\\\slash/App"\n',
    );
  });

  test('it keeps a leading space in values', () => {
    const entry = generateDesktopEntry({
      name: ' App',
      url: 'https://example.com',
      exePath: '/opt/App/App',
      desktopName: 'app-nativefier-123456',
    });
    expect(entry).toContain('Name=\\sApp\n');
  });

  test('it leaves Icon out when there is no icon', () => {
    const entry = generateDesktopEntry({
      name: 'App',
      url: 'https://example.com',
      exePath: '/opt/App/App',
      desktopName: 'app-nativefier-123456',
    });
    expect(entry).not.toContain('Icon=');
  });
});

describe('generateLauncherReadme', () => {
  test('it leaves plain names unquoted', () => {
    const readme = generateLauncherReadme(
      'Trello',
      'https://trello.com',
      'Trello',
      'trello-nativefier-679e8e.desktop',
    );
    expect(readme).toContain('\n    ./Trello\n');
    expect(readme).toContain(
      'cp ./trello-nativefier-679e8e.desktop ~/.local/share/applications/',
    );
  });

  test('it shell-quotes names a shell would split', () => {
    const readme = generateLauncherReadme(
      "O'Reilly&Co",
      'https://example.com',
      "O'Reilly&Co",
      "o'reilly&co-nativefier-123456.desktop",
    );
    expect(readme).toContain(`\n    './O'\\''Reilly&Co'\n`);
    expect(readme).toContain(
      `cp './o'\\''reilly&co-nativefier-123456.desktop' ~/.local/share/applications/`,
    );
  });
});

describe('writeLinuxLauncher', () => {
  const options = {
    packager: {
      name: 'Trello',
      targetUrl: 'https://trello.com',
      icon: '/somewhere/else/icon.png',
    },
  } as AppOptions;
  const desktopFileName = 'trello-nativefier-679e8e.desktop';

  async function makeApp(
    withIcon: boolean,
    appPath = getTempDir('linuxLauncher'),
  ): Promise<string> {
    await fs.outputFile(path.join(appPath, 'Trello'), '');
    if (withIcon) {
      await fs.outputFile(
        path.join(appPath, 'resources', 'app', 'icon.png'),
        '',
      );
    }
    return appPath;
  }

  test('it writes the launcher and its README into the app folder', async () => {
    const appPath = await makeApp(true);

    await writeLinuxLauncher(appPath, options);

    const entry = await fs.readFile(
      path.join(appPath, desktopFileName),
      'utf8',
    );
    expect(entry).toContain('StartupWMClass=trello-nativefier-679e8e\n');
    expect(entry).toContain('Icon=');
    expect(
      await fs.pathExists(path.join(appPath, LAUNCHER_README_FILENAME)),
    ).toBe(true);
  });

  test('it leaves Icon out when the icon is packed into an asar', async () => {
    const appPath = await makeApp(false);

    await writeLinuxLauncher(appPath, options);

    const entry = await fs.readFile(
      path.join(appPath, desktopFileName),
      'utf8',
    );
    expect(entry).not.toContain('Icon=');
  });

  test('it writes absolute paths for a relative app path', async () => {
    // Under the working dir: on Windows CI the temp dir is on another drive,
    // and Jest's process.chdir doesn't reach path.resolve
    const scratchDir = path.join('node_modules', '.cache');
    await fs.ensureDir(scratchDir);
    const relativeAppPath = await fs.mkdtemp(
      path.join(scratchDir, 'linuxLauncher-'),
    );
    try {
      await makeApp(true, relativeAppPath);

      await writeLinuxLauncher(relativeAppPath, options);

      const appPath = path.resolve(relativeAppPath);
      expect(
        await fs.readFile(path.join(appPath, desktopFileName), 'utf8'),
      ).toBe(
        generateDesktopEntry({
          name: 'Trello',
          url: 'https://trello.com',
          exePath: path.join(appPath, 'Trello'),
          iconPath: path.join(appPath, 'resources', 'app', 'icon.png'),
          desktopName: 'trello-nativefier-679e8e',
        }),
      );
    } finally {
      await fs.remove(relativeAppPath);
    }
  });

  test('it refuses to point at an executable that does not exist', async () => {
    const appPath = getTempDir('linuxLauncher');

    await expect(writeLinuxLauncher(appPath, options)).rejects.toThrow(
      'Executable not found',
    );
    expect(await fs.pathExists(path.join(appPath, desktopFileName))).toBe(
      false,
    );
  });
});
