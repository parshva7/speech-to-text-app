import React, { useEffect, useState } from "react";
import "./TranscriptionList.css";
import axios from "axios";

const TranscriptionList = ({ transcriptions: propTranscriptions }) => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propTranscriptions) {
      // If transcriptions prop is provided, use it (homepage)
      setTranscriptions(propTranscriptions);
      setLoading(false);
    } else {
      // Otherwise fetch all transcriptions from backend (history page)
      const fetchTranscriptions = async () => {
        try {
          const response = await axios.get("https://speech-to-text-backend-1-p6cw.onrender.com/transcriptions");
          setTranscriptions(response.data);
        } catch (error) {
          console.error("Error fetching transcriptions:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTranscriptions();
    }
  }, [propTranscriptions]);

  return (
    <div className="transcription-list-container">
      <h3>Transcriptions</h3>

      {loading ? (
        <p className="loading">Loading transcriptions...</p>
      ) : transcriptions.length === 0 ? (
        <p className="no-transcriptions">No transcriptions yet</p>
      ) : (
        transcriptions.map((item, index) => (
          <div className="transcription-item" key={item.id || index}>
            <div className="transcription-number">{index + 1}.</div>
            <div className="transcription-content">
              <h4>File: {item.file_name || "Recording"}</h4>
              <p>
                <strong>Text:</strong> {item.transcript || "(empty)"}
              </p>
              <p className="timestamp">
                🕒 {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TranscriptionList;
