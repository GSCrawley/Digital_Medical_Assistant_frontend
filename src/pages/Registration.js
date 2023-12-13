import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function RegistrationScreen() {
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [DOBInput, setDOBInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  let url = useLocation().state.url;
  const navigate = useNavigate();

  const handleRegistration = async () => {
    const firstName = firstNameInput;
    const lastName = lastNameInput;
    const username = usernameInput;
    const password = passwordInput;
    const email = emailInput;
    const DOB = DOBInput;
    const location = locationInput;

    const response = await axios.post(
      `${url}/register`,
      {
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
        email: email,
        DOB: DOB,
        location: location,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    navigate('/login', { state: { url: url } });
  };
  const goBack = () => {
    navigate(-1)
  }

  return (
    <div style={styles.container}>
        <button onMouseDown={goBack}>Back</button>
      <h1 style={styles.title}>Registration Screen</h1>
      <p>{url}</p>
      <input
        style={styles.input}
        placeholder="First Name"
        value={firstNameInput}
        type="text"
        onChange={(e) => setFirstNameInput(e.target.value)}
        autoCapitalize="none"
        autoCorrect="false"
      />
      <input
        style={styles.input}
        placeholder="Last Name"
        value={lastNameInput}
        onChange={(e) => setLastNameInput(e.target.value)}
        autoCapitalize="none"
        autoCorrect="false"
      />
      <input
        style={styles.input}
        placeholder="Username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
        autoCapitalize="none"
        autoCorrect="false"
      />
      <input
        style={styles.input}
        placeholder="Password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        securetextentry="true"
        autoCapitalize="none"
        autoCorrect="false"
      />
      <input
        style={styles.input}
        placeholder="Email"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        autoCapitalize="none"
        autoCorrect="false"
      />
      <input
        style={styles.input}
        placeholder="DOB"
        value={DOBInput}
        onChange={(e) => setDOBInput(e.target.value)}
        autoCapitalize="none"
        autoCorrect="false"
      />
      <input
        style={styles.input}
        placeholder="Location"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
        autoCapitalize="none"
        autoCorrect="false"
      />
      <button style={styles.button} onClick={handleRegistration}>
        <p style={styles.buttonText}>Register</p>
      </button>
    </div>
  );
}

export default RegistrationScreen;

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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#c4c4c4',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#1976d2',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#1976d2',
    fontSize: 16,
  },
};
