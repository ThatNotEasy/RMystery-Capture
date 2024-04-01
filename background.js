const tabIDs = {};
const textDecoder = new TextDecoder();

function requestToClipboard(tabId) {
    chrome.tabs.get(tabId, (details) => {
        const lic_headers = tabIDs[details.id].license_request[0]?.license_headers;
        const lic_url = tabIDs[details.id].license_url;
        const lic_data_json = tabIDs[details.id].license_data;
        const mpd_link = tabIDs[details.id].mpd_url;
        if (!lic_headers) return;

        const ip_retrieve_link = "https://ipinfo.io/ip";

        var get_ip = new XMLHttpRequest();
        get_ip.open('GET', ip_retrieve_link, true);
        get_ip.onload = function () {
            var ip_response = this.responseText;

            var i = 0;
            let curl_license_data = "curl ";
            curl_license_data += `'${lic_url}' \\`;
            for (; i < lic_headers.length; ++i)
                curl_license_data += `\n  -H '${lic_headers[i].name.toLowerCase()}: ${lic_headers[i].value}' \\`;
            curl_license_data += `\n  -H 'x-forwarded-for: ${ip_response}' \\`;
            curl_license_data += "\n  --data-raw ";

            if (lic_data_json.includes("u0008")) {
                curl_license_data += `${lic_data_json} \\`;
            } else {
                curl_license_data += `'${lic_data_json}' \\`;
            }

            curl_license_data += "\n  --compressed";

            let python_license_data = "import requests\n\n";
            python_license_data += `url = '${lic_url}'\n`;
            python_license_data += "headers = {\n";
            for (let j = 0; j < lic_headers.length; j++)
                python_license_data += `    '${lic_headers[j].name.toLowerCase()}': '${lic_headers[j].value}',\n`;
            python_license_data += `    'x-forwarded-for': '${ip_response}'\n}\n\n`;
            python_license_data += `data = '${lic_data_json}'\n\n`;
            python_license_data += "response = requests.post(url, headers=headers, data=data)\n";
            python_license_data += "print(response.text)";

            const license_gen_link = "https://drm-bot.herokuapp.com/gen.php";
            var data = new FormData();
            data.append('playlist', curl_license_data);
            data.append('api', 'api');

            var gen_link = new XMLHttpRequest();
            gen_link.open('POST', license_gen_link, true);
            gen_link.onload = function () {
                var gen_link_response = this.responseText;
                let json_resp = JSON.parse(gen_link_response);
                let generated_license_link = json_resp.data;

                const popupWidth = 1000;
                const popupHeight = 700;
                const popupWindow = window.open('', '_blank', `width=${popupWidth},height=${popupHeight}`);
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
										<textarea class="popup-textarea curl-command">${curl_license_data}</textarea>
									</div>
									<div class="table-cell">
										<div class="section-title" style="color: red;">PYTHON REQUESTS:</div>
										<textarea class="popup-textarea python-command">${python_license_data}</textarea>
									</div>
								</div>
								<div class="table-row">
									<div class="table-cell">
										<div class="section-title" style="color: red;">MPD URL:</div>
										<textarea class="popup-textarea mpd-url">${mpd_link}</textarea>
									</div>
									<div class="table-cell">
										<div class="section-title" style="color: red;">License Generated Link:</div>
										<textarea class="popup-textarea pssh">${generated_license_link}</textarea>
									</div>
								</div>
							</div>
							<button class="popup-button" id="copy-button">Copy to Clipboard</button>
						</div>
						<script>
							// Add event listener to copy button
							document.getElementById('copy-button').addEventListener('click', () => {
								// Copy message to clipboard
								const copyText = \`
								CURL Command:
								${curl_license_data}

								Python Requests:
								${python_license_data}

								MPD URL:
								${mpd_link}

								PSSH:
								${generated_license_link}
								\`;
								navigator.clipboard.writeText(copyText)
									.then(() => {
										alert('Copied to clipboard');
									})
									.catch((err) => {
										console.error('Failed to copy: ', err);
									});
							});
						</script>
					</body>
					</html>
                `);
                popupWindow.document.close();
            }
            gen_link.send(data);
        }
        get_ip.send();
    });
}

function getLicenseRequestData(details) {
    tabIDs[details.tabId] = tabIDs[details.tabId] || {};
    if (details.url.includes(".mpd") || details.url.includes(".ism") || details.url.includes("manifest")) {
        tabIDs[details.tabId].mpd_url = details.url;
    } else if (details.requestBody && details.requestBody.raw && details.method == "POST") {
        for (let j = 0; j < details.requestBody.raw.length; ++j) {
            try {
                const decodedString = textDecoder.decode(details.requestBody.raw[j].bytes);
                const encodedString = btoa(unescape(encodeURIComponent(decodedString)));

                if (encodedString.includes("CAES")) {
                    tabIDs[details.tabId] = { license_data: `$'\\u0008\\u0004'`, license_request: [], license_url: details.url, req_id: details.requestId, mpd_url: tabIDs[details.tabId].mpd_url ?? "" };
                } else if (decodedString.includes("CAES") || details.url.includes("license") && decodedString.includes("token") && decodedString.length > 4000 || decodedString.includes("8,1,18")) {
                    tabIDs[details.tabId] = { license_data: decodedString, license_request: [], license_url: details.url, req_id: details.requestId, mpd_url: tabIDs[details.tabId].mpd_url ?? "" };
                }
            } catch (e) {
                console.error(e);
            }
        }
    } else if (details.requestBody && details.requestBody.formData && details.method == "POST") {
        try {
            if (details.requestBody.formData.widevine2Challenge) {
                const challenge = String(details.requestBody.formData.widevine2Challenge)
                if (challenge.includes("CAES")) {
                    const decodedString = `widevine2Challenge=${challenge}&includeHdcpTestKeyInLicense=true`;
                    tabIDs[details.tabId] = { license_data: decodedString, license_request: [], license_url: details.url, req_id: details.requestId, mpd_url: tabIDs[details.tabId].mpd_url ?? "" };
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    getLicenseRequestData,
    { urls: ["<all_urls>"], types: ["xmlhttprequest"] },
    ["requestBody"]
);

function getLicenseRequestHeaders(details) {
    if (details.method == "POST" && tabIDs[details.tabId] && tabIDs[details.tabId].license_url === details.url && tabIDs[details.tabId].req_id === details.requestId) {
        tabIDs[details.tabId].license_request.push({ license_headers: details.requestHeaders });
        requestToClipboard(details.tabId);

        if (details.url.includes("api2.hbogoasia.com/onwards-widevine") || details.requestHeaders.includes("prepladder.com") || details.url.includes("scvm1sc0.anycast.nagra.com") || details.url.includes("wvls/contentlicenseservice/v1/licenses") || details.url.includes("license.vdocipher.com/auth")) {
            return { cancel: true };
        }
    }
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    getLicenseRequestHeaders,
    { urls: ["<all_urls>"], types: ["xmlhttprequest"] },
    ["requestHeaders", "blocking", "extraHeaders"]
);
