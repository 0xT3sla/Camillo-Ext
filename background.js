chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    try {
        var apiUrl = 'http://127.0.0.1:6969/api/analyze-url';
        var requestData = {
            method: 'POST',
            body: JSON.stringify({ url: btoa(request.url) }), // Encode URL to base64
            headers: {
                'Content-Type': 'application/json'
            }
        };

        fetch(apiUrl, requestData)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                var result = '';
                if (data.google_verified === 'yes' || data.final_verdict) {
                    result += 'URL seems suspicious\n';
                } else {
                    result += 'URL seems to be safe!\n';
                }
                result += 'Trust Score: ' + data.trust_score + '\n';
                result += 'Model Prediction Score: ' + data.model_score + '\n';

                sendResponse({ details: result });
            })
            .catch(error => {
                sendResponse({ error: 'Failed to analyze URL' });
            });
    } catch (error) {
        sendResponse({ error: error.message });
    }

    return true;
});
