const apiKeyInput = document.getElementById('apiKey');
const domainInput = document.getElementById('domain');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const statusEl = document.getElementById('status');

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = 'status show ' + type;
  setTimeout(() => {
    statusEl.className = 'status';
  }, 3000);
}

chrome.storage.sync.get(['apiKey', 'domain'], (result) => {
  if (result.apiKey) apiKeyInput.value = result.apiKey;
  if (result.domain) domainInput.value = result.domain;
});

saveBtn.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim();
  const domain = domainInput.value.trim() || 'https://relurl.com';

  if (apiKey && apiKey.length < 10) {
    showStatus('API key looks too short, please check it', 'error');
    return;
  }

  try {
    if (domain) new URL(domain);
  } catch {
    showStatus('Please enter a valid domain URL', 'error');
    return;
  }

  chrome.storage.sync.set({ apiKey, domain }, () => {
    showStatus('Settings saved successfully!', 'success');
  });
});

clearBtn.addEventListener('click', () => {
  apiKeyInput.value = '';
  domainInput.value = 'https://relurl.com';
  chrome.storage.sync.set({ apiKey: '', domain: 'https://relurl.com' }, () => {
    showStatus('Settings cleared', 'success');
  });
});
