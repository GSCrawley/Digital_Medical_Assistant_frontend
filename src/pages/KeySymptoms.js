import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function KeySymptomsScreen() {
  const Durl = useLocation().state.Durl;
  const disease_name = useLocation().state.disease_name;
  const token = useLocation().state.token;
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const isButtonPressed = (item) => selectedItems.includes(item);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${Durl}/key_symptoms`, { disease_name }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
        // setData(response.data)
        // setRiskListData(response.data[0]);
        // setPatientRiskList(response.data[1])
        // console.log(riskListData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={styles.container}>
    <h1 style={styles.text}>Key Symptoms</h1>
    {data.map((item, index) => (
      <button
        key={index}
        style={{
          ...styles.button,
          ...(isButtonPressed(item) ? styles.greenButton : {}),
        }}
        onClick={() => {
          setSelectedItems((prevItems) =>
            isButtonPressed(item)
              ? prevItems.filter((selectedItem) => selectedItem !== item)
              : [...prevItems, item]
          );
        }}
      >
        <div>
          <p style={styles.buttonText}>{item}</p>
        </div>
      </button>
    ))}
  </div>
  );
}

export default KeySymptomsScreen;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
    cursor: 'pointer',
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
