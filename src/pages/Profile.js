import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

function ProfileScreen() {
  const [name, setName] = useState('');
  const [DOB, setDOB] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');
  const token  = useLocation().state.token;
  const url = useLocation().state.url
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:5001/symptoms_server');
        setData(result.data.url);
      } catch (error) {
        console.error('Fetch Error:', error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProtectedContent = async () => {
      try {
        const response = await axios.get(`${url}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.first_name);
        setDOB(response.data.DOB);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProtectedContent();
  }, [token, url]);

  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileContainer}>
        <img src={profilePicUrl} style={styles.profilePic} alt="User Image" />
        <div style={styles.profileInfo}>
          <p style={styles.title}>{name}</p>
          <p>{DOB}</p>
          <p style={styles.subtitle}>Other Identifying Info</p>
        </div>
      </div>
      <div style={styles.history}>
        <p style={styles.historyText}>Patient Event History</p>
      </div>
      <div>
        <Link to="/symptom" state={{ token: token, url: data }}>
          <button style={styles.button}>Symptom Input Form</button>
        </Link>
        <button style={styles.button} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default ProfileScreen;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    minHeight: '100vh',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -50,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
  },
  history: {
    width: '100%',
    height: 400,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4d87bf',
    width: '90%',
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
  },
};
