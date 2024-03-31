# RMystery Capture

RMystery Capture is a browser extension designed to capture and analyze network requests, particularly license requests, in web applications or browser-based media players. It intercepts license requests, extracts relevant data, and displays it in a popup window for further analysis or debugging purposes.

## Features

- **Request Capture**: Intercept license requests made by web applications or media players.
- **Data Extraction**: Extract relevant information such as cURL command, Python command, MPD URL, and PSSH (Protection System Specific Header).
- **Popup Window**: Display a popup window with captured data for analysis and debugging.
- **Duplication Prevention**: Ensure that the popup window is only displayed once for each request to avoid duplication.

## Installation

1. Clone the repository:
```
git clone https://github.com/ThatNotEasy/RMystery-Capture.git
```

2. Navigate to the `RMystery-Capture` directory.

3. Load the extension in your browser:
- For Google Chrome:
  1. Open the Extension Management page by navigating to `chrome://extensions`.
  2. Enable Developer Mode by clicking the toggle switch next to "Developer mode".
  3. Click the "Load unpacked" button and select the `RMystery-Capture` directory.

## Usage

1. Once the extension is installed and enabled, it will automatically start capturing license requests in web applications or media players.

2. When a license request is intercepted, a popup window will appear displaying relevant information such as cURL command, Python command, MPD URL, and PSSH.

3. Analyze the captured data in the popup window for debugging purposes.

## Dependencies

- **Chrome Web Request API**: Used for intercepting network requests in the Chrome browser.
- **Bootstrap CSS**: Provides styling for the popup window.
- **Font Awesome**: Provides icons for the user interface elements.

## Contributing

Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests to help improve RMystery Capture.

## Author:
- xMysterious
