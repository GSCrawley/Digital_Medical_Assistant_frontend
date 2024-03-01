import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProviderLoginScreen() {
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    let  url  = useLocation().state.url;
    const [connectionAttempts, setConnectionAttempts] = useState(0);
    const navigate = useNavigate()

    const handleLogin = async () => {
        try{
            const response = await axios.post(`${url}/provider-login`,{
            // const response = await axios.post(`http://localhost:6000/login`,{
                email: emailInput,
                password: passwordInput,
            });
            const token = response.data.access_token;
            navigate('/provider-profile', {state: {token, url}});

          } catch (error) {
            if (error.response) {
              // Invalid login error (server responded with an error status code)
              const statusCode = error.response.status;
              if (statusCode === 401) {
                alert('Error', 'Invalid email or password');
              } else {
                alert('Error', 'An error occurred during login.');
              }
            } else if (error.request && connectionAttempts <= 5) {
              // Network error (request was made but no response received)
              const fetchData = async () => {
                const result = await axios.get('http://localhost:8010');
                url = result.data.url;
                setConnectionAttempts(connectionAttempts + 1);
                handleLogin()
              };
              fetchData();
              // console.error('Network error:', error.request);
              // Alert.alert('Error', 'Network error. Please check your connection.');
            } else {
              // Other errors
              console.error('Error:', error.message);
              alert('Error', 'An unexpected error occurred.');
            }
          }
    };

    const goBack = () => {
        navigate(-1)
    }
  
    return (
      <div style={styles.container}>
        <button onClick={goBack}>Back</button>
        <h1 style={styles.title}>Provider Login Screen</h1>
        <p>{url}</p>
        <input
          style={styles.input}
          placeholder="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
        {/* <button style={styles.button} onClick={() => navigate('Registration', {url})}>
          Don't have an account? Register here
        </button> */}
        <button style={styles.button} onClick={() => navigate('/provider-registration', { state: {url: url}})}>
          Care Provider Registration
        </button>
      </div>
    );
  }

export default ProviderLoginScreen;

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
        minHeight: '100vh',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#c4c4c4',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button:{
        backgroundColor: '#4d87bf',
        width: '100%',
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
    buttonText:{
      fontSize:18,
      fontWeight:'bold',
      color:'white',
    },
    link: {
      color: '#1976d2',
      fontSize: 16,
    },
  };