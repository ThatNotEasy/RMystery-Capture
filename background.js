const tabData = {};
let popupShown = false;

// Function to display popup with cURL command, Python command, MPD URL, and PSSH
function displayPopup(curlCommand, pythonCommand, mpdUrl, pssh) {
    if (popupShown) return; // Only show popup once
    popupShown = true;

    const popupMessage = `CURL REQUESTS:\n\n${curlCommand}\n\n================================================================================\n\nPY REQUESTS:\n\n${pythonCommand}\n\n================================================================================\n\nMPD URL:\n\n${mpdUrl}\n\n================================================================================\n\nPSSH:\n\n${pssh}`;

    // Create a new window for the popup
    const popupWindow = window.open('', '_blank', 'width=1000,height=1000');
    popupWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="shortcut icon" href="icons/icon.png" type="image/x-icon">
                <title>L33T.MY</title>
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-image: url("icons/w00t.gif");
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-attachment: fixed; /* Ensure the background image stays fixed while scrolling */
                        margin: 0; /* Remove default margin to fill entire screen */
                        padding: 0; /* Remove default padding */
                    }

                    .box {
                        width: 90%;
                        max-width: 800px;
                        padding: 15px;
                        border: 2px solid black;
                        margin: 20px auto 0 auto;
                    }

                    .popup-title {
                        font-size: 20px;
                        margin-bottom: 10px;
                    }

                    .popup-textarea {
                        width: calc(100% - 30px);
                        height: 300px; /* Increased height for better display */
                        margin-bottom: 10px;
                        resize: none;
                        overflow: auto;
                        background-color: transparent;
                        border: 1px solid white;
                        outline: none;
                        padding: 5px;
                        box-sizing: border-box;
                        font-family: monospace; /* Use monospace font for better readability */
                        font-size: 13px;
                        color: white; /* Set text color to white */
                    }

                    .popup-button {
                        background-color: transparent;
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        cursor: pointer;
                    }

                    .popup-button:hover {
                        background-color: rgba(255, 255, 255, 0.2);
                    }

                    .table-container {
                        display: table;
                        width: 100%;
                    }

                    .table-row {
                        display: table-row;
                    }

                    .table-cell {
                        display: table-cell;
                        vertical-align: top;
                        padding: 15px; /* Increased padding for better spacing */
                    }

                    .section-title {
                        font-size: 16px;
                        margin-bottom: 5px;
                        color: white; /* Set text color to white */
                    }

                    .curl-command {
                        color: white; /* Set color to orange for cURL requests */
                    }

                    .python-command {
                        color: white; /* Set color to gold for Python requests */
                    }

                    .mpd-url {
                        color: white; /* Set color to cyan for MPD URL */
                    }

                    .pssh {
                        color: white; /* Set color to magenta for PSSH */
                    }
                </style>
            </head>
            <body>
                <div class="box">
                    <div class="popup-title">SSUP BITCH</div>
                    <div class="table-container">
                        <div class="table-row">
                            <div class="table-cell">
                                <div class="section-title" style="color: red;">CURL REQUESTS:</div>
                                <textarea class="popup-textarea curl-command">${curlCommand}</textarea>
                            </div>
                            <div class="table-cell">
                                <div class="section-title" style="color: red;">PYTHON REQUESTS:</div>
                                <textarea class="popup-textarea python-command">${pythonCommand}</textarea>
                            </div>
                        </div>
                        <div class="table-row">
                            <div class="table-cell">
                                <div class="section-title" style="color: red;">MPD URL:</div>
                                <textarea class="popup-textarea mpd-url">${mpdUrl}</textarea>
                            </div>
                            <div class="table-cell">
                                <div class="section-title" style="color: red;">PSSH:</div>
                                <textarea class="popup-textarea pssh">${pssh}</textarea>
                            </div>
                        </div>
                    </div>
                    <button class="popup-button" id="copy-button">Copy to Clipboard</button>
                </div>
                <script>
                    // Add event listener to copy button
                    document.getElementById('copy-button').addEventListener('click', () => {
                        // Copy message to clipboard
                        const copyText = '${popupMessage.replace(/'/g, "\\'")}'; // Escape single quotes
                        const tempInput = document.createElement('textarea');
                        tempInput.value = copyText;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
                        alert('The commands have been copied to clipboard.');
                    });
                </script>
            </body>
            </html>
            `);
    popupWindow.document.close(); // Close the document stream to enable document content loading
}

// Function to handle license request
function handleLicenseRequest(tabId) {
    const tabDetails = tabData[tabId];
    const { license_request, license_url, license_data, mpd_url, pssh } = tabDetails;

    if (!license_request) return;

    const ipRetrieveLink = 'https://ipinfo.io/ip';
    fetch(ipRetrieveLink)
        .then(response => response.text())
        .then(ipResponse => {
            // Build cURL command
            let curlLicenseData = `curl '${license_url}' \\`;
            for (const header of license_request.license_headers) {
                curlLicenseData += `\n  -H '${header.name.toLowerCase()}: ${header.value}' \\`;
            }
            curlLicenseData += `\n  -H 'x-forwarded-for: ${ipResponse}' \\`;
            curlLicenseData += `\n  --data-raw ${license_data.includes('u0008') ? license_data : `'${license_data}'`} \\`;
            curlLicenseData += '\n  --compressed';

            // Build Python command
            let pythonLicenseData = `import requests\n\nurl = '${license_url}'\nheaders = {\n`;
            for (const header of license_request.license_headers) {
                pythonLicenseData += `    '${header.name.toLowerCase()}': '${header.value}',\n`;
            }
            pythonLicenseData += `    'x-forwarded-for': '${ipResponse}'\n}\n\nresponse = requests.post(url, headers=headers, data='${license_data}', verify=False)\nprint(response.text)`;

            // Display popup with cURL command, Python command, MPD URL, and PSSH
            displayPopup(curlLicenseData, pythonLicenseData, mpd_url, pssh);
        })
        .catch(error => console.error('Error handling license request:', error));
}

// Function to handle license request data
function handleLicenseRequestData(details) {
    const tabId = details.tabId;
    if (!tabData[tabId]) tabData[tabId] = {};

    const { url, requestBody, method } = details;
    const { raw, formData } = requestBody || {};

    if (url.includes('.mpd') || url.includes('.ism') || url.includes('manifest')) {
        tabData[tabId].mpd_url = url;
    } else if (method === 'POST') {
        let licenseData;
        if (raw) {
            for (const item of raw) {
                try {
                    const decodedString = new TextDecoder().decode(item.bytes);
                    if (decodedString.includes('CAES')) {
                        licenseData = `$'\\u0008\\u0004'`;
                    } else if (
                        decodedString.includes('CAES') ||
                        (url.includes('license') &&
                            decodedString.includes('token') &&
                            decodedString.length > 4000) ||
                        decodedString.includes('8,1,18')
                    ) {
                        licenseData = decodedString;
                    }
                } catch (error) {
                    console.error('Error decoding raw data:', error);
                }
            }
        } else if (formData && formData.widevine2Challenge) {
            const challenge = String(formData.widevine2Challenge);
            if (challenge.includes('CAES')) {
                licenseData = `widevine2Challenge=${challenge}&includeHdcpTestKeyInLicense=true`;
            }
        }

        if (licenseData) {
            tabData[tabId] = {
                license_data: licenseData,
                license_request: {},
                license_url: url,
                req_id: details.requestId,
                mpd_url: tabData[tabId].mpd_url || '',
                pssh: '',
            };
        }
    }
}

// Function to handle license request headers
function handleLicenseRequestHeaders(details) {
    const tabId = details.tabId;
    if (!tabData[tabId]) return;

    const { method, url, requestId } = details;
    const { license_url, req_id, pssh } = tabData[tabId]; // Ambil nilai pssh dari tabData

    if (method === 'POST' && license_url === url && req_id === requestId) {
        const licenseHeaders = details.requestHeaders;
        tabData[tabId].license_request = { license_headers: licenseHeaders };
        handleLicenseRequest(tabId);

        // Block requests with one-time tokens in headers or payload
        const urlsToBlock = [
            'tv-ps.amazon.com/cdp/catalog/GetPlaybackResources',
            'api2.hbogoasia.com/onwards-widevine',
            'prepladder.com',
            'scvm1sc0.anycast.nagra.com',
            'wvls/contentlicenseservice/v1/licenses',
            'license.vdocipher.com/auth',
        ];
        if (urlsToBlock.some(urlToBlock => url.includes(urlToBlock))) {
            return { cancel: true };
        }
    }
}

// Register listeners
chrome.webRequest.onBeforeRequest.addListener(
    handleLicenseRequestData,
    { urls: ['<all_urls>'], types: ['xmlhttprequest'] },
    ['requestBody']
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    handleLicenseRequestHeaders,
    { urls: ['<all_urls>'], types: ['xmlhttprequest'] },
    ['requestHeaders', 'blocking', 'extraHeaders']
);

// Add the following code to your content script
(async () => {
    const b64 = {
        decode: s => Uint8Array.from(atob(s), c => c.charCodeAt(0)),
        encode: b => btoa(String.fromCharCode(...new Uint8Array(b))),
    };

    const fnproxy = (object, func) => new Proxy(object, { apply: func });

    const proxy = (object, key, func) =>
        Object.defineProperty(object, key, {
            value: fnproxy(object[key], func),
        });

    proxy(MediaKeySession.prototype, 'generateRequest', async (_target, _this, _args) => {
        const [initDataType, initData] = _args;
        const pssh = b64.encode(initData);
        console.groupCollapsed(`PSSH: ${b64.encode(initData)}`);
        console.trace();
        console.groupEnd();
        if (pssh) {
            window.postMessage(
                { type: '38405bbb-36ef-454d-8b32-346f9564c978', log: pssh },
                '*'
            );

            // Get MPD URL from tabData
            const tabId = details.tabId;
            const mpdUrl = tabData[tabId].mpd_url || '';

            // Generate Python command
            let pythonCommand = `import requests\n\nurl = '${license_url}'\nheaders = {\n`;
            for (const header of license_request.license_headers) {
                pythonCommand += `    '${header.name.toLowerCase()}': '${header.value}',\n`;
            }
            pythonCommand += `    'x-forwarded-for': '${ipResponse}'\n}\n\nresponse = requests.post(url, headers=headers, data='${license_data}', verify=False)\nprint(response.text)`;

            // Display popup with cURL command, Python command, MPD URL, and PSSH
            displayPopup(curlLicenseData, pythonCommand, mpdUrl, pssh);
        }
        return _target.apply(_this, _args);
    });
})();
