'use client';

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function Home() {
  const [url, setUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setQrCodeUrl('');

    if (!url.trim()) {
      setError("⚠️ Please enter a valid URL!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/generate-qr/', { url });
      setQrCodeUrl(response.data.qr_code_url);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setError("🚨 Invalid URL format! Please enter a valid URL.");
        } else if (error.response.status === 500) {
          setError("🔥 Server Error! Try again later.");
        } else {
          setError("⚠️ Failed to generate QR Code.");
        }
      } else {
        setError("❌ Network Error! Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>QR Code Generator</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g., https://example.com)"
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
      
      {qrCodeUrl && (
        <div style={styles.qrContainer}>
          <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} />
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
    color: 'white',
    padding: '20px',
  },
  title: {
    margin: '0',
    lineHeight: '1.15',
    fontSize: '4rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    marginTop: '20px',
    width: '300px',
    color: '#121212',
  },
  button: {
    padding: '10px 20px',
    marginTop: '20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#0070f3',
    color: 'white',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  error: {
    color: 'red',
    marginTop: '10px',
    fontWeight: 'bold',
  },
  qrContainer: {
    marginTop: '20px',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '10px',
  },
};
 