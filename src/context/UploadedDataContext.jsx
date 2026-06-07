import { createContext, useState, useContext, useEffect, useCallback } from 'react';

const UploadedDataContext = createContext(null);

const STORAGE_KEY = 'vendorUploads';

export function UploadedDataProvider({ children }) {
  const [uploadData, setUploadData] = useState({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUploadData(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to parse uploaded vendor data');
    }
  }, []);

  const setUploadForVendor = useCallback((vendorId, data) => {
    setUploadData(prev => {
      const next = { ...prev, [vendorId]: { ...data, timestamp: Date.now() } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearUploadForVendor = useCallback((vendorId) => {
    setUploadData(prev => {
      const next = { ...prev };
      delete next[vendorId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getUploadForVendor = useCallback((vendorId) => {
    return uploadData[vendorId] || null;
  }, [uploadData]);

  return (
    <UploadedDataContext.Provider value={{ uploadData, setUploadForVendor, clearUploadForVendor, getUploadForVendor }}>
      {children}
    </UploadedDataContext.Provider>
  );
}

export function useUploadedData() {
  const ctx = useContext(UploadedDataContext);
  if (!ctx) throw new Error('useUploadedData must be used within UploadedDataProvider');
  return ctx;
}
