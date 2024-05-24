// QRCodeScanner.js

import { useState, useEffect } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const QRCodeScanner = () => {
  const [result, setResult] = useState('');

  useEffect(() => {
    let codeReader;
    let videoStream;

    const startScanner = async () => {
      try {
        codeReader = new BrowserMultiFormatReader();
        const videoInputDevices = await codeReader.listVideoInputDevices();
        console.log(videoInputDevices);
        const selectedDeviceId = videoInputDevices[0].deviceId;

        const constraints = {
          video: {
           // deviceId: selectedDeviceId,
            facingMode: 'environment',
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoStream = stream;
        const videoElement = document.getElementById('qr-video');
        videoElement.srcObject = stream;

        codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, err) => {
          if (result) {
            setResult(result.text);
          }
          if (err instanceof NotFoundException) {
            console.warn('No QR code found in the current frame.');
          } else if (err) {
            console.error('Error decoding QR code:', err);
          }
        });
      } catch (error) {
        console.error('Error starting QR code scanner:', error);
      }
    };

    startScanner();

    return () => {
      // Clean up resources when component unmounts
      if (codeReader) {
        codeReader.reset();
      }
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h1>Scanner</h1>
      <video id="qr-video" autoPlay playsInline style={{ width: '100%' }}></video>
      <p>Scanned code: {result}</p>
      {/* Add your custom styling here (colored edges, corners, etc.) */}
    </div>
  );
};

export default QRCodeScanner;
