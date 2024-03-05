import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const symptomsLst = [];

function SymptomFormScreen() {
  const [symptoms, setSymptoms] = useState([]);
  // const [message, setMessage] = useState([]);
  const { token, url } = useLocation().state;
  const [durl, setURL] = useState([]);
  const navigate = useNavigate();
  let connectionAttempts = 0;

  const emptyList = () => {
    symptomsLst.length = 0;
  };

  useEffect(() => {
    const fetchURL = async () => {
      try {
        // const response = await axios.get('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/disease_server');
        const response = await axios.get('http://localhost:8010/disease_server');
        const data = await response.data;
        setURL(data.url);
      } catch (error) {
        console.error('Error fetching URL:', error);
      }
    };
    fetchURL();
  }, []);

  const handleSymptomFormSend = async () => {
    const symptomsData = symptomsLst;
    try {
      const response = await axios.post(
        `${url}/symptoms`,
        { symptomsData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // setMessage(response.data);
      navigate('/diagnosis', { state: { message: response.data, durl: durl, token } });
      emptyList();
    } catch (error) {
      if (error.request && connectionAttempts <= 5) {
        const fetchData = async () => {
          try {
            // const result = await axios.get('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/symptoms_server');
            const result = await axios.get('http://localhost:8010/symptoms_server');
            url = result.data.url;
            connectionAttempts += 1;
            handleSymptomFormSend();
          } catch (networkError) {
            console.error('Network error during retry:', networkError);
          }
        };
        fetchData();
      } else {
        console.error('Error:', error.message);
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

    return (
      <div style={styles.inputField}>
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
    );
  };

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

export default SymptomFormScreen;

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
