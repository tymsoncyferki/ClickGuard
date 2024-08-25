// Function to send HTML content and receive response
function sendHtmlContent() {
    const sourceUrl = window.location.href;
    const htmlContent = document.documentElement.outerHTML;
  
    const endpointUrl = 'https://clickguard.eu.pythonanywhere.com/predict'; 
  
    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: sourceUrl,
        content: htmlContent
      })
    })
    .then(response => response.json())
    .then(data => {
      console.error('data:', data.content)
      chrome.runtime.sendMessage({ action: 'sendContent', content: data.content });
    })
    .catch(error => {
      console.error('Error:', error);
      chrome.runtime.sendMessage({ action: 'sendContent', content: 'An error occurred' });
    });
  }
  
sendHtmlContent();
  