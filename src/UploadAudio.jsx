import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import HeartbeatWave from "./HeartbeatWave";
import "./UploadAudio.css";

const UploadAudio = ({ onNewTranscription }) => {
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [user, setUser] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // Get user info (auth already verified by ProtectedRoute)
  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Failed to get user info:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioFile = new File([audioBlob], "recording.wav", {
          type: "audio/wav",
        });
        await sendAudio(audioFile);
        setRecording(false);
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setRecording(true);

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone access denied");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const sendAudio = async (file) => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("audio", file);
      
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await axios.post("https://speech-to-text-backend-1-p6cw.onrender.com/upload", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${session?.access_token}`
        },
      });
      
      onNewTranscription(res.data);
      
      // Show success message
      showSuccessMessage();
    } catch (err) {
      console.error(err);
      
      // Check if it's an auth error
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login', { 
          state: { message: 'Session expired. Please login again.' } 
        });
      } else {
        alert("Upload failed: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = () => {
    const successEl = document.createElement('div');
    successEl.className = 'upload-success-toast';
    successEl.innerHTML = '✓ Audio uploaded successfully!';
    document.body.appendChild(successEl);
    
    setTimeout(() => {
      successEl.classList.add('fade-out');
      setTimeout(() => successEl.remove(), 300);
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <div className="user-badge">
          <span className="user-icon">👤</span>
          <span className="user-email">{user?.email}</span>
        </div>

        <h2 className="heading">🎵 Audio Transcription</h2>
        <p className="subheading">Upload an audio file or record directly</p>
        
        <input 
          type="file" 
          accept="audio/*" 
          onChange={(e) => sendAudio(e.target.files[0])}
          className="file-input"
          disabled={recording || loading}
        />
        
        <div className="record-buttons">
          <button 
            className={`btn-start${recording ? ' active' : ''}${loading ? ' btn-disabled' : ''}`}
            onClick={startRecording} 
            disabled={recording || loading}
          >
            <span className="btn-content">
              {recording ? (
                <>
                  <span className="recording-dot"></span>
                  Recording...
                  <HeartbeatWave active={recording} />
                </>
              ) : (
                <>🎤 Start Recording</>
              )}
            </span>
          </button>
          
          <button 
            className={`btn-stop${recording ? ' active' : ' btn-disabled'}`}
            onClick={stopRecording} 
            disabled={!recording}
          >
            <span className="btn-content">
              ⏹ Stop Recording
            </span>
          </button>
        </div>

        {recording && (
          <div className="recording-status">
            <div className="recording-info">
              <span className="pulsing-circle"></span>
              <span className="recording-text">Recording in progress</span>
              <span className="timer">{formatTime(recordingTime)}</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Processing audio...</span>
            <HeartbeatWave active={loading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadAudio;