import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function ProviderDiagnosisScreen() {
    const [text, setText] = useState('');
    const message = useLocation().state.message;
    const [loading, setLoading] = useState(true);
    const token = useLocation().state.token;
    const patientID = useLocation().state.patientID;
    var url = useLocation().state.url;
    // var Durl = useLocation().state.durl;
    // const [Durl, setDurl] = useState('');
    // var [diseaseListData, setDiseaseListData] = useState('');
    var connectionAttempts = 0;
    const [diseaseListData, setDiseaseListData] = useState([]); // Updated this line

    const navigate = useNavigate();


    const profileNav = () => {
        navigate('/provider-profile', {state: {token}});
    };

    useEffect(() => {
      const fetchData = async () => {
        try{
          const symptomsData = message;
          const response = await axios.post(`${url}/care_provider_disease`, {symptomsData, patientID},
            {headers: {Authorization: `Bearer ${token}`}
          });
          // setText(response.data[0])
          setDiseaseListData(response.data);
        } catch (error) {
          if (error.request && connectionAttempts <= 5) {
            // Network error (request was made but no response received)
            const fetchURLerr = async () => {
              const result = await axios.get('http://localhost:8010/disease_server')
              // const result = await axios.get('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/disease_server');
            //   url = result.data.url;
              connectionAttempts = connectionAttempts + 1
            };
            fetchURLerr();
            // console.error('Network error:', error.request);
            // Alert.alert('Error', 'Network error. Please check your connection.');
          } else {
            // Other errors
            console.error('Error:', error.message);
            alert('Error', 'An unexpected error occurred.');
          }
        };
      };
      fetchData();
    }, []);

    useEffect(() => {
        if (!message) return;
        if (message !== text) {
            setText(message);
            setLoading(false);
        }
    }, [message]);

    const handleFormSend = (event, item) => {
        navigate('/disease-stats', {state: {token, Durl:url, item, message, patientID}});
    }
    return (
      <div>
        <p>{url}</p>
        <button title="Profile" onClick={profileNav}>Profile</button>
        {/* <Text>Diagnosis</Text> */}
        {/* <View style={{backgroundColor:"white", borderWidth:"1", borderColor: "#ccc", padding: 10, borderRadius: 15, width: "90%", left: "5%"}}>
          <Text>{text}</Text>
        </View> */}
        <div>
          {diseaseListData.map((item, index) => (
            <button key={index} style={styles.button} onClick={(event) => handleFormSend(event, item, url)}>
            <div>
                <p style={styles.buttonText}>{item}</p>
            </div>
          </button>
          ))}
        </div>
      </div>
    )
  }

export default ProviderDiagnosisScreen

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
      padding: 10, 
      borderRadius: 15,
      width: "90%", 
      left: "5%"
  },
  buttonText:{
      fontSize:18,
      fontWeight:'bold',
      color:'white',
  },
};