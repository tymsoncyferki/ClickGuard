// Function to send HTML content and receive response
function sendHtmlContent() {
    const sourceUrl = window.location.href;
    const htmlContent = document.documentElement.outerHTML;
  
    const endpointUrl = 'https://clickguard.eu.pythonanywhere.com/extract_and_predict'; 
    // const endpointUrl = 'http://127.0.0.1:5000/extract_and_predict'; 
    
    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: sourceUrl,
        html: htmlContent
      })
    })
    .then(response => response.json())
    .then(data => {
      chrome.runtime.sendMessage({ action: 'sendContent', content: data.prediction });
    })
    .catch(error => {
      chrome.runtime.sendMessage({ action: 'sendContent', content: 'An error occurred' });
    });
  }
  
sendHtmlContent();
  