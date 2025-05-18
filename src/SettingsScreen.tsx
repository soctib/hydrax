import { useState } from "react";

export function SettingsScreen() {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem("openai_api_key", apiKeyInput);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <div className="settings-section">
        <h3>API Configuration</h3>
        <div className="settings-field">
          <label>OpenAI API Key</label>
          <div style={{ display: "flex" }}>
            <input
              type="password"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              className="inputField"
              placeholder="Enter your API key"
              style={{ flex: 1 }}
            />
            <button
              onClick={handleSaveApiKey}
              className="sendButton"
            >
              Save API Key
            </button>
          </div>
          {saveSuccess && <span className="success-message">API key saved successfully!</span>}
        </div>
      </div>

      <div className="settings-section">
        <p>
          Your API key is stored in your browser's localStorage and is only sent directly to the API service.
        </p>
      </div>
    </div>
  );
}
