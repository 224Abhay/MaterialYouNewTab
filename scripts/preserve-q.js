(function() {
    'use strict';

    function enforceQParam() {
        let url = new URL(window.location.href);
        if (url.searchParams.has("prompt") && !url.searchParams.has("q")) {
            url.searchParams.set("q", url.searchParams.get("prompt"));
            url.searchParams.delete("prompt");
            // Hard redirect, only if we haven't done it yet
            if (!window.__qRedirectDone) {
                window.__qRedirectDone = true;
                window.location.replace(url.toString());
            }
        }
    }
    

    // Initial enforcement
    enforceQParam();

    // Override history methods (for SPA navigation)
    const origPush = history.pushState;
    history.pushState = function() {
        origPush.apply(this, arguments);
        enforceQParam();
    };
    const origReplace = history.replaceState;
    history.replaceState = function() {
        origReplace.apply(this, arguments);
        enforceQParam();
    };

    // Periodically enforce every 50ms to counter ChatGPT's own rewrites
    setInterval(enforceQParam, 50);
})();
