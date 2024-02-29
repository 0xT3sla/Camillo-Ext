document.addEventListener('DOMContentLoaded', function () {
    var fetchButton = document.getElementById('fetchButton');
    var resultDiv = document.getElementById('result');
    var initialParagraph = document.getElementById('initialParagraph');
    var loadingDots = document.querySelector('.loading-dots');

    fetchButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentUrl = tabs[0].url;
            initialParagraph.style.display = 'none'; // Hide initial paragraph
            loadingDots.style.opacity = '1'; // Make loading dots visible by setting opacity to 100%
            loadingDots.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>'; // Adding loading dots HTML

            chrome.runtime.sendMessage({ url: currentUrl }, function (response) {
                loadingDots.style.opacity = '0'; // Hide loading dots by setting opacity to 0%

                if (response.error) {
                    resultDiv.innerHTML = '<p style="color:#DC143C;"> Error:</p> ' + response.error;
                } else {
                    var details = response.details;
                    var lines = details.split('\n');

                    // Apply different styling to the first line
                    var firstLine = '<p style="color: ' + (lines[0].includes('suspicious') ? '#DC143C' : '#95e800') + '; font-weight: bold;font-size:30px;">' + lines[0] + '</p>';
                    resultDiv.innerHTML += firstLine;

                    // Add remaining lines with styling
                    for (var i = 1; i < lines.length; i++) {
                        if (lines[i].includes('Trust Score:')) {
                            var trustScoreValue = lines[i].split(':')[1].trim();
                            resultDiv.innerHTML += '<p><span class="label" style="color: white;font-size:20px;font-weight:normal;">Trust Score: </span> <span class="value model-score" style="color:#95e800;font-size:20px;font-weight:bold;">' + trustScoreValue + '/100</span></p>';
                        } else if(lines[i].includes('Suspicion Score:')) {
                            var modelScoreValue = lines[i].split(':')[1].trim();
                            resultDiv.innerHTML += '<p><span class="label" style="color: white;font-size:20px;font-weight:normal;">Suspicion Score: </span> <span class="value model-score" style="color:#DC143C;font-size:20px;font-weight:bold;">' + modelScoreValue + '/100</span></p>';
                        } else {
                            resultDiv.innerHTML += '<p>' + lines[i] + '</p>';
                        }
                    }
                }
            });
        });
    });
});
