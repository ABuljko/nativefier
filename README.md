# Nativefier

![Example of Nativefier app in the macOS dock](.github/dock-screenshot.png)

You want to make a native-looking wrapper for WhatsApp Web (or any web page).

```bash
nativefier 'web.whatsapp.com'
```

![Walkthrough animation](.github/nativefier-walkthrough.gif)

You're done.

## Introduction

Nativefier is a command-line tool to easily create a “desktop app” for any web site
with minimal fuss. Apps are wrapped by [Electron](https://www.electronjs.org/)
(which uses Chromium under the hood) in an OS executable (`.app`, `.exe`, etc)
usable on Windows, macOS and Linux.

This repository continues [the original Nativefier](https://github.com/nativefier/nativefier),
which its authors [retired](https://github.com/nativefier/nativefier/issues/1577)
after release 52.0.0. Development here picks up from that release: dependencies
are kept current, and bugs get fixed. The original motivation still holds — not
having to Alt-Tab to a browser and dig through tabs to reach Messenger or
WhatsApp Web ([HN thread](https://news.ycombinator.com/item?id=10930718)).

Features:

- Automatic retrieval of app icon & name
- Injection of custom JS & CSS
- Many more, see the [API docs](API.md) or `nativefier --help`

## Installation

Requirements:

- [Node.js](https://nodejs.org/) ≥ 20.18.1 and npm ≥ 10.8.2
- macOS 10.13+ / Windows 10+ / Linux, to *build* apps
  (built apps run on whatever the bundled Electron supports)

Install this version from source:

```bash
git clone https://github.com/ABuljko/nativefier.git
cd nativefier
npm ci    # also builds, via the `prepare` hook
npm link  # puts `nativefier` on your PATH
```

The last release published to npm by the original project is also installable
with `npm install -g nativefier`, but it does not include the changes made here.

Optional dependencies:

- [ImageMagick](https://imagemagick.org/) or [GraphicsMagick](http://www.graphicsmagick.org/) to convert icons.
  Be sure `convert` + `identify` or `gm` are in your `$PATH`.
- [Wine](https://www.winehq.org/) to build Windows apps from non-Windows platforms.
  Be sure `wine` is in your `$PATH`.

<details>
  <summary>Or build & run it with Docker (click to expand)</summary>

  Build the image from this repository:

  ```bash
  docker build -t local/nativefier .
  ```

  By default, `nativefier --help` will be executed.
  To build e.g. a Gmail app into `~/nativefier-apps`,

  ```bash
  docker run --rm -v ~/nativefier-apps:/target/ local/nativefier https://mail.google.com/ /target/
  ```

  You can pass Nativefier flags, and mount volumes to pass local files. E.g. to use an icon,

  ```bash
  docker run --rm -v ~/my-icons-folder/:/src -v $TARGET-PATH:/target local/nativefier --icon /src/icon.png --name whatsApp -p linux -a x64 https://web.whatsapp.com/ /target/
  ```
</details>

## Usage

To create an app for medium.com, simply `nativefier 'medium.com'`

Nativefier will try to determine the app name, and well as other options that you
can override. For example, to override the name, `nativefier --name 'My Medium App' 'medium.com'`

**Read the [API docs](API.md) or run `nativefier --help`**
to learn about command-line flags and configure your app.

## Troubleshooting

**See [CATALOG.md](CATALOG.md) for site-specific ideas & workarounds**.

If this doesn’t help, go look at the [issue tracker](https://github.com/ABuljko/nativefier/issues).

## Development

Docs: [Developer / build / hacking](HACKING.md), [API / flags](API.md),
[Changelog](CHANGELOG.md).

License: [MIT](LICENSE.md).
