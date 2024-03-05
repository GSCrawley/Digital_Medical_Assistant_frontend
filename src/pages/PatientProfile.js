import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import GraphVisualization from '../visuals/graphTest';
import EventVisualization from '../visuals/eventGraph';

function PatientProfileScreen() {
  const [name, setName] = useState('');
  const [DOB, setDOB] = useState('');
  const token = useLocation().state.token;
  const inputValue = useLocation().state.inputValue;
  var url  = useLocation().state.url;
  const [profilePicUrl, setProfilePicUrl] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');
  var connectionAttempts = 0
  const [data, setData] = useState(null);
  const [events, setEvents] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:8010/symptoms_server');
      // const result = await axios.get('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/symptoms_server');
      setData(result.data.url);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProtectedContent = async () => {
      try {
        const response = await axios.post(`${url}/patient-profile`, {
            patient_id: inputValue,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });          
        // setContent(response.data.message);
      
        setName(response.data.first_name)
        setDOB(response.data.DOB)
        setEvents(response.data.events)
      } catch (error) {
        console.error(error);
        if (error.request && connectionAttempts <= 5) {
          // Network error (request was made but no response received)
          const fetchData = async () => {
            // const result = await axios.get('http://localhost:8010/symptoms_server');
            const result = await axios.get('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/symptoms_server');
            url = result.data.url;
            connectionAttempts = connectionAttempts + 1
            fetchProtectedContent();
          };
          fetchData();
          // console.error('Network error:', error.request);
          // Alert.alert('Error', 'Network error. Please check your connection.');
        } else {
          // Other errors
          console.error('Error:', error.message);
          alert('Error', 'An unexpected error occurred.');
        }
        // Alert.alert('Error', 'Failed to fetch protected content');
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
    //   navigation.navigate('Symptoms', {token});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <p>{url}</p>
      <div style={styles.profileContainer}>
        <img src={profilePicUrl} style={styles.profilePic} alt="User Image"/>
        <div style={styles.profileInfo}>
          <p style={styles.title}>{name}</p>
          <p style={styles.subtitle}>{DOB}</p>
          <p style={styles.subtitle}>Other Identifying Info</p>
        </div>
      </div>
      <p style={styles.historyText}>Patient Associative Memory</p>
      <div style={styles.history}>
        <GraphVisualization url={url} inputValue={inputValue} token={token}/>
        {/* {events && (
        <div>
          {Object.entries(events).reverse().map(([timestamp, eventId]) => (
            <div key={timestamp}>
              <p>{timestamp}</p>
              <p>{eventId}</p>
            </div>
          ))}
        </div>
        )} */}
      </div>
      <br></br>
      <p style={styles.historyText}>Patient Event History</p>
      <div style={styles.history}>
        {/* <div>{events[events.length - 1]}</div> */}
        <EventVisualization url={url} inputValue={events} token={token}/>
        {/* {events && (
        <div>
          {Object.entries(events).reverse().map(([timestamp, eventId]) => (
            <div key={timestamp}>
              <p>{timestamp}</p>
              <p>{eventId}</p>
            </div>
          ))}
        </div>
        )} */}
      </div>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => navigate('/care-provider-symptoms', { state: {token, url:data, inputValue}})}
        >
          <p style={styles.buttonText}>Symptom Input Form</p>
        </button>
        <button
          style={styles.button}
          onClick={() => navigate('/risk-factors-input', { state: {token, 'url':url, 'patientID': inputValue}})}
        >
          <p style={styles.buttonText}>Risk Factors Input Form</p>
        </button>
        <button style={styles.button} onClick={handleLogout}>
          <p style={styles.buttonText}>Log out</p>
        </button>
      </div>
    </div>
  );
}



export default PatientProfileScreen

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
    alignItems: 'center',
    marginTop: 20,
  },
  button:{
    backgroundColor:'#4d87bf',
    width: '90%',
    height:60,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10,
},
buttonText:{
    fontSize:18,
    fontWeight:'bold',
    color:'white',
},
};

{/* <Button
        title="Symptom Form"
        onPress={() => navigation.navigate('CareProviderSymptoms', {token, url, inputValue})}
      />
      <Button title="Logout" onPress={handleLogout} /> */}