(() => {
    "use strict";

    // Check if chrome.runtime.sendMessage is available
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        window.addEventListener("message", (event) => {
            if (event.source != window)
                return;

            if (event.data.type && event.data.type === "38405bbb-36ef-454d-8b32-346f9564c978") {
                if (event.data.log)
                    chrome.runtime.sendMessage(event.data.log);
            }
        }, false);
    } else {
        console.error("chrome.runtime.sendMessage is not available.");
    }

    // Create and append script elements
    function appendScript(src) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = chrome.extension.getURL(src);
        (document.head || document.documentElement).appendChild(script);
    }

    // Load mod.js and logger.js scripts
    appendScript("/eme-logger-mod.js");
})();
