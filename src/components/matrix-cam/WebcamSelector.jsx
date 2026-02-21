import React, { useState, useEffect } from 'react';

const WebcamSelector = ({ selectedDevice, setSelectedDevice }) => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const loadDevices = () => {
            navigator.mediaDevices.enumerateDevices()
                .then((allDevices) => {
                    const videoDevices = allDevices.filter((device) => device.kind === 'videoinput');
                    setDevices(videoDevices);

                    if (videoDevices.length > 0) {
                        setSelectedDevice((currentDevice) => currentDevice || videoDevices[0].deviceId);
                    }
                })
                .catch((error) => {
                    console.error('Error accessing media devices:', error);
                });
        };

        loadDevices();
        navigator.mediaDevices?.addEventListener?.('devicechange', loadDevices);

        return () => {
            navigator.mediaDevices?.removeEventListener?.('devicechange', loadDevices);
        };
    }, [setSelectedDevice]);

    const handleDeviceChange = (event) => {
        setSelectedDevice(event.target.value);
    };

    return (
        <div>
            <label htmlFor="webcam-select">Choose a Camera:</label>
            <select id="webcam-select" value={selectedDevice} onChange={handleDeviceChange}>
                {devices.map((device, index) => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${index + 1}`}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default WebcamSelector;
