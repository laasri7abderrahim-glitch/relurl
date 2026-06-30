const API_BASE = 'https://relurl.com/api';

const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const spinner = document.getElementById('spinner');
const resultBox = document.getElementById('resultBox');
const shortUrl = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');
const statusEl = document.getElementById('status');
const mainContent = document.getElementById('mainContent');
const loginPrompt = document.getElementById('loginPrompt');
const loginLink = document.getElementById('loginLink');
const optionsLink = document.getElementById('optionsLink');

let storedApiKey = null;

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = 'status show ' + type;
}

function hideStatus() {
  statusEl.className = 'status';
}

function setLoading(loading) {
  shortenBtn.disabled = loading;
  spinner.classList.toggle('show', loading);
  shortenBtn.textContent = loading ? 'Shortening...' : 'Shorten';
}

function showError(message, detail) {
  let html = message;
  if (detail) html += '<div class="error-detail">' + detail + '</div>';
  statusEl.innerHTML = html;
  statusEl.className = 'status show error';
}

chrome.storage.sync.get(['apiKey'], (result) => {
  if (result.apiKey) {
    storedApiKey = result.apiKey;
  } else {
    mainContent.classList.add('hidden');
    loginPrompt.classList.add('show');
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs && tabs.length > 0 && tabs[0].url) {
    urlInput.value = tabs[0].url;
  }
});

shortenBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    showStatus('Please enter a URL', 'error');
    return;
  }

  try {
    new URL(url);
  } catch {
    showStatus('Please enter a valid URL', 'error');
    return;
  }

  hideStatus();
  setLoading(true);
  resultBox.classList.remove('show');

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (storedApiKey) {
      headers['Authorization'] = 'Bearer ' + storedApiKey;
    }

    const response = await fetch(API_BASE + '/links', {
      method: 'POST',
      headers,
      body: JSON.stringify({ url })
    });

    if (response.status === 401) {
      setLoading(false);
      mainContent.classList.add('hidden');
      loginPrompt.classList.add('show');
      return;
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      setLoading(false);
      showError(
        errData.message || 'Failed to shorten URL',
        'Server returned ' + response.status
      );
      return;
    }

    const data = await response.json();
    setLoading(false);

    const shortLink = data.short_url || data.url || (API_BASE + '/links/' + (data.id || ''));
    shortUrl.textContent = shortLink;
    resultBox.classList.add('show');
    showStatus('URL shortened successfully!', 'success');
  } catch (err) {
    setLoading(false);
    showError('Network error', err.message);
  }
});

copyBtn.addEventListener('click', () => {
  const text = shortUrl.textContent;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
      copyBtn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    showStatus('Failed to copy to clipboard', 'error');
  });
});

optionsLink.addEventListener('click', (e) => {
  e.preventDefault();
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

if (loginLink) {
  loginLink.addEventListener('click', () => {
    chrome.storage.sync.get(['apiKey'], (result) => {
      if (!result.apiKey) {
        chrome.tabs.create({ url: loginLink.href });
      }
    });
  });
}
