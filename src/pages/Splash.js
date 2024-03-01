import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SplashScreen = () => {
  const [data, setData] = useState(null);
  const [cpdata, setCPDATA] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:8010/patient_server');
        // const result = await axios.get('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/patient_server');
        setData(result.data.url);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:8010/care_provider_server');
        // const result = await axios.get('https://cognitive-network-manager-rdwl5upzra-uw.a.run.app/care_provider_server');
        setCPDATA(result.data.url);
      } catch (error) {
        console.error('Error fetching CP data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      {data ? (
        <div>
          <h1 style={styles.title}>Website Title Header</h1>
          <p>{data}</p>
          <Link to="/login" state={{ url: data }}>
            <button style={styles.button}>Patient Login</button>
          </Link>

          <Link to= "/provider-login" state = {{ url: cpdata }}>
            <button style={styles.button}>Care Provider Login</button>
          </Link>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SplashScreen;

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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#4d87bf',
    width: '100%',
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
};
