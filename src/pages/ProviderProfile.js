import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProviderProfileScreen() {
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const token = useLocation().state.token;
  var url = useLocation().state.url;
  var connectionAttempts = 0;
  const [profilePicUrl, setProfilePicUrl] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${url}/add-patient`,
        { input: inputValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/patient-profile', { state: { token, url, inputValue } });
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 400) {
          alert('Error: Invalid ID');
        } else {
          alert('Error: An error occurred.');
        }
      } else if (error.request && connectionAttempts <= 5) {
        const fetchData = async () => {
          const result = await axios.get('http://localhost:5001');
          url = result.data.url;
          connectionAttempts = connectionAttempts + 1
          handleSubmit()
        };
        fetchData();
      } else {
        console.error('Error:', error.message);
        alert('Error: An unexpected error occurred.');
      }
    }
    setShowForm(false);
  };

  useEffect(() => {
    const fetchProtectedContent = async () => {
      try {
        const response = await axios.get(`${url}/provider-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProtectedContent();
  }, [token]);

  const [message, setMessage] = useState('');
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/logout', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <p>{url}</p>
      <div style={styles.profileContainer}>
        <img src={profilePicUrl} style={styles.profilePic} alt="Provider" />
        <div style={styles.profileInfo}>
          <p style={styles.title}>{name}</p>
          <p style={styles.subtitle}>Other Identifying Info</p>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleButtonClick}>
          <p style={styles.buttonText}>Select Patient</p>
        </button>
        {showForm && (
          <div style={styles.formContainer}>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter Patient ID"
              style={styles.input}
            />
            <button style={styles.buttonDropdown} onClick={handleSubmit}>
              <p style={styles.buttonText}>Submit</p>
            </button>
          </div>
        )}
        <button style={styles.button} onClick={handleLogout}>
          <p style={styles.buttonText}>Log out</p>
        </button>
      </div>
    </div>
  );
}

export default ProviderProfileScreen;

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
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -50,
  },
  subtitle: {
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
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
  },
  buttonDropdown: {
    backgroundColor: '#4d87bf',
    width: '90%',
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  formContainer: {
    width: '90%',
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#c4c4c4',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
};
