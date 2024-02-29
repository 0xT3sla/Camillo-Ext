document.addEventListener('DOMContentLoaded', function () {
    var fetchButton = document.getElementById('fetchButton');
    var resultDiv = document.getElementById('result');

    fetchButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentUrl = tabs[0].url;
            resultDiv.innerText = 'Sending URL...';

            chrome.runtime.sendMessage({ url: currentUrl }, function (response) {
                resultDiv.innerText = '';

                if (response.error) {
                    resultDiv.innerText = 'Error: ' + response.error;
                } else {
                    var details = response.details;
                    resultDiv.innerText = details;
                }
            });
        });
    });
});
