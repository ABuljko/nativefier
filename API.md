# API

## Table of Contents

- [Packaging Squirrel-based installers](#packaging-squirrel-based-installers)
- [Command Line](#command-line)
  - [Target Url](#target-url)
  - [[dest]](#dest)
  - [Help](#help)
  - [Version](#version)
  - [App Creation Options](#app-creation-options)
    - [[arch]](#arch)
    - [[conceal]](#conceal)
    - [[electron-version]](#electron-version)
    - [[global-shortcuts]](#global-shortcuts)
    - [[icon]](#icon)
    - [[name]](#name)
    - [[no-overwrite]](#no-overwrite)
    - [[platform]](#platform)
    - [[portable]](#portable)
    - [[upgrade]](#upgrade)
    - [[widevine]](#widevine)
  - [App Window Options](#app-window-options)
    - [[always-on-top]](#always-on-top)
    - [[background-color]](#background-color)
    - [[bookmarks-menu]](#bookmarks-menu)
    - [[browserwindow-options]](#browserwindow-options)
    - [[disable-context-menu]](#disable-context-menu)
    - [[disable-dev-tools]](#disable-dev-tools)
    - [[full-screen]](#full-screen)
    - [[height]](#height)
    - [[hide-window-frame]](#hide-window-frame)
    - [[max-height]](#max-height)
    - [[max-width]](#max-width)
    - [[maximize]](#maximize)
    - [[min-height]](#min-height)
    - [[min-width]](#min-width)
    - [[process-envs]](#process-envs)
    - [[show-menu-bar]](#show-menu-bar)
    - [[single-instance]](#single-instance)
    - [[tray]](#tray)
    - [[width]](#width)
    - [[x]](#x)
    - [[y]](#y)
    - [[zoom]](#zoom)
  - [Internal Browser Options](#internal-browser-options)
    - [[file-download-options]](#file-download-options)
    - [[inject]](#inject)
    - [[lang]](#lang)
    - [[user-agent]](#user-agent)
    - [[user-agent-honest]](#user-agent-honest)
  - [Internal Browser Cache Options](#internal-browser-cache-options)
    - [[clear-cache]](#clear-cache)
    - [[disk-cache-size]](#disk-cache-size)
  - [URL Handling Options](#url-handling-options)
    - [[block-external-urls]](#block-external-urls)
    - [[internal-urls]](#internal-urls)
      - [Internal Login Pages](#internal-login-pages)
    - [[strict-internal-urls]](#strict-internal-urls)
    - [[proxy-rules]](#proxy-rules)
  - [Auth Options](#auth-options)
    - [[[basic-auth-username] and [basic-auth-password]]](#basic-auth-username-and-basic-auth-password)
  - [Graphics Options](#graphics-options)
    - [[disable-gpu]](#disable-gpu)
    - [[enable-es3-apis]](#enable-es3-apis)
    - [[ignore-gpu-blacklist]](#ignore-gpu-blacklist)
  - [(In)Security Options](#insecurity-options)
    - [[disable-old-build-warning-yesiknowitisinsecure]](#disable-old-build-warning-yesiknowitisinsecure)
    - [[ignore-certificate]](#ignore-certificate)
    - [[insecure]](#insecure)
  - [Platform-Specific Options](#platform-specific-options)
    - [[app-copyright]](#app-copyright)
    - [[app-version]](#app-version)
    - [[bounce]](#bounce)
    - [[build-version]](#build-version)
    - [[counter]](#counter)
    - [[darwin-dark-mode-support]](#darwin-dark-mode-support)
    - [[fast-quit]](#fast-quit)
    - [[title-bar-style]](#title-bar-style)
    - [[win32metadata]](#win32metadata)
  - [Debug Options](#debug-options)
    - [[crash-reporter]](#crash-reporter)
    - [[verbose]](#verbose)
    - [[quiet]](#quiet)
- [Programmatic API](#programmatic-api)
- [Accessing The Electron Session](#accessing-the-electron-session)
  - [Important Note On funcArgs](#important-note-on-funcargs)
  - [session-interaction-reply](#session-interaction-reply)
  - [Request IDs](#request-ids)
  - [Errors](#errors)
  - [Complex Return Values](#complex-return-values)
  - [Example](#example)

## Packaging Squirrel-based installers

See [PR #744 - Support packaging nativefier applications into Squirrel-based installers](https://github.com/nativefier/nativefier/pull/744)

## Command Line

```bash
nativefier [options] [targetUrl] [dest]
```

You must provide:

- Either a `targetUrl` to generate a new app from it.
- Or option `--upgrade <pathOfAppToUpgrade>` to upgrade an existing app.

Command line options are listed below. They are grouped exactly as
`nativefier --help` groups them.

### Target Url

The url to point the application at.

### [dest]

Specifies the destination directory to build the app to.
If no parameter is passed, defaults to the current working directory,
or the `NATIVEFIER_APPS_DIR` environment variable if set.

**Tip:** Add `export NATIVEFIER_APPS_DIR=~/Applications/` to your
`~/.bashrc` (or `~/.zshrc` or similar) to set the default app destination
if none is passed. This lets you simply run `nativefier example.com` and
have the app automatically built in your Applications folder.

### Help

```
--help
```

Prints the usage information.

### Version

```
--version
```

Prints the version of your `nativefier` install.

### App Creation Options

#### [arch]

```
-a, --arch <value>
```

The processor architecture to target when building.

- Default: the architecture of the installed version of node (usually the architecture of the build-time machine).
  - To test your default architecture you can run
    ```
    node -p "process.arch"
    ```
    (See https://nodejs.org/api/os.html#os_os_arch)
  - Please note: On M1 Macs, unless an arm64 version of brew is used to install nodejs, the version installed will be an `x64` version run through Rosetta, and will result in an `x64` app being generated. If this is not desired, either specify `-a arm64` to build for M1, or re-install node with an arm64 version of brew. See https://github.com/nativefier/nativefier/issues/1089
- Can be overridden by specifying one of: `x64`, `armv7l`, `arm64`, or `universal`
- When specifying `universal` you must be building for the `darwin`, `mas`, `mac`, or `osx` platforms. This will generate a universal (M1 and x86) app.

Note: careful to not conflate _platform_ with _architecture_. If you want for example a Linux or Mac build, it's `--platform` you are looking for. See its documentation for details.

#### [conceal]

```
-c, --conceal
```

Specifies if the source code within the nativefied app should be packaged into an archive, defaults to false, [read more](https://www.electronjs.org/docs/latest/glossary#asar).

#### [electron-version]

```
-e, --electron-version <value>
```

The Electron version to build the app with, without the `v` (e.g. `25.9.8`).
Defaults to the version Nativefier bundles (`DEFAULT_ELECTRON_VERSION` in
[`src/constants.ts`](src/constants.ts), currently `25.9.8`).
See https://github.com/electron/electron/releases for the available versions.

#### [global-shortcuts]

```
--global-shortcuts shortcuts.json
```

Register global shortcuts which will trigger input events like key presses or pointer events in the application.

You may define multiple global shortcuts which can trigger a series of input events. It has the following structure:

```js
[
  {
    // Key is passed as first argument to globalShortcut.register
    key: 'CommandOrControl+Shift+Z',
    // The input events exactly match the event config in Electron for contents.sendInputEvent(event)
    inputEvents: [
      {
        // Available event types: mouseDown, mouseUp, mouseEnter, mouseLeave, contextMenu, mouseWheel, mouseMove, keyDown, keyUp or char
        type: 'keyDown',
        // Further config depends on your event type. See docs at: https://www.electronjs.org/docs/latest/api/web-contents
        keyCode: 'Space',
      },
    ],
  },
];
```

_Note regarding modifier keys:_ If you want to trigger key events which include a modifier (Ctrl, Shift,...), you need to keyDown the modifier key first, then keyDown the actual key _including_ the modifier key as modifier property and then keyUp both keys again. No idea what this means? See the example for `MediaPreviousTrack` below! For more details, please see the Electron documentation:

- List of available keys: https://www.electronjs.org/docs/latest/api/accelerator
- Details about how to create input event objects: https://www.electronjs.org/docs/latest/api/web-contents

_Note about Global Shortcuts on macOS_

On MacOS 10.14+, if you have set a global shortcut that includes a Media key, the user will need to be prompted for permissions to enable these keys in System Preferences > Security & Privacy > Accessibility.

Example `shortcuts.json` for `https://deezer.com` & `https://soundcloud.com` to get your play/pause/previous/next media keys working:

```json
[
  {
    "key": "MediaPlayPause",
    "inputEvents": [
      {
        "type": "keyDown",
        "keyCode": "Space"
      }
    ]
  },
  {
    "key": "MediaPreviousTrack",
    "inputEvents": [
      {
        "type": "keyDown",
        "keyCode": "Shift"
      },
      {
        "type": "keyDown",
        "keyCode": "Left",
        "modifiers": ["shift"]
      },
      {
        "type": "keyUp",
        "keyCode": "Left",
        "modifiers": ["shift"]
      },
      {
        "type": "keyUp",
        "keyCode": "Shift"
      }
    ]
  },
  {
    "key": "MediaNextTrack",
    "inputEvents": [
      {
        "type": "keyDown",
        "keyCode": "Shift"
      },
      {
        "type": "keyDown",
        "keyCode": "Right",
        "modifiers": ["shift"]
      },
      {
        "type": "keyUp",
        "keyCode": "Right",
        "modifiers": ["shift"]
      },
      {
        "type": "keyUp",
        "keyCode": "Shift"
      }
    ]
  }
]
```

#### [icon]

```
-i, --icon <path>
```

Notes:

- When packaging for Windows, must be a path to a `.ico` file.
- When packaging for Linux, must be a path to a `.png` file.
- When packaging for macOS, must be a `.icns` or a `.png` file if the [optional dependencies](README.md#installation) are installed.
  If your `PATH` has our image-conversion dependencies (`iconutil`, and either ImageMagick `convert` + `identify`, or GraphicsMagick `gm`), Nativefier will automatically convert the `.png` to a `.icns` for you.

Alternative to macOS users: [iConvertIcons](https://iconverticons.com/online/) can be used to convert `.pngs`, though it can be quite cumbersome.

To retrieve the `.icns` file from the downloaded file, extract it first and press File > Get Info. Then select the icon in the top left corner of the info window and press `⌘-C`. Open Preview and press File > New from clipboard and save the `.icns` file. It took me a while to figure out how to do that and question why a `.icns` file was not simply provided in the downloaded archive.

#### [name]

```
-n, --name <value>
```

The name of the application, which will affect strings in titles and the icon.

Note to Linux users: do not put spaces if you define the app name yourself with `--name`, as this causes problems when pinning a packaged app to the launcher.

#### [no-overwrite]

```
--no-overwrite
```

Specifies if the destination directory should be not overwritten, defaults to false.

#### [platform]

```
-p, --platform <value>
```

- Default: current operating system.
  - To test your default platform you can run
    ```
    node -p "process.platform"
    ```
    (See https://nodejs.org/api/os.html#os_os_platform)
- Can be overwritten by specifying either `linux`, `windows`, `osx` or `mas` for a Mac App Store specific build.

Note: careful to not conflate _platform_ with _architecture_. If you want for example an ARM build, it's `--arch` you are looking for. See its documentation for details.

For backwards compatibility, less-clear values `win32` (for Windows) and `darwin`, `mac` (for macOS) are supported.

#### [portable]

```
--portable
```

Make your app store its user data (cookies, cache, etc) inside the app folder, making it "portable" in the sense popularized by [PortableApps.com](https://portableapps.com/): you can carry it around e.g. on a USB key, and it will work the same with your data.

_IMPORTANT SECURITY NOTICE_: when creating a portable app, all data accumulated after running the app (including login information, cache, cookies), will be saved in the app folder. If this app is then shared with others, THEY WILL HAVE THAT ACCUMULATED DATA, POTENTIALLY INCLUDING ACCESS TO ANY ACCOUNTS YOU LOGGED INTO.

→ Best practice to _distribute apps_ using this flag:

1. Create your application with this flag
2. Test it
3. Delete your application and containing folder
4. Recreate it in the same way you did in step 1
5. Distribute the app without opening it

#### [upgrade]

```
--upgrade <pathToExistingApp>
```

This option will attempt to extract all existing options from the old app, and upgrade it using the current Nativefier CLI.

_Important data safety note_: This action is an in-place upgrade, and will REPLACE the current application. In case this feature does not work as intended or as the user may wish, it is advised to make a backup of the app to be upgraded before using, or specify an alternate directory as you would when creating a new file.\*\*

The provided path must be the "executable" of an application packaged with a previous version of Nativefier, and to be upgraded to the latest version of Nativefier. "Executable" means: the `.exe` file on Windows, the executable on Linux, or the `.app` on macOS. The executable must be living in the original context where it was generated (i.e., on Windows and Linux, the exe file must still be in the folder containing the generated `resources` directory).

#### [widevine]

```
--widevine
```

Use a Widevine-enabled version of Electron for DRM playback, see https://github.com/castlabs/electron-releases.

Note: some sites using Widevine (like Udemy or HBO Max) may still refuse to load videos, and require EVS-signing your Nativefier app to work. Try signing your app using CastLabs tools. See https://github.com/castlabs/electron-releases/wiki/EVS and [#1147](https://github.com/nativefier/nativefier/issues/1147#issuecomment-828750362). TL;DR:

```bash
# Install CastLabs tools:
pip install --upgrade castlabs-evs

# Sign up:
python3 -m castlabs_evs.account signup

# Sign your app
python -m castlabs_evs.vmp sign-pkg Udemy-win32-x64
```

### App Window Options

#### [always-on-top]

```
--always-on-top
```

Enable always on top for the packaged application.

#### [background-color]

```
--background-color <string>
```

See https://electronjs.org/docs/api/browser-window#setting-backgroundcolor

#### [bookmarks-menu]

```
--bookmarks-menu <string>
```

Path to a JSON file defining a bookmarks menu. In addition to containing a list of bookmarks, this file customizes the name of the menu and (optionally) allows assigning keyboard shortcuts to bookmarks.

This menu is a simple list; folders are not supported.

Your `menuLabel` can be bound to a `Alt + letter` shortcut using the letter `&` before the `letter` you want. Be careful to not conflict with the letter of other menus!

Keyboard shortcuts can use the modifier keys `Cmd`, `Ctrl`, `CmdOrCtrl`, `Alt`, `Option`, `AltGr`, `Shift`, and `Super`. See [the Electron documentation](https://www.electronjs.org/docs/api/accelerator) for more information.

Example of such a JSON file:

```json
{
  "menuLabel": "&Music",
  "bookmarks": [
    {
      "title": "lofi.cafe",
      "url": "https://lofi.cafe/",
      "type": "link",
      "shortcut": "CmdOrCtrl+1"
    },
    {
      "title": "beats to relax/study to",
      "url": "https://www.youtube.com/watch?v=5qap5aO4i9A",
      "type": "link",
      "shortcut": "CmdOrCtrl+2"
    },
    {
      "type": "separator"
    },
    {
      "title": "RÜFÜS DU SOL Live from Joshua Tree",
      "type": "link",
      "url": "https://www.youtube.com/watch?v=Zy4KtD98S2c"
    }
  ]
}
```

#### [browserwindow-options]

```
--browserwindow-options <json-string>
```

A JSON string that will be sent directly into Electron BrowserWindow options.
See [Electron's BrowserWindow API Documentation](https://electronjs.org/docs/api/browser-window#new-browserwindowoptions) for the complete list of options.

Example:

```bash
nativefier <your-website> --browserwindow-options '{ "webPreferences": { "defaultFontFamily": { "standard": "Comic Sans MS", "serif": "Comic Sans MS" } } }'
```

#### [disable-context-menu]

```
--disable-context-menu
```

Disable the context menu

#### [disable-dev-tools]

```
--disable-dev-tools
```

Disable the Chrome developer tools

#### [full-screen]

```
--full-screen
```

Makes the packaged app start in full screen.

#### [height]

```
--height <value>
```

Height of the packaged application, defaults to `800px`.

#### [hide-window-frame]

```
--hide-window-frame
```

Disable window frame and controls.

#### [max-height]

```
--max-height <value>
```

Maximum height of the packaged application, default is no limit.

#### [max-width]

```
--max-width <value>
```

Maximum width of the packaged application, default is no limit.

#### [maximize]

```
--maximize
```

Makes the packaged app start maximized.

#### [min-height]

```
--min-height <value>
```

Minimum height of the packaged application, defaults to `0`.

#### [min-width]

```
--min-width <value>
```

Minimum width of the packaged application, defaults to `0`.

#### [process-envs]

```
--process-envs <json-string>
```

a JSON string of key/value pairs to be set as environment variables before any browser windows are opened.

Example:

```bash
nativefier <your-geolocation-enabled-website> --process-envs '{"GOOGLE_API_KEY": "<your-google-api-key>"}'
```

#### [show-menu-bar]

```
-m, --show-menu-bar
```

Specifies if the menu bar should be shown.

#### [single-instance]

```
--single-instance
```

Prevents application from being run multiple times. If such an attempt occurs the already running instance is brought to front.

#### [tray]

```
--tray [start-in-tray]
```

Application will stay as an icon in the system tray. Prevents application from being closed from clicking the window close button.

When the optional argument `start-in-tray` is provided, i.e. the application is started using `--tray start-in-tray`, the main window will not be shown on first start.

Limitation: when creating a macOS app using option `--tray`, from a non-macOS build machine, the tray icon (in the menu bar) will be invisible.

#### [width]

```
--width <value>
```

Width of the packaged application, defaults to `1280px`.

#### [x]

```
--x <value>
```

X location of the packaged application window.

#### [y]

```
--y <value>
```

Y location of the packaged application window.

#### [zoom]

```
--zoom <value>
```

Sets a default zoom factor to be used when the app is opened, defaults to `1.0`.

### Internal Browser Options

#### [file-download-options]

```
--file-download-options <json-string>
```

A JSON string of key/value pairs to be set as file download options. See [electron-dl](https://github.com/sindresorhus/electron-dl) for available options.

Example:

```bash
nativefier <your-website> --file-download-options '{"saveAs": true}'
```

#### [inject]

```
--inject <value>
```

Allows you to inject JavaScript or CSS files. This command can be repeated multiple times to inject multiple files.

_Note about JS injection:_ injected JS is loaded _after_ `DOMContentLoaded`, so you can assume the DOM is complete & available.

_Note about CSS injection:_ to override existing CSS rules, you need to use the `!important` CSS keyword. Example: `#id_to_hide { display: none !important; }` , not just `#id_to_hide { display: none; }` .

Example:

```bash
nativefier http://google.com --inject ./some-js-injection.js --inject ./some-css-injection.css ~/Desktop
```

#### [lang]

```
--lang <value>
```

Set the language or locale to render the web site as (e.g., "fr", "en-US", "es", etc.)

#### [user-agent]

```
-u, --user-agent <value>
```

Set the user agent to run the created app with. Use `--user-agent-honest` to use the true Electron user agent.

The following short codes are also supported to generate a user agent: `edge`, `firefox`, `safari`.

- `edge` will generate a Microsoft Edge user agent matching the Chrome version of Electron being used
- `firefox` will generate a Mozilla Firefox user agent matching the latest stable release of that browser
- `safari` will generate an Apple Safari user agent matching the latest stable release of that browser

#### [user-agent-honest]

```
--user-agent-honest, --honest
```

By default, Nativefier uses a preset user agent string for your OS and masquerades as a regular Google Chrome browser, so that for some sites, it will not say that the current browser is unsupported.

If this flag is passed, it will not override the user agent, and use Electron's default generated one for your app.

### Internal Browser Cache Options

#### [clear-cache]

```
--clear-cache
```

Prevents the application from preserving cache between launches.

#### [disk-cache-size]

```
--disk-cache-size <value>
```

Forces the maximum disk space to be used by the disk cache. Value is given in bytes.

### URL Handling Options

#### [block-external-urls]

```
--block-external-urls
```

Forbid navigation to URLs not considered "internal" (see '--internal-urls'). Instead of opening in an external browser, attempts to navigate to external URLs will be blocked, and an error message will be shown. Default: false

Example:

```bash
nativefier https://google.com --internal-urls ".*?\.google\.*?" --block-external-urls
```

Blocks navigation to any URLs except Google and its subdomains.

#### [internal-urls]

```
--internal-urls <regex>
```

Regular expression of URLs to consider "internal" while following a hyperlink.
Internal URLs will open in Nativefier, other URLs will open in your preferred browser.

Defaults to view as "internal" two URLs that share the same base domain,
once stripped of `www.`. For example, by default,

- URLs from/to `foo.com`, `app.foo.com`, `www.foo.com` are considered internal.
- URLs from/to `abc.com` and `xyz.com` are considered external.

Example of `--internal-urls` causing all links to Google to be considered internal:

```bash
nativefier https://google.com --internal-urls ".*?\.google\.*?"
```

To turn off base domain matching, use [`--strict-internal-urls`](#strict-internal-urls).  Or, if you never expect Nativefier to open an "external" page in your OS browser,

```bash
nativefier https://google.com --internal-urls ".*?"
```

##### Internal Login Pages

Finally, URLs for known login pages
are considered internal. This does not replace `internal-urls`, it complements
it, and happens _before_ your `internal-urls` rule is applied. So, if you
already set the flag to let such auth pages open internally, you don't need to
change it but it might be unnecessary.

Current known internal login pages:

- `amazon.com/signin`
- `appleid.apple.com/auth/authorize`
- `id.atlassian.com` , `auth.atlassian.com`
- `facebook.com/login`
- `github.com/login` , `github.com/session`
- `accounts.google.com` , `mail.google.com/accounts/SetOSID`
- `linkedin.com/uas/login`
- `login.live.com` , `login.microsoftonline.com`
- `okta.com`
- `twitter.com/oauth/authenticate`
- `*.workspaceair.com`
- `*.securid.com`

Note: While .com is specified, for most of these we try to match even on non-US
based domains such as `.co.uk` as well

If you think this list is missing a login page that you think should be internal, feel free to submit an [issue](https://github.com/ABuljko/nativefier/issues/new?assignees=&labels=bug&template=bug_report.md&title=[New%20internal%20login%20page%20request]%20Your%20login%20page%20here) or even better a pull request!

#### [strict-internal-urls]

```
--strict-internal-urls
```

Disables base domain matching when determining if a link is internal.  Only the `--internal-urls` regex and login pages will be matched against, so `app.foo.com` will be external to `www.foo.com` unless it matches the `--internal-urls` regex.

#### [proxy-rules]

```
--proxy-rules <value>
```

See [Electron proxyRules](https://electronjs.org/docs/api/session?q=proxy#sessetproxyconfig-callback) for more details.

Example:

```bash
nativefier https://google.com --proxy-rules http://127.0.0.1:1080
```

### Auth Options

#### [[basic-auth-username] and [basic-auth-password]]

```
--basic-auth-username <value> --basic-auth-password <value>
```

Set basic http(s) auth via the command line to have the app automatically log you in to a protected site. Both fields are required if one is set.

### Graphics Options

#### [disable-gpu]

```
--disable-gpu
```

Disable hardware acceleration for the packaged application.

#### [enable-es3-apis]

```
--enable-es3-apis
```

Passes the enable-es3-apis flag to the Chrome engine, to force the activation of WebGl 2.0.

#### [ignore-gpu-blacklist]

```
--ignore-gpu-blacklist
```

Passes the ignore-gpu-blacklist flag to the Chrome engine, to allow for WebGl apps to work on non supported graphics cards.

### (In)Security Options

#### [disable-old-build-warning-yesiknowitisinsecure]

```
--disable-old-build-warning-yesiknowitisinsecure
```

Disables the warning shown when opening a Nativefier app made a long time ago, using an old and probably insecure Electron. Nativefier uses the Chrome browser (through Electron), and remaining on an old version is A. performance sub-optimal and B. dangerous.

However, there are legitimate use cases to disable such a warning. For example, if you are using Nativefier to ship a kiosk app exposing an internal site (over which you have control). Under those circumstances, it is reasonable to disable this warning that you definitely don't want end-users to see.

#### [ignore-certificate]

```
--ignore-certificate
```

Forces the packaged app to ignore certificate errors.

#### [insecure]

```
--insecure
```

Forces the packaged app to ignore web security errors, such as [Mixed Content](https://developer.mozilla.org/en-US/docs/Security/Mixed_content) errors when receiving HTTP content on a HTTPS site.

### Platform-Specific Options

#### [app-copyright]

```
--app-copyright <value>
```

(macOS and Windows only) The human-readable copyright line for the app. Maps to the `LegalCopyright` metadata property on Windows, and `NSHumanReadableCopyright` on macOS.

#### [app-version]

```
--app-version <value>
```

(macOS and Windows only) The release version of the application. By default the `version` property in the `package.json` is used but it can be overridden with this argument. If neither are provided, the version of Electron will be used. Maps to the `ProductVersion` metadata property on Windows, and `CFBundleShortVersionString` on macOS.

#### [bounce]

```
--bounce
```

(macOS only) When the counter increases, the dock icon will bounce for one second. This only works if the `--counter` option is active.

#### [build-version]

```
--build-version <value>
```

(macOS and Windows only) The build version of the application. Maps to the `FileVersion` metadata property on Windows, and `CFBundleVersion` on macOS.

#### [counter]

```
--counter
```

(macOS only) Use a counter that persists even with window focus for the application badge for sites that use an "(X)" format counter in the page title (i.e. Gmail).

#### [darwin-dark-mode-support]

```
--darwin-dark-mode-support
```

(macOS only) Enables Dark Mode support on macOS 10.14+.

#### [fast-quit]

```
-f, --fast-quit
```

(macOS only) Specifies to quit the app after closing all windows, defaults to false.

#### [title-bar-style]

```
--title-bar-style <value>
```

(macOS only) Sets the style for the app's title bar, either `hidden` or
`hiddenInset`. See more details in Electron's [Frameless Window](https://www.electronjs.org/docs/latest/api/frameless-window) documentation.

Consider injecting a custom CSS (via `--inject`) for better integration. Specifically, the CSS should specify a draggable region. For instance, if the target website has a `<header>` element, you can make it draggable like so.

```css
/* site.css */

/* header is draggable... */
header {
  -webkit-app-region: drag;
}

/* but any buttons inside the header shouldn't be draggable */
header button {
  -webkit-app-region: no-drag;
}

/* perhaps move some items out of way for the traffic light */
header div:first-child {
  margin-left: 100px;
  margin-top: 25px;
}
```

```sh
nativefier http://google.com --inject site.css --title-bar-style 'hiddenInset'
```

#### [win32metadata]

```
--win32metadata <json-string>
```

a JSON string of key/value pairs of application metadata (ProductName, InternalName, FileDescription) to embed into the executable (Windows only).

Example:

```bash
nativefier <your-geolocation-enabled-website> --win32metadata '{"ProductName": "Your Product Name", "InternalName": "Your Internal Name", "FileDescription": "Your File Description"}'
```

### Debug Options

#### [crash-reporter]

```
--crash-reporter <value>
```

Enables crash reporting and set the URL to submit crash reports to

Example:

```bash
nativefier http://google.com --crash-reporter https://electron-crash-reporter.appspot.com/PROJECT_ID/create/
```

#### [verbose]

```
--verbose
```

Shows detailed logs in the console.

#### [quiet]

```
--quiet
```

Suppress all log output. If both `verbose` and `quiet` are passed to the CLI, `verbose` will take precedence.

## Programmatic API

In addition to the CLI, Nativefier exposes a Node.js API: `buildNativefierApp`,
which takes the same options as the CLI flags (camelCased) and returns a promise
resolving with the path of the app it built.

```bash
# install and save to package.json
npm install --save nativefier
```

In your `.js` file:

```javascript
const { buildNativefierApp } = require('nativefier');

// A few of the available options; they mirror the CLI flags, camelCased.
// Only `targetUrl` is required, everything else falls back to the same
// defaults the CLI uses.
const options = {
  targetUrl: 'https://web.whatsapp.com', // required
  name: 'Web WhatsApp', // inferred from the page title if not specified
  platform: 'darwin', // defaults to the current system
  arch: 'x64', // defaults to the current system
  electronVersion: '25.9.8', // defaults to the bundled Electron
  out: '.',
  overwrite: false,
  conceal: false, // package the app source into an asar archive
  icon: '~/Desktop/icon.png',
  counter: false,
  bounce: false,
  width: 1280,
  height: 800,
  showMenuBar: false,
  fastQuit: false,
  userAgent: 'Mozilla ...', // inferred for the current system if not specified
  userAgentHonest: false,
  ignoreCertificate: false,
  ignoreGpuBlacklist: false,
  enableEs3Apis: false,
  internalUrls: '.*?',
  strictInternalUrls: false,
  blockExternalUrls: false,
  insecure: false,
  zoom: 1.0,
  singleInstance: false,
  clearCache: false,
  fileDownloadOptions: {
    saveAs: true, // always show "Save As" dialog
  },
  processEnvs: {
    GOOGLE_API_KEY: '<your-google-api-key>',
  },
};

buildNativefierApp(options)
  .then((appPath) => {
    console.log('App has been nativefied to', appPath);
  })
  .catch((error) => {
    console.error('Error building app:', error);
  });
```

The complete list of accepted options is the `RawOptions` type, declared in
[`shared/src/options/model.ts`](shared/src/options/model.ts).

## Accessing The Electron Session

Sometimes there are Electron features that are exposed via the [Electron `session` API](https://www.electronjs.org/docs/api/session), that may not be exposed via Nativefier options. These can be accessed with an injected javascript file (via the `--inject` command line argument when building your application). Within that javascript file, you may send an ipcRenderer `session-interaction` event, and listen for a `session-interaction-reply` event to get any result. Session properties and functions can be accessed via this event. This event takes an object as an argument with the desired interaction to be performed.

**Warning**: using this feature in an `--inject` script means using Electron's `session` API, which is not a standard web API and subject to potential [Breaking Changes](https://www.electronjs.org/docs/breaking-changes) at each major Electron upgrade.

To get a `session` property:

```javascript
const electron = require('electron');

const request = {
  property: 'availableSpellCheckerLanguages',
};
electron.ipcRenderer.send('session-interaction', request);
```

To set a `session` property:

```javascript
const electron = require('electron');

const request = {
  property: 'spellCheckerEnabled',
  propertyValue: true,
};
electron.ipcRenderer.send('session-interaction', request);
```

To call a `session` function:

```javascript
const electron = require('electron');

const request = {
  func: 'clearCache',
};
electron.ipcRenderer.send('session-interaction', request);
```

To call a `session` function, with arguments:

```javascript
const electron = require('electron');

const request = {
  func: 'setDownloadPath',
  funcArgs: [`/home/user/downloads`],
};
electron.ipcRenderer.send('session-interaction', request);
```

If neither a `func` nor a `property` is provided in the event, an error will be returned.

### Important Note On funcArgs

PLEASE NOTE: `funcArgs` is ALWAYS an array of arguments to be passed to the function, even if it is just one argument. If `funcArgs` is omitted from a request with a `func` provided, no arguments will be passed.

### session-interaction-reply

The results of the call, if desired, can be accessed one of two ways. Either you can listen for a `session-interaction-reply` event, and access the resulting value like so:

```javascript
const electron = require('electron');

const request = {
  property: 'availableSpellCheckerLanguages',
};
electron.ipcRenderer.send('session-interaction', request);

electron.ipcRenderer.on('session-interaction-reply', (event, result) => {
  console.log('session-interaction-reply', event, result.value);
});
```

Or the result can be retrieved synchronously, though this is not recommended as it may cause slowdowns and freezes in your apps while the app stops and waits for the result to be returned. Heed this [warning from Electron](https://www.electronjs.org/docs/api/ipc-renderer):

> ⚠️ WARNING: Sending a synchronous message will block the whole renderer process until the reply is received, so use this method only as a last resort. It's much better to use the asynchronous version.

```javascript
const electron = require('electron');

const request = {
  property: 'availableSpellCheckerLanguages',
};
console.log(
  electron.ipcRenderer.sendSync('session-interaction', request).value,
);
```

### Request IDs

If desired, an id for the request may be provided to distinguish between event replies:

```javascript
const electron = require('electron');

const request = {
  id: 'availableSpellCheckerLanguages',
  property: 'availableSpellCheckerLanguages',
};
electron.ipcRenderer.send('session-interaction', request);

electron.ipcRenderer.on('session-interaction-reply', (event, result) => {
  console.log('session-interaction-reply', event, result.id, result.value);
});
```

### Errors

If an error occurs while handling the interaction, it will be returned in the `session-interaction-reply` event inside the result:

```javascript
const electron = require('electron');

electron.ipcRenderer.on('session-interaction-reply', (event, result) => {
  console.log('session-interaction-reply', event, result.error);
});

electron.ipcRenderer.send('session-interaction', {
  func: 'thisFunctionDoesNotExist',
});
```

### Complex Return Values

Due to the nature of how these events are transmitted back and forth, session functions and properties that return full classes or class instances are not supported.

For example, the following code will return an error instead of the expected value:

```javascript
const electron = require('electron');

const request = {
  id: 'cookies',
  property: 'cookies',
};
electron.ipcRenderer.send('session-interaction', request);

electron.ipcRenderer.on('session-interaction-reply', (event, result) => {
  console.log('session-interaction-reply', event, result);
});
```

### Example

This javascript, when injected as a file via `--inject`, will attempt to call the `isSpellCheckerEnabled` function to make sure the spell checker is enabled, enables it via the `spellCheckerEnabled` property, gets the value of the `availableSpellCheckerLanguages` property, and finally will call `setSpellCheckerLanguages` to set the `fr` language as the preferred spellcheck language if it's supported.

```javascript
const electron = require('electron');

electron.ipcRenderer.on('session-interaction-reply', (event, result) => {
  console.log('session-interaction-reply', event, result);
  switch (result.id) {
    case 'isSpellCheckerEnabled':
      console.log('SpellChecker enabled?', result.value);
      if (result.value === true) {
        console.log('Getting supported languages...');
        electron.ipcRenderer.send('session-interaction', {
          id: 'availableSpellCheckerLanguages',
          property: 'availableSpellCheckerLanguages',
        });
      } else {
        console.log('SpellChecker disabled. Enabling...');
        electron.ipcRenderer.send('session-interaction', {
          id: 'setSpellCheckerEnabled',
          property: 'spellCheckerEnabled',
          propertyValue: true,
        });
      }
      break;
    case 'setSpellCheckerEnabled':
      console.log(
        'SpellChecker has now been enabled. Getting supported languages...',
      );
      electron.ipcRenderer.send('session-interaction', {
        id: 'availableSpellCheckerLanguages',
        property: 'availableSpellCheckerLanguages',
      });
      break;
    case 'availableSpellCheckerLanguages':
      console.log('Avaliable spellChecker languages:', result.value);
      if (result.value.indexOf('fr') > -1) {
        electron.ipcRenderer.send('session-interaction', {
          id: 'setSpellCheckerLanguages',
          func: 'setSpellCheckerLanguages',
          funcArgs: [['fr']],
        });
      } else {
        console.log(
          "Not changing spellChecker language. 'fr' is not supported.",
        );
      }
      break;
    case 'setSpellCheckerLanguages':
      console.log('SpellChecker language was set.');
      break;
    default:
      console.error('Unknown reply id:', result.id);
  }
});

electron.ipcRenderer.send('session-interaction', {
  id: 'isSpellCheckerEnabled',
  func: 'isSpellCheckerEnabled',
});
```
