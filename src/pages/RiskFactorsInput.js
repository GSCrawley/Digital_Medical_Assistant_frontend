import React, { useState, useEffect } from 'react';
import{ useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';

var riskFactorsLst = [];
function RiskFactorInputScreen() {
  const [riskFactors, setRiskFactors] = useState([]);
  const [message, setMessage] = useState([]);
  const token = useLocation().state.token;
  const patientID = useLocation().state.patientID;
  var url  = useLocation().state.url;
  const [rfurl, setURL] = useState([]);
  const navigate = useNavigate();
  var connectionAttempts = 0
  
  const emptyList = () => {
    riskFactorsLst.length = 0;
  }

  // Function to fetch the URL asynchronously
  useEffect(() => {
    const fetchURL = async () => {
      try {
        const response = await fetch('http://localhost:8010/risk_factors_server')
        // const response = await fetch('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/risk_factors_server'); // Replace with your actual API URL
        const data = await response.json();
        setURL(data.url); // Once the data is fetched, update the 'url' state with the received URL
      } catch (error) {
        console.error('Error fetching URL:', error);
      }
    };
    fetchURL();
  }, []);

  const handleRiskFactorFormSend = async () => {
    const riskFactorsData = riskFactorsLst;
    try{
        const response = await axios.post(`${rfurl}/risk_factors_input`, {riskFactorsData, patientID},
        {headers: {Authorization: `Bearer ${token}`}
        });
        // setMessage(response.data);
        // navigation.navigate('Diagnosis', {message: response.data, url: durl, token});
        navigate('/patient-profile', { state: { token, url, inputValue: patientID }});
        emptyList()
    } catch (error) {
        if (error.request && connectionAttempts <= 5) {
          // Network error (request was made but no response received)
          const fetchData = async () => {
            const result = await axios.get('http://localhost:8010/risk_factors_server');
            // const result = await axios.get('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/risk_factors_server');
            url = result.data.url;
            connectionAttempts = connectionAttempts + 1
            handleRiskFactorFormSend()
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

  const RiskFactorInputField = (props) => {
    const [riskFactor, setRiskFactors] = useState('');

    const handleAddRiskFactor = (value) => {
      props.addRiskFactor(value)
      riskFactorsLst.push(value)
      setRiskFactors(null);
    }
//   const symptomFunctionCombine = () => {
//     handleSymptomFormSend();
//     // emptyList();
//     navigation.navigate('Diagnosis', {message: message});
//   }

    return (
      <div style={{ flex: 1, alignItems: 'center', justifyContent: 'flax-start', right: "5%" }}>
        <input 
            style={styles.input} 
            value={riskFactor} 
            // onChange = {text => setRiskFactors(text)} placeholder='Write a risk factor'/>
            onChange = {(e) => setRiskFactors(e.target.value)} />
        <button 
            style={styles.button} 
            onClick ={() => handleAddRiskFactor(riskFactor)}>
          <div>
              <p style={styles.buttonText}>Add Risk Factor</p>
          </div>
        </button>
        <button style={styles.button} onClick={handleRiskFactorFormSend}>
          <div>
              <p style={styles.buttonText}>Submit</p>
          </div>
        </button>
      </div>
    )
  }

  const RiskFactorItem = (props) => {
    return(
      <div style={{marginTop: 10}}>
          <div>
              <p>{props.index}</p>
          </div>
          <div>
              <p style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>{props.riskFactor}</p>
              <button onClick={() => props.deleteRiskFactor()}>
                <p>Delete</p>
              </button>
          </div>
      </div>
    )
  }

  const addRiskFactor = (riskFactor) => {
    if (riskFactor == null) return;
    setRiskFactors([...riskFactors, riskFactor]);
    // Keyboard.dismiss();
  }

  const deleteRiskFactor = (deleteIndex) => {
    setRiskFactors(riskFactors.filter((value, index) => index !== deleteIndex));
  }

  return (
    <div style={{left: "5%"}}>
        <div>
          {
            riskFactors.map((riskFactor, index) => {
              return (
                <div key={index} style={{backgroundColor:"white", borderWidth:"1", borderColor: "#ccc", padding: 10, borderRadius: 15, width: "90%"}}>
                  <RiskFactorItem index={index + 1} riskFactor={riskFactor} deleteRiskFactor={() => deleteRiskFactor(index)}/>
                </div>
              );
            })
          }
        </div>
        <RiskFactorInputField addRiskFactor={addRiskFactor}/>
    </div>
  );
}

export default RiskFactorInputScreen

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