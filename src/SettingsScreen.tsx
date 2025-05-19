import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store";
import { setApiKey } from "./chatSlice";

export function SettingsScreen() {
  const apiKeyInput = useSelector(
    (state: RootState) => (state.chat as import("./chatSlice").ChatState).apiKey
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      dispatch(setApiKey(apiKeyInput));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="settings-container padding-xl margin-x-auto">
      <h2>Settings</h2>

      <div className="settings-section padding-xl margin-xl">
        <h3>API Configuration</h3>
        <div className="settings-field margin-md">
          <label style={{ display: "block" }} className="margin-sm">
            OpenAI API Key
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => dispatch(setApiKey(e.target.value))}
              className="inputField padding-md"
              placeholder="Enter your API key"
              style={{ flex: 1 }}
            />
            <button onClick={handleSaveApiKey} className="sendButton padding-x-xl">
              Save API Key
            </button>
          </div>
          {saveSuccess && (
            <span className="success-message margin-md">
              API key saved successfully!
            </span>
          )}
        </div>
      </div>

      <div className="settings-section padding-xl margin-xl">
        <p>
          Your API key is stored in your browser's localStorage and is only sent
          directly to the API service.
        </p>
      </div>
    </div>
  );
}
