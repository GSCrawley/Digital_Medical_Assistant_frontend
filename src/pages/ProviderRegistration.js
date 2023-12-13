import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function ProviderRegistrationScreen({ route, navigation }) {
    const [nameInput, setNameInput] = useState('');
    const [specialtyInput, setSpecialtyInput] = useState('');
    // const [patients, setPatientsInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [locationInput, setLocationInput] = useState('');
    let url = useLocation().state.url;
    const navigate = useNavigate();
  
    const handleRegistration = async () => {
        const name = nameInput;
        // const username = usernameInput;
        const specialty = specialtyInput;
        const email = emailInput;
        const password = passwordInput;
        // const { url } = route.params;
        const location = locationInput;


        const response = await axios.post(`${url}/provider-register`,{
            name: name,
            specialty: specialty,
            email: email,
            password: password,
            location: location,
        },{
            headers: {
                'Content-Type': 'application/json',
            }
        })
        navigate('/provider-login', { state: {url}});
    };
    const goBack = () => {
        navigate(-1)
    }
  
    return (
      <div style={styles.container}>
        <button onClick={goBack}>Back</button>
        <h1 style={styles.title}>Provider Registration Screen</h1>
        <input
          style={styles.input}
          placeholder="Name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        {/* <TextInput
          style={styles.input}
          placeholder="Username"
          value={usernameInput}
          onChangeText={setUsernameInput}
          autoCapitalize="none"
          autoCorrect={false}
        /> */}
        <input
          style={styles.input}
          placeholder="Email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          securetextentry="true"
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
          placeholder="Specialty"
          value={specialtyInput}
          onChange={(e) => setSpecialtyInput(e.target.value)}
          securetextentry="true"
          autoCapitalize="none"
          autoCorrect="false"
        />
        <input
          style={styles.input}
          placeholder="Location"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
        //   secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect="false"
        />
        <button style={styles.button} onClick={handleRegistration}>
          <p style={styles.buttonText}>Register</p>
        </button>
      </div>
    );
  }

  export default ProviderRegistrationScreen

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