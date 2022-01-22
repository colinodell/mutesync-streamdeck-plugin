# Mutesync Plugin for Elgato Stream Deck (unofficial)

**This project is not affiliated, endorsed, or supported by the creators of [mütesync](https://mutesync.com/).**

## Overview

Integrates the [mütesync virtual button](https://mutesync.com/virtual-mute-button) into the Elgato Stream Deck so that you can mute and unmute your microphone using your Stream Deck.

![](screenshot.gif)

## Requirements

 - Stream Deck 4.1 or later (Windows or macOS)
 - [mütesync virtual button](https://mutesync.com/virtual-mute-button)

## Installation

1. Download the latest release of this plugin.
2. Install it into the Stream Deck software.
3. Open the mutesync virtual button preferences, go to the Authentication tab, and check the "Allow External App" checkbox.
4. Add the plugin's action button to your Stream Deck.

## Troubleshooting

If the button displays `Error!` it likely wasn't able to authenticate with the mutesync software.

**Quick fix:** Perform step 3 above; keeping that window open, press the button on your Stream Deck and it should reconnect. You can then close that window.

If that doesn't work, try removing the button and following steps 3-4 above to fix it.

## License and Attribution

This project is licensed under the [MIT license](LICENSE.md) and includes code adapted from the following projects:

| Project                                                                                     | License                                                                                   |
|---------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| [Elgato Stream Deck Plugin Template](https://github.com/elgatosf/streamdeck-plugintemplate) | [MIT license](https://github.com/elgatosf/streamdeck-plugintemplate/blob/e66f0f1/LICENSE) |
| [pymutesync](https://github.com/currentoor/pymutesync)                                      | [Apache License 2.0](https://github.com/currentoor/pymutesync/blob/085b9fb/setup.py#L8)   |
| [Font Awesome](https://fontawesome.com/)                                                    | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)                                 |

## Development

Clone this repository from GitHub and create a symlink to `./Sources/com.colinodell.mutesync.sdPlugin` to your plugin folder:

 - macOS: `~/Library/Application Support/com.elgato.StreamDeck/Plugins/`
 - Windows: `%appdata%\Elgato\StreamDeck\Plugins\`

On macOS you can also run `make` to build the plugin.
