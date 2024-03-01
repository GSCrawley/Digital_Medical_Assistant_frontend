import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';


function DiseaseStatsScreen() {
  const [name, setName] = useState('');
//   const [DOB, setDOB] = useState('');
  const [url, setURL] = useState('');
  // const [Durl, setDURL] = useState(''); // Make this dynamic
  const [Rurl, setRURL] = useState('');
  const [LLMResponse, setLLMResponse] = useState('');
  const { token, item, patientID, message, Durl } = useLocation().state;
  const [pValue, setPvalue] = useState('');
  const [correlatingDiseases, setCorrelatingDiseases] = useState(['Loading...']);
  const [correlatingSymptoms, setCorrelatingSymptoms] = useState(['Loading...'])

  const navigate = useNavigate();

  useEffect( () => {
    const fetchURL = async () => {
      try {
        const response = await fetch('http://localhost:8010/care_provider_server')
        // const response = await fetch('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/care_provider_server');
        const data = await response.json();
        setURL(data.url);
        // fetchData();
        // fetchMemo();  // Now it waits for fetchData to complete before fetching memo
      } catch (error) {
        console.error('Error fetching URL:', error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.post(`${Durl}/disease_stats`, { message, item }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCorrelatingDiseases(response.data[0]);
        setPvalue(response.data[1]);
        setCorrelatingSymptoms(response.data[2]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchMemo = async () => {
      try {
        const response = await axios.post(`${Durl}/disease_info`, { item }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLLMResponse(response.data);
      } catch (error) {
        console.error('Error fetching memo data:', error);
      }
    };

    fetchURL();
    fetchData();
    fetchMemo();

    const fetchRiskURL = async () => {
      try {
        const response = await fetch('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/risk_factors_server');
        const data = await response.json();
        setRURL(data.url);
      } catch (error) {
        console.error('Error fetching disease URL:', error);
      }
    };

    fetchRiskURL();
  }, []);

  const diagnose = async () => {
    try {
        const response = await axios.post(`${url}/diagnose`, {
            disease_name: item,
            patient_id: patientID
            }, {
            headers: { Authorization: `Bearer ${token}` },
            });          
        // setContent(response.data.message);
        setName(response.data.diseaseName)
        navigate('/provider-profile', { state: {token, url} });
        } catch (error) {
        console.error(error);
        // Alert.alert('Error', 'Failed to fetch protected content');
    }
  };

  const navigateToRiskFactors = () => {
    navigate('/risk-factors', { state: {Durl, disease_name: item, token, url, Rurl, patientID} });
  };

  const navigateToKeySymptoms = () => {
    navigate('/key-symptoms', { state: {Durl, disease_name: item, token, url, patientID} });
  };

//   const [message, setMessage] = useState(''); 
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/logout', {
        headers: { Authorization: `Bearer ${token}` },
      });
    //   setMessage(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <p>{url}</p>
        <p>{Durl}</p>
        <p>{item}</p>
        <p>LLM RESPONSE: {LLMResponse}</p>
        {/* <Text>{message}</Text> */}
        <div>
          <div style={{ flexDirection: 'row' }}>
            <p style={{ fontWeight: 'bold' }}>Hypothesis</p>
            <p>    </p>
            <p style={{ fontWeight: 'bold' }}>P-Value</p>
          </div>
          {correlatingDiseases.map((disease, index) => (
            <div key={index} style={{ flexDirection: 'row' }}>
              <p>{disease}</p>
              <p>    </p>
              <p>{pValue[index]}...</p>
            </div>
          ))}
        </div>

        <p style={{ fontWeight: 'bold' }}>Correlating Symptoms</p>
        <div>
          {correlatingSymptoms.map((symptom, index) => (
            <p key={index}>{symptom}</p>
          ))}
        </div>

        <button style={styles.button} onClick={navigateToKeySymptoms}>
          <div>
              <p style={styles.buttonText}>Key Symptoms</p>
          </div>
        </button>

        <button style={styles.button} onClick={navigateToRiskFactors}>
          <div>
              <p style={styles.buttonText}>Risk Factors</p>
          </div>
        </button>

        <button style={styles.button} onClick={diagnose}>
          <div>
              <p style={styles.buttonText}>Diagnose</p>
          </div>
        </button>
        {/* <Button title="Logout" onPress={handleLogout} /> */}
        
      </div>
    </div>
  );
}

export default DiseaseStatsScreen

const styles = {
    container: {
      flex: 1,
      backgroundColor: '#cbdcec',
      alignItems: 'center',
    },
    title:{
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 30,
    },
    subtitle:{
        fontWeight: 'bold',
    },
  
    body: {
        backgroundColor: 'white',
        width:'90%',
        margin:20,
        marginBottom:50,
        borderRadius:10
  
    },
    bot: {
        fontSize:16,
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        width: '90%',
        height:60,
        marginBottom:10,
        borderRadius:10,
        backgroundColor:"white"
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