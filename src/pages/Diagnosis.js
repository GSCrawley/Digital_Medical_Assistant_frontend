import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function DiagnosisScreen() {
  const [text, setText] = useState('');
  const message = useLocation().state.message;
  const [loading, setLoading] = useState(true);
  const token = useLocation().state.token;
  let url = useLocation().state.durl;
  const [apiUrl] = useState(url);
  const navigate = useNavigate();
  // let connectionAttempts = 0;
  // const [hasRenderedOnce, setHasRenderedOnce] = useState(false);

  const profileNav = () => {
    navigate('/profile', token);
  };

  const fetchData = async () => {
    try {
      let symptomsData = message;
      const response = await axios.post(
        `${apiUrl}/disease`,
        { symptomsData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setText(response.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (message) {
      setText(message);
      setLoading(false);
    }
  }, [message]);

  return (
    <div style={styles.container}>
      <button style={styles.profileButton} title="Profile" onClick={profileNav}>
        Profile
      </button>
      <div style={styles.diagnosisContainer}>
        <p style={styles.diagnosisText}>{text}</p>
        <p style={styles.diagnosisText}>{loading}</p>
      </div>
    </div>
  );
}

export default DiagnosisScreen;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    minHeight: '100vh',
  },
  profileButton: {
    backgroundColor: '#4d87bf',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    cursor: 'pointer',
  },
  diagnosisContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    borderRadius: 15,
    width: '90%',
  },
  diagnosisText: {
    fontSize: 18,
  },
};
