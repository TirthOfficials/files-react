// UploadPage.js
import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
import './UploadPage.css'; // CSS file for styling

const DB_NAME = 'fileUploadDB';
const STORE_NAME = 'files';
const DB_VERSION = 1;

async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
  return db;
}

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [token, setToken] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [db, setDb] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    initDB().then(setDb);
  }, []);

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const uploadFiles = async () => {
    if (files.length > 0 && db) {
      const generatedToken = Math.random().toString(36).substr(2, 9);
      for (const file of files) {
        await db.put(STORE_NAME, file, generatedToken + file.name);
      }
      setToken(generatedToken);

      setTimeout(() => {
        files.forEach(file => {
          db.delete(STORE_NAME, generatedToken + file.name);
        });
      }, 15 * 60 * 1000); // Token expires after 15 minutes
    }
  };
  const copyToClipboard = (token) => {
    navigator.clipboard.writeText(token).then(() => {
      alert('Token copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleTokenChange = (event) => {
    setInputToken(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (db) {
      const fileKeys = await db.getAllKeys(STORE_NAME);
      const matchedFiles = fileKeys.filter(key => key.startsWith(inputToken));
      setUploadedFiles(matchedFiles);
    }
  };

  const viewFile = async (fileKey) => {
    const db = await openDB(DB_NAME, 1);
    const file = await db.get(STORE_NAME, fileKey);
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  return (
    <div className="app">
      <div className="upload-section">
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={uploadFiles}>Upload</button>
        {token && (
          <div className="token-display">
            <p>Your token (valid for 15 minutes): {token}</p>
            <button onClick={() => copyToClipboard(token)}>Copy to Clipboard</button>
          </div>
        )}
      </div>
      <div className="access-section">
        <form onSubmit={handleSubmit}>
          <input type="text" value={inputToken} onChange={handleTokenChange} placeholder="Enter token" />
          <button type="submit">Access Files</button>
        </form>
        <ul>
          {uploadedFiles.map((fileKey) => (
            <li key={fileKey}>
              {fileKey.replace(inputToken, '')} <button onClick={() => viewFile(fileKey)}>View</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UploadPage;
