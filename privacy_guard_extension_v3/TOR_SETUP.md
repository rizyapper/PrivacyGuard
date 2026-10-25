# Optional Tor routing (free)

Privacy Guard v0.3 adds a toggle for a **local Tor SOCKS5 proxy**. It does not bundle Tor, and the toggle alone does not establish a Tor circuit. Tor must be installed and running locally.

## macOS setup

1. Install Homebrew if you do not already have it: https://brew.sh/ (free).
2. In Terminal, run: `brew install tor`
3. Start Tor in a Terminal window: `tor` (leave it running). The default SOCKS listener is usually `127.0.0.1:9050`.
4. In Chromium, open `chrome://extensions`, remove/disable the previous Privacy Guard version, and load this extracted folder using **Load unpacked**.
5. Open the extension popup and click **ENABLE TOR ROUTING**.
6. Verify using https://check.torproject.org/ . If it says you are not using Tor, disable the toggle and check that Tor is running on port 9050.
7. Click **DISABLE TOR ROUTING** to restore the browser's default proxy configuration.

## Important limitations

- Free to use; no VPN subscription or paid API is required.
- This is a basic integration with a local Tor SOCKS proxy, not a complete Tor Browser replacement.
- Do not rely on it for high-risk anonymity. Browser fingerprinting, WebRTC, DNS/proxy behavior, extensions, account logins, and application-specific traffic can affect privacy. Use the official Tor Browser for sensitive use.
- The extension changes the browser's regular proxy setting. Other extensions or managed-device policies may override it.
- Panic Button and GDPR code are preserved from the previous build; `gdpr.js` is copied without modification.
