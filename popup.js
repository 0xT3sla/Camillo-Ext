document.addEventListener('DOMContentLoaded', function () {
    var fetchButton = document.getElementById('fetchButton');
    var resultDiv = document.getElementById('result');

    fetchButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentUrl = tabs[0].url;
            resultDiv.innerHTML = 'Sending URL...';

            chrome.runtime.sendMessage({ url: currentUrl }, function (response) {
                resultDiv.innerHTML = '';

                if (response.error) {
                    resultDiv.innerHTML = 'Error: ' + response.error;
                } else {
                    var details = response.details;
                    var lines = details.split('\n');

                    // Apply different styling to the first line
                    var firstLine = '<p style="color: ' + (lines[0].includes('suspicious') ? 'red' : 'green') + '; font-weight: bold;">' + lines[0] + '</p>';
                    resultDiv.innerHTML += firstLine;

                    // Add remaining lines with styling
                    for (var i = 1; i < lines.length; i++) {
                        if (lines[i].includes('Trust Score:')) {
                            var trustScoreValue = lines[i].split(':')[1].trim();
                            resultDiv.innerHTML += '<p><span class="label" style="color: white;">Trust Score:</span> <span class="value model-score" style="color: #7d2ae8;">' + trustScoreValue + '</span></p>';
                        } else if (lines[i].includes('Model Prediction Score:')) {
                            var modelScoreValue = lines[i].split(':')[1].trim();
                            resultDiv.innerHTML += '<p><span class="label" style="color: white;">Model Prediction Score:</span> <span class="value model-score" style="color: #7d2ae8;">' + modelScoreValue + '</span></p>';
                        } else {
                            resultDiv.innerHTML += '<p>' + lines[i] + '</p>';
                        }
                    }
                }
            });
        });
    });
});
