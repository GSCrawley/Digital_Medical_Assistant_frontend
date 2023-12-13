import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const RiskFactorsScreen = () => {
  const { state } = useLocation();
  const { Durl, disease_name, token, Rurl, patientID } = state;
  const [data, setData] = useState(null);
  const [riskListData, setRiskListData] = useState([]);
  const [patientRiskList, setPatientRiskList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${Rurl}/risk_factors`,
          { disease_name, patientID },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(response.data);
        setRiskListData(response.data[0]);
        setPatientRiskList(response.data[1]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [Rurl, disease_name, patientID, token]);

  const addRisk = (item) => {
    setSelectedItems((prevSelected) => [...prevSelected, item]);
  };

  const handleFormSend = async () => {
    try {
      const response = await axios.post(
        `${Rurl}/risk_factors_process`,
        { selectedItems, patientID, disease_name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedItems([]);
      // Redirect or handle success
      navigate(-1)
    } catch (error) {
      // Handle error
      console.error('Error:', error.message);
      alert('Error', 'An unexpected error occurred.');
    }
  };

  const isButtonPressed = (item) => selectedItems.includes(item);

  return (
    <div style={styles.container}>
      <p>{patientID}</p>
      <p>RISK FACTORS</p>
      <p>{Durl}</p>
      <p>{disease_name}</p>
      <p>{data}</p>
      <div>
        {patientRiskList.map((item, index) => (
          <button
            key={index}
            style={{ 
              ...styles.button, 
              ...styles.greenButton }}
          onClick={() => addRisk(item)}
        >
          <div>
            <p style={styles.buttonText}>{item}</p>
          </div>
        </button>
        
        ))}

        {riskListData.map((item, index) => (
          <button
            key={index}
            style={{
              ...styles.button,
              ...isButtonPressed(item) ? styles.greenButton : {},
            }}
            onClick={() => addRisk(item)}
          >
            <div>
              <p style={styles.buttonText}>{item}</p>
            </div>
          </button>
        ))}
        <button style={styles.button} onClick={handleFormSend}>
          <div>
            <p style={styles.buttonText}>Submit</p>
          </div>
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#4d87bf',
    width: 300,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  greenButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
};

export default RiskFactorsScreen;
