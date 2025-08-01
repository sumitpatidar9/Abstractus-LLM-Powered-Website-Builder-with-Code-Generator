import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Dashboard.module.css';
import { useAuth } from '../Auth/AuthContext'; 

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [sessionToDeleteId, setSessionToDeleteId] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [sessionToRename, setSessionToRename] = useState(null);
  const [renameInput, setRenameInput] = useState('');

  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const sessionsRef = useRef(null);

  useEffect(() => {
    const fetchSessions = async () => {
      if (authLoading || !user?._id) {
        if (!authLoading && !user?._id) {
          setError('User not authenticated. Please log in.');
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${backendUrl}/home/sessions`, {
          withCredentials: true,
        });
        setSessions(response.data.data);
      } catch (err) {
        setError('Failed to load sessions. Please ensure the backend is running and accessible.');
        console.error('Session fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [authLoading, user]);

  const handleSessionClick = (sessionId) => {
    navigate(`/chat/${sessionId}`);
  };

  const handleNewChatInitiate = () => {
    setNewChatName('');
    setShowNewChatModal(true);
  };

  const handleCreateNewChat = async () => {
    if (!newChatName.trim()) {
      console.error('Chat name cannot be empty.');
      return;
    }

    setShowNewChatModal(false);
    try {
      const response = await axios.post(
        `${backendUrl}/home/session`,
        { userId: user._id, name: newChatName.trim() },
        { withCredentials: true }
      );
      const sessionId = response.data.sessionId;
      navigate(`/chat/${sessionId}`);
    } catch (err) {
      console.error('Error creating new chat session:', err);
    }
  };

  const handleDeleteSessionInitiate = (sessionId) => {
    setSessionToDeleteId(sessionId);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDeleteSession = async () => {
    setShowDeleteConfirmModal(false);
    if (!sessionToDeleteId) return;

    try {
      await axios.delete(`${backendUrl}/home/session/${sessionToDeleteId}`, {
        withCredentials: true,
      });
      setSessions(sessions.filter((session) => session._id !== sessionToDeleteId));
      setSessionToDeleteId(null);
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const handleRenameSessionInitiate = (session) => {
    setSessionToRename(session);
    setRenameInput(session.name);
    setShowRenameModal(true);
  };

  const handleConfirmRenameSession = async () => {
    if (!sessionToRename || !renameInput.trim()) {
      console.error('New name cannot be empty.');
      return;
    }

    if (renameInput.trim() === sessionToRename.name) {
      setShowRenameModal(false);
      return;
    }

    setShowRenameModal(false);
    try {
      await axios.put(
        `${backendUrl}/home/session/${sessionToRename._id}`,
        { newName: renameInput.trim() },
        { withCredentials: true }
      );
      setSessions((prev) =>
        prev.map((s) =>
          s._id === sessionToRename._id ? { ...s, name: renameInput.trim() } : s
        )
      );
      setSessionToRename(null);
      setRenameInput('');
    } catch (err) {
      console.error('Error renaming chat session:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles['loading-text']}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['error-container']}>
        <div className={styles['error-message']}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles['dashboard-container']}>
      <div className={styles['dashboard-welcome-section']}>
        <div className={styles['dashboard-welcome-content']}>
          <h2 className={styles['welcome-title']}>
            Welcome <span className={styles['user-name']}>
              {user?.firstName} {user?.lastName}
            </span> 👋
          </h2>
          <p className={styles['welcome-message']}>
            Manage your conversations and start new ones with ease.
          </p>
        </div>

        <div className={styles['dashboard-header']}>
          <h1 className={styles['sessions-title']}>Your Chat Sessions</h1>
          <button
            className={styles['new-chat-button']}
            onClick={handleNewChatInitiate}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={styles['button-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>
      </div>

      <div ref={sessionsRef} className={styles['session-list-section']}>
        {sessions.length > 0 ? (
          <div className={styles['session-grid']}>
            {sessions.map((session) => (
              <div key={session._id} className={styles['session-card']}>
                <h2
                  className={styles['session-name']}
                  onClick={() => handleSessionClick(session._id)}
                >
                  {session.name}
                </h2>
                <p className={styles['session-date']}>
                  Created: {new Date(session.createdAt).toLocaleDateString()}
                </p>
                <div className={styles['session-actions']}>
                  <button
                    className={`${styles['session-action-button']} ${styles['rename-button']}`}
                    onClick={() => handleRenameSessionInitiate(session)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles['button-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Rename
                  </button>
                  <button
                    className={`${styles['session-action-button']} ${styles['delete-button']}`}
                    onClick={() => handleDeleteSessionInitiate(session._id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles['button-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles['no-sessions-message']}>
            No sessions found. Start a new chat!
          </p>
        )}
      </div>

      {/* Modals */}
      {showNewChatModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <h3 className={styles['modal-title']}>Create New Chat</h3>
            <input
              type="text"
              className={styles['modal-input']}
              placeholder="Enter chat name"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleCreateNewChat(); }}
            />
            <div className={styles['modal-actions']}>
              <button className={styles['modal-button-cancel']} onClick={() => setShowNewChatModal(false)}>
                Cancel
              </button>
              <button className={styles['modal-button-confirm']} onClick={handleCreateNewChat}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <h3 className={styles['modal-title']}>Confirm Deletion</h3>
            <p className={styles['modal-message']}>Are you sure you want to delete this session? This action cannot be undone.</p>
            <div className={styles['modal-actions']}>
              <button className={styles['modal-button-cancel']} onClick={() => setShowDeleteConfirmModal(false)}>
                Cancel
              </button>
              <button className={`${styles['modal-button-confirm']} ${styles['modal-button-delete']}`} onClick={handleConfirmDeleteSession}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showRenameModal && sessionToRename && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <h3 className={styles['modal-title']}>Rename Chat Session</h3>
            <input
              type="text"
              className={styles['modal-input']}
              placeholder="Enter new name"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleConfirmRenameSession(); }}
            />
            <div className={styles['modal-actions']}>
              <button className={styles['modal-button-cancel']} onClick={() => setShowRenameModal(false)}>
                Cancel
              </button>
              <button className={`${styles['modal-button-confirm']} ${styles['modal-button-rename']}`} onClick={handleConfirmRenameSession}>
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Dashboard };
