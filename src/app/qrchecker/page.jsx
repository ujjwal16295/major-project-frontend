'use client';

import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import axios from 'axios';
import Link from 'next/link';
import { QrCode, Upload, AlertTriangle, CheckCircle, Home, FileText, RefreshCw } from 'lucide-react';

export default function QrScanner() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const scanningRef = useRef(true);

  // Start camera on component mount
  useEffect(() => {
    startCamera();
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize camera
  const startCamera = async () => {
    try {
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current.play();
          scanQRCode();
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Camera access error: ' + err.message);
    }
  };

  // Scan for QR codes from video feed
  const scanQRCode = async () => {
    if (!scanningRef.current) return;

    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      requestRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      console.log("QR code detected:", code.data);
      setUrl(code.data);
      scanningRef.current = false; // Stop scanning
      submitUrl(code.data);
    } else {
      requestRef.current = requestAnimationFrame(scanQRCode);
    }
  };

  // Extract QR from uploaded image
  const extractLinkFromImagePath = async (imagePath) => {
    const img = new Image();
    img.src = imagePath;
    await img.decode();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    return jsQR(imageData.data, img.width, img.height)?.data || null;
  };

  // Handle file upload and extract QR
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const qrData = await extractLinkFromImagePath(e.target.result);
        if (qrData) {
          console.log("QR code detected from image:", qrData);
          setUrl(qrData);
          await submitUrl(qrData);
        } else {
          setError("No QR code found in image.");
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Error processing image: " + err.message);
      setIsLoading(false);
    }
  };

  // Send URL to backend
  const submitUrl = async (urlToSubmit) => {
    if (!urlToSubmit) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post('https://major-project-production-a554.up.railway.app/predict', {
        email: 'newujjwalpatel@gmail.com',
        api_key: 'd4a6251e4c9c435152b105a611b4751a32f078e3df1695b74630f6df438ab69e',
        url: urlToSubmit,
      });
      
      // Store the full result object instead of just the classification
      setResult(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('API error: ' + (err.response?.data?.error || err.message));
      setIsLoading(false);
    }
  };

  // Reset the scanner
  const resetScanner = () => {
    setUrl('');
    setResult(null);
    setError(null);
    setIsLoading(false);
    scanningRef.current = true;
    scanQRCode();
  };

  // Loading Spinner component
  const LoadingSpinner = () => (
    <div className="w-full flex justify-center items-center py-4">
      <svg className="animate-spin -ml-1 mr-2 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Analyzing URL...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-center">
          <div className="inline-flex justify-center items-center p-4 bg-white/20 rounded-full mb-4">
            <QrCode size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">PhishShield Scanner</h1>
          <p className="text-blue-100 mt-2">Scan QR codes to detect phishing attempts</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="flex items-start p-4 rounded-lg bg-red-50 border border-red-100 text-red-800 mb-6">
              <AlertTriangle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Video Scanner */}
            <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <video 
                ref={videoRef} 
                className="w-full h-64 object-cover" 
                autoPlay 
                playsInline 
                muted
              ></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-white w-40 h-40 rounded opacity-70"></div>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-gray-700 font-medium text-sm flex items-center">
                <Upload size={16} className="mr-2 text-gray-500" />
                Upload QR Code Image
              </label>
              <div className="relative">
                <input 
                  type="file"
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="w-full p-3 pl-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Results Display */}
            {url && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-gray-600">URL Detected:</p>
                <p className="text-gray-700 break-words mt-1 text-sm">{url}</p>
              </div>
            )}

            {isLoading && (
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md disabled:opacity-70 flex items-center justify-center"
                disabled
              >
                <LoadingSpinner />
              </button>
            )}

            {result && !isLoading && (
              <div className={`p-4 rounded-lg ${result.is_phishing ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
                <div className="flex items-center justify-center mb-3">
                  {result.is_phishing ? (
                    <AlertTriangle size={24} className="text-red-500 mr-2" />
                  ) : (
                    <CheckCircle size={24} className="text-green-500 mr-2" />
                  )}
                  <p className="text-lg font-bold text-black">
                    {result.is_phishing ? 'UNSAFE URL' : 'LEGITIMATE URL'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white bg-opacity-60 rounded">
                    <p className="text-sm font-medium text-black">Classification:</p>
                    <p className={`font-bold text-sm ${result.is_phishing ? 'text-red-600' : 'text-green-600'}`}>
                      {result.classification}
                    </p>
                  </div>
                  {/* <div className="flex justify-between items-center p-2 bg-white bg-opacity-60 rounded">
                    <p className="text-sm font-medium text-black">Confidence:</p>
                    <p className="font-bold text-sm text-black">{(result.confidence * 100).toFixed(2)}%</p>
                  </div> */}
                </div>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={resetScanner}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center"
              disabled={isLoading}
            >
              <RefreshCw size={16} className="mr-2" />
              {isLoading ? 'Processing...' : 'Reset Scanner'}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
            <Link href="/" className="block">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center hover:bg-gray-100 transition-all">
                <Home size={18} className="mx-auto text-blue-600 mb-1" />
                <p className="text-sm text-gray-700 font-medium">Home</p>
              </div>
            </Link>
            <Link href="/documentation" className="block">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center hover:bg-gray-100 transition-all">
                <FileText size={18} className="mx-auto text-blue-600 mb-1" />
                <p className="text-sm text-gray-700 font-medium">Documentation</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}