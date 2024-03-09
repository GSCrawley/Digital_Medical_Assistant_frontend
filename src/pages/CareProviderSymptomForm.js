import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

var symptomsLst = [];
function CareProviderSymptomFormScreen() {
  const [symptoms, setSymptoms] = useState([]);
//   const [message, setMessage] = useState([]);
  const token = useLocation().state.token;
  const inputValue = useLocation().state.inputValue;
  var url = useLocation().state.url;
  var connectionAttempts = 0;
  const [durl, setURL] = useState([]);

  const navigate = useNavigate();
  
  const emptyList = () => {
    symptomsLst.length = 0;
  }

  useEffect(() => {
    const fetchURL = async () => {
      try {
        const response = await fetch('http://localhost:8010/disease_server');
        // const response = await fetch('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/disease_server');
        const data = await response.json();
        setURL(data.url); // Once the data is fetched, update the 'url' state with the received URL
      } catch (error) {
        console.error('Error fetching URL:', error);
      }
    };
    fetchURL();
  }, []);
// test
  const handleSymptomFormSend = async () => {
    const symptomsData = symptomsLst;
    try{
        const response = await axios.post(`${url}/care_provider_symptoms`, {inputValue, symptomsData},
        {headers: {Authorization: `Bearer ${token}`}
        });
        // setMessage(response.data);
        navigate('/provider-diagnosis', { state: { message: response.data, url:durl, token, patientID: inputValue}});
        emptyList()
    } catch (error) {
      console.log(error);
      if (error.request && connectionAttempts <= 5) {
        // Network error (request was made but no response received)
        const fetchData = async () => {
          // const result = await axios.get('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/disease_server');
          const result = await axios.get('http://localhost:8010/disease_server');
          url = result.data.url;
          connectionAttempts = connectionAttempts + 1
          handleSymptomFormSend()
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

  const SymptomInputField = () => {
    const [symptom, setSymptom] = useState('');

    const handleAddSymptom = () => {
        symptomsLst.push(symptom);
        setSymptoms([...symptoms, symptom]);
        setSymptom('');
    };
//   const symptomFunctionCombine = () => {
//     handleSymptomFormSend();
//     // emptyList();
//     navigation.navigate('Diagnosis', {message: message});
//   }

    return (
      <div style={styles.inputField}>
        <p>{url}</p>
        <p style={styles.buttonText}>Provider Symptom Form</p>
        {/* <input style={styles.input} value={symptom} onChangeText={text => setSymptom(text)} placeholder='Write a symptom'/> */}
        <input
          style={styles.input}
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          placeholder="Write a symptom"
        />
        <button style={styles.button} onClick={handleAddSymptom}>
          <p>Add Symptom/Sign</p>
        </button>
        <button style={styles.button} onClick={handleSymptomFormSend}>
          <p>Submit</p>
        </button>
      </div>
    )
  }

  const SymptomItem = ({ index, symptom, deleteSymptom }) => (
    <div style={styles.symptomContainer}>
      <div>
        <p>{index}</p>
      </div>
      <div>
        <p style={styles.symptomText}>{symptom}</p>
        <button style={styles.deleteButton} onClick={deleteSymptom}>
          <p>Delete</p>
        </button>
      </div>
    </div>
  );


  const deleteSymptom = (deleteIndex) => {
    symptomsLst.splice(deleteIndex, 1);
    setSymptoms(symptoms.filter((_, index) => index !== deleteIndex));
  };

  return (
    <div style={styles.container}>
        <div>
        {symptoms.map((symptom, index) => (
          <div key={index}>
            <SymptomItem index={index + 1} symptom={symptom} deleteSymptom={() => deleteSymptom(index)} />
          </div>
        ))}
      </div>
    <SymptomInputField />
    </div>
  );
}

export default CareProviderSymptomFormScreen

const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: 20,
      minHeight: '100vh',
    },
    symptomContainer: {
      backgroundColor: 'white',
      borderWidth: '1',
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 15,
      width: '100%',  // Increased width
      marginBottom: 10,
    },
    symptomItem: {
      display: 'flex',
      marginTop: 10,
    },
    symptomText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    inputField: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      right: '5%',
      width: '95%',  // Increased width
    },
    input: {
      borderWidth: 1,
      borderColor: 'black',
      width: '100%',  // Increased width
      height: 60,
      marginBottom: 10,
      borderRadius: 10,
      backgroundColor: 'white',
      padding: 10,
    },
    button: {
      backgroundColor: '#4d87bf',
      width: '100%',  // Increased width
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
    deleteButton: {
      backgroundColor: '#e74c3c',
      width: '100%',  // Increased width
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
    },
  };