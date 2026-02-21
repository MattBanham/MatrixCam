import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// Settings icon replaced with inline SVG
import WebcamSelector from './WebcamSelector'; // Adjust the path to the correct file location
import './MatrixCam.css';

const CHARACTER_SETS = {
    Alphanumeric: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxyz0123456789-+=/;':>}{[}]"%$£!^&*)(_~\``,
    'Inverted Alpha': `~_()*&^!£$%"]}[{}>:';/=+-9876543210zyxvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA`,
    'Mixed Symbols': `*!)GZkKo_Uvq8{da>}=ue3g/XM+WyAT1%IJ4s9CcOYi(];^S~D06}2njN£L-bHPB["zfQ:t\\EFRlh5V&r'7pmx$`,
    Minimal: '   -.:░▒▓█',
    'Dot Matrix': '   .:-i|=+%O#@',
    'Negative Space': `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxyz0123456789-+=/;:>}{[}]"%$£!^&*)(_~\`                                             `
};

const MatrixCam = () => {
    // Initial State Declarations
    const [averageFps, setAverageFps] = useState(0);

        const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [hideUI, setHideUI] = useState(false);  // New state to control UI visibility

    const [selectedFont, setSelectedFont] = useState('MatrixCode'); // New state for font selection
    const [selectedColor, setSelectedColor] = useState('Chromatic'); // New state for color selection
    
    const [invertChromatic, setInvertChromatic] = useState(false); // false means normal gradient from the edge, true is centred
    const [chromaticIntensity, setChromaticIntensity] = useState(50); // Default value of 50
    const [selectedCharacterSet, setSelectedCharacterSet] = useState('Alphanumeric'); // New state for character set selection
    const [brightness, setBrightness] = useState(1.5);
    const [rgbValues] = useState({ r: 7, g: 3, b: 4 }); // Keep this for 'chill' adjustments - may refactor this idea later
    const [isMirrored, setIsMirrored] = useState(false); // false for unmirrored by default
    const [flipCharacters, setFlipCharacters] = useState(false); // false for unflipped characters by default
    const [effectiveMirroring, setEffectiveMirroring] = useState(isMirrored); // Initialize with isMirrored
    const [colorPickerValue, setColorPickerValue] = useState('#00ff00'); // Initial green color
    const [resolutionScale, setResolutionScale] = useState(1); // Initial scale
    const [canvasSize, setCanvasSize] = useState({ width: 960, height: 720 });
    const [contrast, setContrast] = useState(100); // Initial contrast percentage
    
    const [isRainEffect, setIsRainEffect] = useState(true);
    const [rainSpeed, setRainSpeed] = useState(100); // Interval in milliseconds
    const [rainRandomness, setRainRandomness] = useState(0.5); // Default value set to 0.5
    const [rainColor, setRainColor] = useState('#FFFFFF'); // Default white color for rain
    const [rainDropLength, setRainDropLength] = useState(25); // Default length
    const [rainOverlap, setRainOverlap] = useState(true); // Add this to your state declarations
    const [isDistorted, setIsDistorted] = useState(false); // Add distortion to the height of characters
    const [distortionThreshold, setDistortionThreshold] = useState(128); // Default to 128 (mid-brightness)
    const [rainDistorted, setRainDistorted] = useState(false); // Rain distortion
    const [selectedFade, setSelectedFade] = useState('None'); // Default to 'None'
    const [fadeExtent, setFadeExtent] = useState(50); // Default value, adjust as needed
    const [selectedDevice, setSelectedDevice] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const [isReady, setIsReady] = useState(false);
    
    // Presets
    const [defaultPresets] = useState([
        // Default Presets
        { name: 'Default', settings: {
                                    selectedColor: 'Chromatic',
                                    selectedFont: 'MatrixCode',
                                    invertChromatic: false,
                                    chromaticIntensity: 50,
                                    selectedCharacterSet: 'Alphanumeric',
                                    brightness: 1.5,
                                    isMirrored: false,
                                    flipCharacters: false,
                                    effectiveMirroring: isMirrored,
                                    colorPickerValue: '#00ff00',
                                    resolutionScale: 1,
                                    canvasSize:{ width: 960, height: 720 },
                                    contrast: 100,
                                    isRainEffect: true,
                                    rainSpeed: 100,
                                    rainRandomness: 0.5,
                                    rainColor: '#FFFFFF',
                                    rainDropLength: 25,
                                    rainOverlap: true,
                                    isDistorted: false,
                                    distortionThreshold: 128,
                                    rainDistorted: false,
                                    selectedFade: 'None',
                                    fadeExtent: 50,
                                    } },
        { name: 'Matrix', settings: {
                                    selectedColor: 'Green',
                                    selectedFont: 'MatrixCode',
                                    invertChromatic: false,
                                    chromaticIntensity: 50,
                                    selectedCharacterSet: 'Alphanumeric',
                                    brightness: 2,
                                    isMirrored: false,
                                    flipCharacters: false,
                                    effectiveMirroring: isMirrored,
                                    colorPickerValue: '#00fbff',
                                    resolutionScale: 1,
                                    canvasSize:{ width: 960, height: 720 },
                                    contrast: 100,
                                    isRainEffect: true,
                                    rainSpeed: 100,
                                    rainRandomness: 0.5,
                                    rainColor: '#FFFFFF',
                                    rainDropLength: 25,
                                    rainOverlap: true,
                                    isDistorted: true,
                                    distortionThreshold: 90,
                                    rainDistorted: false,
                                    selectedFade: 'None',
                                    fadeExtent: 50,
                                    } },    
        { name: 'Chill Code', settings: {
                                    selectedColor: 'Chill',
                                    selectedFont: 'MatrixCode',
                                    invertChromatic: false,
                                    chromaticIntensity: 50,
                                    selectedCharacterSet: 'Alphanumeric',
                                    brightness: 1.5,
                                    isMirrored: false,
                                    flipCharacters: false,
                                    effectiveMirroring: isMirrored,
                                    colorPickerValue: '#00ff00',
                                    resolutionScale: 1,
                                    canvasSize:{ width: 960, height: 720 },
                                    contrast: 100,
                                    isRainEffect: true,
                                    rainSpeed: 100,
                                    rainRandomness: 0.5,
                                    rainColor: '#FFFFFF',
                                    rainDropLength: 25,
                                    rainOverlap: true,
                                    isDistorted: true,
                                    distortionThreshold: 90,
                                    rainDistorted: false,
                                    selectedFade: 'None',
                                    fadeExtent: 50,
                                    } },
        { name: 'Dot Minimal', settings: {
                                    selectedColor: 'Chill',
                                    selectedFont: 'Monospace',
                                    invertChromatic: false,
                                    chromaticIntensity: 50,
                                    selectedCharacterSet: 'Dot Matrix',
                                    brightness: 2,
                                    isMirrored: false,
                                    flipCharacters: false,
                                    effectiveMirroring: isMirrored,
                                    colorPickerValue: '#00ff00',
                                    resolutionScale: 1,
                                    canvasSize:{ width: 960, height: 720 },
                                    contrast: 100,
                                    isRainEffect: false,
                                    rainSpeed: 100,
                                    rainRandomness: 0.5,
                                    rainColor: '#FFFFFF',
                                    rainDropLength: 25,
                                    rainOverlap: true,
                                    isDistorted: true,
                                    distortionThreshold: 90,
                                    rainDistorted: false,
                                    selectedFade: 'None',
                                    fadeExtent: 50,
                                    } },
        { name: 'I\'m Blue', settings: {
                                    selectedColor: 'Custom',
                                    selectedFont: 'Wingdings',
                                    invertChromatic: false,
                                    chromaticIntensity: 50,
                                    selectedCharacterSet: 'Dot Matrix',
                                    brightness: 2,
                                    isMirrored: false,
                                    flipCharacters: false,
                                    effectiveMirroring: isMirrored,
                                    colorPickerValue: '#00fbff',
                                    resolutionScale: 1,
                                    canvasSize:{ width: 960, height: 720 },
                                    contrast: 100,
                                    isRainEffect: false,
                                    rainSpeed: 100,
                                    rainRandomness: 0.5,
                                    rainColor: '#FFFFFF',
                                    rainDropLength: 25,
                                    rainOverlap: true,
                                    isDistorted: true,
                                    distortionThreshold: 90,
                                    rainDistorted: false,
                                    selectedFade: 'None',
                                    fadeExtent: 50,
                                    } },
        { name: 'Natural', settings: {
                                    selectedColor: 'Natural',
                                    selectedFont: 'Matrix Code',
                                    invertChromatic: false,
                                    chromaticIntensity: 50,
                                    selectedCharacterSet: 'Alphanumeric',
                                    brightness: 2,
                                    isMirrored: false,
                                    flipCharacters: false,
                                    effectiveMirroring: isMirrored,
                                    colorPickerValue: '#00fbff',
                                    resolutionScale: 1,
                                    canvasSize:{ width: 960, height: 720 },
                                    contrast: 100,
                                    isRainEffect: true,
                                    rainSpeed: 100,
                                    rainRandomness: 0.5,
                                    rainColor: '#FFFFFF',
                                    rainDropLength: 25,
                                    rainOverlap: true,
                                    isDistorted: true,
                                    distortionThreshold: 90,
                                    rainDistorted: false,
                                    selectedFade: 'None',
                                    fadeExtent: 50,
                                    } },                                                           
      ]);
      
    const [customPresets, setCustomPresets] = useState([]); // For user-saved presets
    const [selectedPreset, setSelectedPreset] = useState([null]);
    
    // 1) density string depends only on selectedCharacterSet
    const density = useMemo(() => CHARACTER_SETS[selectedCharacterSet], [selectedCharacterSet]);

    // 2) brightness -> char index lookup (0..255 -> 0..density.length-1)
    const brightnessToIndex = useMemo(() => {
        const out = new Uint16Array(256);
        const L = density.length;
        for (let v = 0; v < 256; v++) {
            // map bright->low index so bright pixels draw "lighter" glyphs; invert if you prefer
            out[v] = Math.floor(L - (L * v) / 255);
        }
        return out;
    }, [density]);

    // put near other refs
    const rainAccumMs = useRef(0);
    
    
      

      // FPS Measuree
      const frameTimes = useRef([]); // Store individual frame times
      const lastUpdate = useRef(performance.now()); // Last time the FPS was updated
      const updateInterval = 300; // Update every 300 ms (0.3 seconds)
      const averagingPeriod = 3000; // Average over 3000 ms (3 seconds)
  
      // Other Defaults
      const hideMenuTimeout = useRef(null);
  
      const lastRenderTime = useRef(null);
      const baseWidth = 64;
      const baseHeight = 48;
      const videoRef = useRef(null);
      const canvasRef = useRef(null);
      const offScreenCanvasRef = useRef(null);
      const animationFrameId = useRef(null);
      const rainDropsRef = useRef([]);
      const mediaStreamRef = useRef(null);
      const drawLoopTokenRef = useRef(0);

    const stopWebcamStream = useCallback(() => {
        const stream = mediaStreamRef.current;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
        }
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.pause();
            videoRef.current.srcObject = null;
            videoRef.current.removeAttribute('src');
            videoRef.current.load();
        }
    }, []);

    // Functions
    // Menu Click Handlers
    
    const handleMenuClick = (menuName) => {
        setActiveSubMenu(menuName);
            };
    
    const handleBackClick = () => {
        setActiveSubMenu(null);
    };

    const handleFullscreenToggle = async () => {
        if (!isFullscreen) {
            // Enter fullscreen
            const webcamContainer = document.querySelector('.webcam-container');
            if (!webcamContainer) return;
            if (webcamContainer.requestFullscreen) {
                await webcamContainer.requestFullscreen();
            } else if (webcamContainer.webkitRequestFullscreen) {
                await webcamContainer.webkitRequestFullscreen();
            } else if (webcamContainer.msRequestFullscreen) {
                await webcamContainer.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }
        }
    };

    // Listen for fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement || !!document.msFullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Register explicit global cleanup handler used by the terminal when navigating away
    useEffect(() => {
        window.matrixCamCleanup = stopWebcamStream;
        return () => {
            if (window.matrixCamCleanup === stopWebcamStream) {
                window.matrixCamCleanup = undefined;
            }
            stopWebcamStream();
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [stopWebcamStream]);

    // Additional safety for browser lifecycle transitions.
    useEffect(() => {
        const hardStop = () => stopWebcamStream();
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') hardStop();
        };
        window.addEventListener('pagehide', hardStop);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            window.removeEventListener('pagehide', hardStop);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [stopWebcamStream]);
    
    // Preset Functions
    const applyPreset = (preset) => {
        // Apply all settings from the preset
        setSelectedFont(preset.settings.selectedFont);
        setSelectedColor(preset.settings.selectedColor);
        setInvertChromatic(preset.settings.invertChromatic);
        setChromaticIntensity(preset.settings.chromaticIntensity);
        setSelectedCharacterSet(preset.settings.selectedCharacterSet);
        setBrightness(preset.settings.brightness);
        setIsMirrored(preset.settings.isMirrored);
        setFlipCharacters(preset.settings.flipCharacters);
        setEffectiveMirroring(preset.settings.effectiveMirroring);
        setColorPickerValue(preset.settings.colorPickerValue);
        setResolutionScale(preset.settings.resolutionScale);
        setCanvasSize(preset.settings.canvasSize);
        setContrast(preset.settings.contrast);
        setIsRainEffect(preset.settings.isRainEffect);
        setRainSpeed(preset.settings.rainSpeed);
        setRainRandomness(preset.settings.rainRandomness);
        setRainColor(preset.settings.rainColor);
        setRainDropLength(preset.settings.rainDropLength);
        setRainOverlap(preset.settings.rainOverlap);
        setIsDistorted(preset.settings.isDistorted);
        setDistortionThreshold(preset.settings.distortionThreshold);
        setRainDistorted(preset.settings.rainDistorted);
        setSelectedFade(preset.settings.selectedFade);
        setFadeExtent(preset.settings.fadeExtent);
      
        // Set the current preset
        setSelectedPreset(preset.name);
      };
      
      
    const handlePresetSelection = (presetName) => {
        // Find the preset by name and apply it
        const preset = [...defaultPresets, ...customPresets].find(p => p.name === presetName);
        if (preset) applyPreset(preset);
    };

    
    const saveAsCustomPreset = (presetName) => {
        const newPreset = {
          name: presetName,
          settings: {
            selectedFont,
            selectedColor,
            invertChromatic,
            chromaticIntensity,
            selectedCharacterSet,
            brightness,
            rgbValues,
            isMirrored,
            flipCharacters,
            effectiveMirroring,
            colorPickerValue,
            resolutionScale,
            canvasSize,
            contrast,
            isRainEffect,
            rainSpeed,
            rainRandomness,
            rainColor,
            rainDropLength,
            rainOverlap,
            isDistorted,
            distortionThreshold,
            rainDistorted,
            selectedFade,
            fadeExtent,
          },
        };
        setCustomPresets([...customPresets, newPreset]);
      };
      

    const getColorStyle = (i, j, avg, pixelData, baseWidth, baseHeight, scaledWidth, scaledHeight) => {
        const alpha = avg / 255 * brightness;
        const centerX = scaledWidth / 2;
        const centerY = scaledHeight / 2;
    
        // Calculate normalized position (0 to 1) from the center
        const normPosX = (i - centerX) / centerX;
        const normPosY = (j - centerY) / centerY;
    
        // Calculate distance from the center
        const distance = Math.sqrt(normPosX * normPosX + normPosY * normPosY);
    
        // Normalize distance from 0 to 1
        const normDistance = distance / Math.sqrt(2);

        // Calculate distance from the center
        const distanceX = Math.abs(i - centerX);
        const distanceY = Math.abs(j - centerY);
    
        // Normalize distances
        const normDistanceX = distanceX / centerX;
        const normDistanceY = distanceY / centerY;

        // Calculate a fading factor based on distance
        const fadeFactor = Math.sqrt(normDistanceX * normDistanceX + normDistanceY * normDistanceY);

        // HSL to RGB algo (required to convert chromatic output to rgba to process the fade effect)
        const hslToRgb = (h, s, l) => {
            s /= 100;
            l /= 100;
            const k = (n) => (n + h / 30) % 12;
            const a = s * Math.min(l, 1 - l);
            const f = (n) => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
            return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
        };
        
        let rgba;
        switch (selectedColor) {
            case 'Chromatic':
                const angle = Math.atan2(j - centerY, i - centerX) + Math.PI;
                const hue = angle * (180 / Math.PI);
                let lightness = invertChromatic ? (75 + (50 - 75) * normDistance) : (100 - normDistance * chromaticIntensity);
                rgba = hslToRgb(hue, 100, lightness);
                rgba.push(alpha);
                break;
            case 'Chill':
                rgba = [0 + i * rgbValues.r, 255 - j * rgbValues.g, 155 + j * rgbValues.b, alpha];
                break;
            case 'Monologue':
                // Use fadeFactor to create a fading effect
                // Adjust RGB values to have different colors fading out from the center
                rgba = [
                    Math.floor((1 - fadeFactor) * rgbValues.r * 255),
                    Math.floor((1 - fadeFactor) * rgbValues.g * 255),
                    Math.floor((1 - fadeFactor) * rgbValues.b * 255),
                    alpha * (1 - fadeFactor)
                ];
                break;
            case 'White':
                rgba = [255, 255, 255, alpha];
                break;
            case 'Green':
                rgba = [0, 255, 0, alpha];
                break;
            case 'Custom':
                const customColor = parseColor(colorPickerValue); // You need to define parseColor
                rgba = [customColor.r, customColor.g, customColor.b, alpha];
                break;
            case 'Natural':
                rgba = [pixelData[0], pixelData[1], pixelData[2], alpha*2 ];
                break;
            default:
                rgba = [0, 0, 0, alpha];
                break;
        }
        if (selectedFade === 'Corner') {

            const edgeDistance = Math.min(distanceX, distanceY); // Calculate distance from the nearest edge
            const fadeFactor = Math.max(0, 1 - edgeDistance / (scaledWidth * fadeExtent / 200)); // Adjust fade based on fadeExtent
            rgba[3] *= fadeFactor; // Apply fade to the alpha channel
           
        
        } else if (selectedFade === 'Edge') {

            // Calculate the distance from the nearest edge
            const distanceFromNearestEdge = Math.min(
                i, // distance from left edge
                scaledWidth - i, // distance from right edge
                j, // distance from top edge
                scaledHeight - j, // distance from bottom edge
            
            );
            // Normalize the distance and calculate fade factor based on fadeExtent
            const normalizedDistance = distanceFromNearestEdge / Math.max(scaledWidth, scaledHeight);
            const fadeThreshold = fadeExtent / 100; // Convert percentage to a normalized value
            const fadeFactor = normalizedDistance < fadeThreshold ? normalizedDistance / fadeThreshold : 1;
        
            rgba[3] *= fadeFactor; // Apply fade to the alpha channel
        
        } else if (selectedFade === 'Radius'){
            // Calculate distance from the center
            const centerX = scaledWidth / 2;
            const centerY = scaledHeight / 2;
            const distX = i - centerX;
            const distY = j - centerY;
            const distanceFromCenter = Math.sqrt(distX * distX + distY * distY);
            const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY); // maximum possible distance from center
            const normalizedDistance = distanceFromCenter / maxDistance;

            // Calculate fade factor based on distance from center
            const centerFadeFactor = 1 - (normalizedDistance * (fadeExtent / 100));

            // Apply fade to the rgba values
            rgba[3] *= centerFadeFactor; // Modify only the alpha channel

        }   
            return `rgba(${rgba.join(',')})`;
        };
    
    // Convert CSS from colour wheel into RGBA
    function parseColor(colorString) {
        let r, g, b;
        if (colorString.startsWith('#')) {
            if (colorString.length === 7) { // #RRGGBB
                r = parseInt(colorString.slice(1, 3), 16);
                g = parseInt(colorString.slice(3, 5), 16);
                b = parseInt(colorString.slice(5, 7), 16);
            } else if (colorString.length === 4) { // #RGB
                r = parseInt(colorString[1] + colorString[1], 16);
                g = parseInt(colorString[2] + colorString[2], 16);
                b = parseInt(colorString[3] + colorString[3], 16);
            }
        }
        return { r, g, b, a: 1 }; // Alpha is set to 1 for full opacity
    }
    
    const updateRainDrops = (offScreenCanvas) => {
        if (!offScreenCanvas) return;
        // Move existing raindrops down
        rainDropsRef.current.forEach(drop => {
            drop.y += 1;
            if (drop.y > offScreenCanvas.height + drop.length) {
                // Remove the drop from the array when it moves off the canvas
                rainDropsRef.current = rainDropsRef.current.filter(d => d !== drop);
            }
        });
    
        // Add new raindrop at a random interval
        if (Math.random() < rainRandomness) { // Adjust this probability as needed
            rainDropsRef.current.push({
                x: Math.floor(Math.random() * offScreenCanvas.width),
                y: 0,
                length: rainDropLength // Adjust length as needed
            });
        }
    };
    
    const setupVideo = useCallback(async () => {
        const video = videoRef.current;
        if (video) {
            try {
                stopWebcamStream();
                const constraints = {
                    video: {
                        deviceId: selectedDevice ? { exact: selectedDevice } : undefined
                    }
                };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                mediaStreamRef.current = stream;
                video.srcObject = stream;
    
                video.onloadedmetadata = () => {
                    video.play().catch(e => {
                        console.error("Error attempting to play video:", e);
                    });
                };
    
                setIsReady(true);
            } catch (e) {
                console.error("Error setting up video stream:", e);
            }
        }
    }, [selectedDevice, stopWebcamStream]);

    // Update useEffect to re-run setupVideo when selectedDevice changes
    useEffect(() => {
        setupVideo();
    }, [setupVideo]);

    
    useEffect(() => {
        if (window.electron && window.electron.getUserMedia) {
            window.electron.getUserMedia().then((stream) => {
                const videoElement = videoRef.current;
                if (!videoElement) return;
                stopWebcamStream();
                mediaStreamRef.current = stream;
                videoElement.srcObject = stream;
                videoElement.play();
            }).catch(error => {
                console.error('Error accessing the webcam:', error);
            });
        }
    }, [stopWebcamStream]);
    const setup = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !offScreenCanvasRef.current) {
            return;
        }
    
        const scaledWidth = Math.round(baseWidth * resolutionScale);
        const scaledHeight = Math.round(baseHeight * resolutionScale);
    
        videoRef.current.width = scaledWidth;
        videoRef.current.height = scaledHeight;
        offScreenCanvasRef.current.width = scaledWidth;
        offScreenCanvasRef.current.height = scaledHeight;
        canvasRef.current.width = 960;
        canvasRef.current.height = 720;

        setIsReady(true);
    }, [resolutionScale]);
        

    // Recompute canvas dimensions only when resolution changes.
    useEffect(() => {
        setup();
    }, [setup]);

    const draw = (loopToken) => {
        if (loopToken !== drawLoopTokenRef.current) return;

        // URL monitor handles all cleanup - just draw normally
        const now = performance.now();
        const delta = lastRenderTime.current === null ? 0 : now - lastRenderTime.current;

        // Video and canvas setup (webcam referenced offscreen)
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const offScreenCanvas = offScreenCanvasRef.current;
        
        if (!video || !canvas || !offScreenCanvas) return;

        if (lastRenderTime.current !== null && delta > 0) {
            const fps = 1000 / delta;
            frameTimes.current.push({ time: now, fps }); // Store the time and FPS

            // Remove frame times older than 5 seconds
            while (frameTimes.current.length > 0 && now - frameTimes.current[0].time > averagingPeriod) {
                frameTimes.current.shift();
            }

            if (now - lastUpdate.current >= updateInterval) { // Update every 0.3 seconds
                // Calculate the average of the frame times
                const sumFps = frameTimes.current.reduce((sum, frame) => sum + frame.fps, 0);
                const average = sumFps / frameTimes.current.length;
                setAverageFps(average.toFixed(2)); // Set the average FPS, rounded to 2 decimal places

                lastUpdate.current = now; // Reset the last update time
            }
        }
        lastRenderTime.current = now;

        // ---- rain update paced by RAF time ----
        if (isRainEffect) {
            const rainIntervalMs = Math.max(1, rainSpeed);
            rainAccumMs.current += delta;
            // push new drops every ~rainSpeed ms; allow multiple if a frame stalls
            while (rainAccumMs.current >= rainIntervalMs) {
                updateRainDrops(offScreenCanvas);
                rainAccumMs.current -= rainIntervalMs;
            }
        }
    
        const offScreenCtx = offScreenCanvas.getContext('2d');
        const ctx = canvas.getContext('2d');
        if (!offScreenCtx || !ctx) return;

        // ---- prep draw state ----
        ctx.imageSmoothingEnabled = false;
        offScreenCtx.imageSmoothingEnabled = false;

        // compute cell size in *screen* pixels
        let w = canvas.width / offScreenCanvas.width;
        let h = canvas.height / offScreenCanvas.height;

        // Set font and alignment once per frame instead of per character
        ctx.font = `${Math.round(w)}px ${selectedFont}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Pre-compute values used in color calculations to avoid repeated computation
        const brightnessScale = brightness;
        const densityLength = density.length;
    
        // ---- draw video ONCE into offscreen with the final mirroring decision ----
        offScreenCtx.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
        offScreenCtx.save();
        const shouldMirrorVideo = (isMirrored !== flipCharacters) || effectiveMirroring || isMirrored;
        
        if (shouldMirrorVideo) {
            offScreenCtx.scale(-1, 1);
            offScreenCtx.translate(-offScreenCanvas.width, 0);
        }
        offScreenCtx.drawImage(video, 0, 0, offScreenCanvas.width, offScreenCanvas.height);
        offScreenCtx.restore();

        const videoPixels = offScreenCtx.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height).data;
    
        // Clear the main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const characterWidth = Math.round(w); // 'w' is the width of a character
        let offset;

        if (rainOverlap) {
            offset = characterWidth / 2; // Adjust for overlap
            if (flipCharacters) {
                offset = characterWidth / 1.33; // Adjust for flipped overlap
            }
        } else {
            offset = characterWidth / 1; // Default offset
            if (flipCharacters) {
                offset = characterWidth / 3.33; // Fine-tuned adjustment for flipped non-overlap
            }
        }

        if (isRainEffect) {
            ctx.fillStyle = rainColor; // Rain color for raindrops
            // Font already set above - no need to set again
            // densityLength already computed above

            rainDropsRef.current.forEach(drop => {
                for (let trail = 0; trail < rainDropLength; trail++) {
                    const fadeFactor = 1 - (trail / rainDropLength);
                    ctx.globalAlpha = fadeFactor; // Apply fading effect
                    const charIndex = Math.floor(Math.random() * densityLength);
                    const char = density.charAt(charIndex);
                    let xPos = drop.x * w;
                    let yPos = drop.y - trail;
                    if (rainDistorted) {
                        yPos += Math.random() * 15 - 7.5; // Distortion effect for static characters
                    }
                    // Adjust position if flipped
                    if (flipCharacters) {
                        xPos = canvas.width - xPos - offset; // Flip and adjust position
                    } else {
                        xPos += offset; // Adjust position for unflipped state
                    }
    
                    if (yPos >= 0 && yPos < offScreenCanvas.height) {
                        ctx.fillText(char, xPos, yPos * h);
                    }
                }
            });
            ctx.globalAlpha = 1; // Reset global alpha
        }

        // Flip characters if required
        if (flipCharacters) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-canvas.width, 0);
        }
    
        for (let j = 0; j < offScreenCanvas.height; j++) {
            for (let i = 0; i < offScreenCanvas.width; i++) {
                const pixelIndex = (i + j * offScreenCanvas.width) * 4;
                const avg = (videoPixels[pixelIndex] + videoPixels[pixelIndex + 1] + videoPixels[pixelIndex + 2]) / 3;
                const pixelData = [
                    videoPixels[pixelIndex],     // R
                    videoPixels[pixelIndex + 1], // G
                    videoPixels[pixelIndex + 2], // B
                    videoPixels[pixelIndex + 3]  // A
                ];

                const charIndex = brightnessToIndex[Math.floor(avg)];
    
                let x = i * w + w * 0.5;
                let y = j * h + h * 0.5;
                
                // Optimized inline color calculation for better performance
                const alpha = avg / 255 * brightnessScale;
                let colorStyle;
                
                if (selectedColor === 'Green') {
                    colorStyle = `rgba(0,255,0,${alpha})`;
                } else if (selectedColor === 'White') {
                    colorStyle = `rgba(255,255,255,${alpha})`;
                } else {
                    // For complex colors, fall back to original function
                    colorStyle = getColorStyle(i, j, avg, pixelData, baseWidth, baseHeight, offScreenCanvas.width, offScreenCanvas.height);
                }
                
                ctx.fillStyle = colorStyle;
                
                const char = density.charAt(charIndex % densityLength);
                let yDistortion = 0;
                if (isDistorted && avg < distortionThreshold) {
                    yDistortion = Math.random() * 15 - 7.5;
                }
                
                ctx.fillText(char, x, y + yDistortion);
            }
        }
    
        if (flipCharacters) {
            ctx.restore();
        }
    
        if (loopToken === drawLoopTokenRef.current) {
            animationFrameId.current = requestAnimationFrame(() => draw(loopToken));
        }
    };
    

    // Loading presets
    useEffect(() => {
        const savedCustomPresets = localStorage.getItem('customPresets');
        if (savedCustomPresets) {
          setCustomPresets(JSON.parse(savedCustomPresets));
        }
      }, []);

    useEffect(() => {
        localStorage.setItem('customPresets', JSON.stringify(customPresets));
    }, [customPresets]);
      
    // Setup and drawing effects (separated from webcam management)
    useEffect(() => {
        // Invalidate any previous loop before starting a new one.
        drawLoopTokenRef.current += 1;
        const loopToken = drawLoopTokenRef.current;
        const timeoutId = hideMenuTimeout.current;

        draw(loopToken);

        return () => {
            // Clear menu timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }

            // Invalidate current loop to stop any in-flight RAF callback chain.
            if (drawLoopTokenRef.current === loopToken) {
                drawLoopTokenRef.current += 1;
            }
            
        };

    // Add dependencies to the useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady, selectedFont, selectedColor, selectedCharacterSet, 
        brightness, colorPickerValue, rgbValues, effectiveMirroring, 
        flipCharacters, isMirrored, resolutionScale, isRainEffect, 
        rainSpeed, rainRandomness, rainColor, rainDropLength,
        rainOverlap, isDistorted, distortionThreshold, rainDistorted, 
        invertChromatic, chromaticIntensity, selectedFade, fadeExtent]);
    
        
    return (
        <div className="webcam-container">

            <div className={`settings-container ${hideUI ? 'hide' : ''}`}>
                <div className={`settings-icon ${hideUI ? 'hide' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
                    </svg>
                </div>

                <div className={`settings-menu ${activeSubMenu ? 'expanded active' : ''}`}>

                    {/* Main Menu */}
                    <div className={`main-menu ${activeSubMenu ? 'inactive' : 'active'}`} style={{ height: activeSubMenu ? '0' : 'auto', overflow: 'hidden', transition: 'height 0.5s ease' }}>
                        
                        <div className="menu-item" onClick={() => handleMenuClick('Webcam')}>
                            <h4>⇐ Camera</h4>
                        </div>
                        <div className="menu-item" onClick={() => handleMenuClick('Presets')}>
                            <h4>⇐ Presets</h4>
                        </div>
                        <div className="menu-item" onClick={() => handleMenuClick('Text')}>
                            <h4>⇐ Text</h4>
                        </div>
                        <div className="menu-item" onClick={() => handleMenuClick('Color')}>
                            <h4>⇐ Colour</h4>
                        </div>
                        <div className="menu-item" onClick={() => handleMenuClick('Canvas')}>
                            <h4>⇐ Canvas</h4>
                        </div>
                        <div className="menu-item" onClick={() => handleMenuClick('Effects')}>
                            <h4>⇐ Effects</h4>
                        </div>
                        <div className="menu-item" onClick={handleFullscreenToggle}>
                            <h4>⇐ {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</h4>
                        </div>
                        <div className="menu-item">
                            <label htmlFor="hideUIToggle">
                                <input 
                                    type="checkbox" 
                                    id="hideUIToggle" 
                                    checked={hideUI} 
                                    onChange={(e) => setHideUI(e.target.checked)} 
                                />
                                <span className="menu-title"><h4>Hide UI</h4></span>
                            </label>
                        </div>
                    </div>
                    {/* Webcam Settings */}
                    <div className={`submenu webcam-settings ${activeSubMenu === 'Webcam' ? 'show' : ''}`}>
                        <WebcamSelector selectedDevice={selectedDevice} setSelectedDevice={setSelectedDevice} />
                        <div className="submenu-back" onClick={handleBackClick}></div>
                    </div>
                    {/* Text Settings */}
                    <div className={`submenu text-settings ${activeSubMenu === 'Text' ? 'show' : ''}`}>

                        {/* Font Selection */}
                        <div>
                            <label htmlFor="fontSelect">Font: </label>
                            <select id="fontSelect" value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
                                <option value="MatrixCode">Matrix Code</option>
                                <option value="Monospace">Monospace</option>
                                <option value="Wingdings">Wingdings</option>
                                <option value="DatDot">DatDot</option>

                            </select>
                        </div>
                        {/* Character Set Selection */}
                        <div>
                            <label htmlFor="characterSetSelect">Characters: </label>
                            <select id="characterSetSelect" value={selectedCharacterSet} onChange={(e) => setSelectedCharacterSet(e.target.value)}>
                                {Object.keys(CHARACTER_SETS).map(key => (
                                    <option key={key} value={key}>{key}</option>
                                ))}
                            </select>
                        </div>
                        <div className="submenu-back" onClick={handleBackClick}></div>
                    </div>
                    
                    {/* Colour Settings */}
                    <div className={`submenu color-settings ${activeSubMenu === 'Color' ? 'show' : ''}`}>
                        {/* Color Scheme Selection */}
                        <div>
                            <label htmlFor="colorSelect">Color: </label>
                            <select id="colorSelect" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                                <option value="Chromatic">Chromatic</option>
                                <option value="Chill">Chill</option>
                                <option value="Monologue">Monologue</option>
                                <option value="Natural">Natural</option>
                                <option value="White">Monochrome</option>
                                <option value="Green">Green</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </div>
                        {/* Invert Chormatic hue intensity */}
                        {selectedColor === 'Chromatic' && (
                            <div>
                                <label htmlFor="invertChromaticToggle">Center: </label>
                                <input 
                                    type="checkbox" 
                                    id="invertChromaticToggle" 
                                    checked={invertChromatic} 
                                    onChange={(e) => setInvertChromatic(e.target.checked)} 
                                />
                            </div>
                        )}
                        {/* Adjust Chromatic intensity slider */}
                        {selectedColor === 'Chromatic' && (
                        <div>
                            <label htmlFor="intensitySlider">Intensity: </label>
                            <input 
                            type="range" 
                            id="intensitySlider" 
                            min="1" 
                            max="100" 
                            value={chromaticIntensity} 
                            onChange={(e) => setChromaticIntensity(Number(e.target.value))}
                            />
                        </div>
                        )}
                        {/* Select custom colour */}
                        {selectedColor === 'Custom' && (
                            <div>
                                <input 
                                    type="color" 
                                    value={colorPickerValue} 
                                    onChange={(e) => setColorPickerValue(e.target.value)} 
                                />
                            </div>
                        )}
                        {/* Brightness Slider */}
                        <div>
                            <label htmlFor="brightnessSlider">Brightness: </label>
                            <input 
                                type="range" 
                                id="brightnessSlider" 
                                min="0" 
                                max="2" 
                                step="0.1" 
                                value={brightness} 
                                onChange={(e) => setBrightness(parseFloat(e.target.value))} 
                            />
                        </div>
                        {/* Contrast Slider */}
                        <div>
                            <label htmlFor="contrastSlider">Contrast: </label>
                            <input 
                                type="range" 
                                id="contrastSlider" 
                                min="0" 
                                max="200" 
                                value={contrast} 
                                onChange={(e) => setContrast(e.target.value)} 
                            />
                        </div>
                        {/* Submenu-back button */}
                        <div className={`submenu-back ${activeSubMenu ? 'show' : ''}`} onClick={handleBackClick}></div>
                    </div>
                        
                        
                    {/* Canvas Settings */}
                    <div className={`submenu canvas-settings ${activeSubMenu === 'Canvas' ? 'show' : ''}`}>
                        {/* Fade Selection */}
                        <div>
                            <label htmlFor="fadeTypeSelect">Fade Type: </label>
                            <select id="fadeTypeSelect" value={selectedFade} onChange={(e) => setSelectedFade(e.target.value)}>
                                <option value="None">None</option>
                                <option value="Edge">Edge</option>
                                <option value="Corner">Corner</option>
                                <option value="Radius">Radius</option>

                            </select>
                        </div>
                        {/* Fade Slider */}
                        {selectedFade !== 'None' && (
                        <div>
                            <label htmlFor="fadeExtentSlider">Fade Extent: </label>
                            <input 
                                type="range" 
                                id="fadeExtentSlider" 
                                min="1" 
                                max="200" 
                                value={fadeExtent} 
                                onChange={(e) => setFadeExtent(Number(e.target.value))}
                            />
                        </div>
                        )}
                        {/* Mirror Toggle */}
                        <div>
                            <label htmlFor="mirrorToggle">Mirror: </label>
                            <input 
                                type="checkbox" 
                                id="mirrorToggle" 
                                checked={!isMirrored} 
                                onChange={(e) => setIsMirrored(!e.target.checked)} 
                            />
                        </div>
                        {/* Flip Toggle */}
                        <div>
                            <label htmlFor="flipCharactersToggle">Flip: </label>
                            <input 
                                type="checkbox" 
                                id="flipCharactersToggle" 
                                checked={flipCharacters} 
                                onChange={(e) => {
                                    setFlipCharacters(e.target.checked);
                                    setEffectiveMirroring(e.target.checked ? !isMirrored : isMirrored); // Toggle effective mirroring
                                }} 
                            />
                        </div>
                        {/* Resolution Toggle */}
                        <div>
                            <label htmlFor="resolutionSlider">Resolution: </label>
                            <input 
                                type="range" 
                                id="resolutionSlider" 
                                min="0.5" 
                                max="2" 
                                step="0.1" 
                                value={resolutionScale} 
                                onChange={(e) => setResolutionScale(parseFloat(e.target.value))} 
                            />
                        </div>
                        {/* Canvas Slider */}
                        <div>
                            <label htmlFor="canvasSizeSlider">Scale: </label>
                            <input 
                                type="range" 
                                id="canvasSizeSlider" 
                                min="0.5" 
                                max="2" 
                                step="0.1" 
                                value={canvasSize.width / 960} // Using width for scaling factor
                                onChange={(e) => {
                                    const scale = parseFloat(e.target.value);
                                    setCanvasSize({ width: 960 * scale, height: 720 * scale });
                                }} 
                            />
                        </div>
                        {/* Submenu-back button */}
                        <div className="submenu-back" onClick={handleBackClick}></div>
                    </div>  

                    {/* Effects Settings */}
                    <div className={`submenu effects-settings ${activeSubMenu === 'Effects' ? 'show' : ''}`}>
                        
                        {/* Distrotion Toggle */}
                        <div>
                            <label htmlFor="distortionToggle">Distort: </label>
                            <input 
                                type="checkbox" 
                                id="distortionToggle" 
                                checked={isDistorted} 
                                onChange={(e) => setIsDistorted(e.target.checked)} 
                            />
                        </div>
                        {/* Distortion Threshold Slideer */}
                        {isDistorted && (
                        <div>
                            <label htmlFor="distortionThresholdSlider">Distortion Threshold: </label>
                            <input 
                            type="range" 
                            id="distortionThresholdSlider" 
                            min="0" 
                            max="255" 
                            value={distortionThreshold} 
                            onChange={(e) => setDistortionThreshold(Number(e.target.value))} 
                            />
                        </div>
                        )}
                        {/* Rain Effect Toggle */}
                        <div>
                            <label htmlFor="rainEffectToggle">Rain: </label>
                            <input 
                                type="checkbox" 
                                id="rainEffectToggle" 
                                checked={isRainEffect} 
                                onChange={(e) => setIsRainEffect(e.target.checked)} 
                            />
                        </div>
                        {/* Rain Distorted Toggle */}
                        {isRainEffect && (
                            <div>
                                <label htmlFor="rainDistortedToggle">Rain Distort: </label>
                                <input 
                                    type="checkbox" 
                                    id="rainDistortedToggle" 
                                    checked={rainDistorted} 
                                    onChange={(e) => setRainDistorted(e.target.checked)} 
                                />
                            </div>
                        )}
                        {/* Rain Overlap Toggle */}
                        {isRainEffect && (
                            <div>
                                <label htmlFor="rainOverlapToggle">Overlap: </label>
                                <input 
                                    type="checkbox" 
                                    id="rainOverlapToggle" 
                                    checked={rainOverlap} 
                                    onChange={(e) => setRainOverlap(e.target.checked)} 
                                />
                            </div>
                        )}
                        {/* Rain Interval Slider - Conditionally rendered */}
                        {isRainEffect && (
                            <div>
                                <label htmlFor="rainSpeedSlider">Speed: </label>
                                <input 
                                    type="range" 
                                    id="rainSpeedSlider" 
                                    min="1"
                                    max="150" 
                                    value={Math.max(1, 151 - rainSpeed)} // Invert for intuitive control (right = faster)
                                    onChange={(e) => setRainSpeed(Math.max(1, 151 - Number(e.target.value)))}
                                />
                            </div>
                        )}
                        {/* Rain Randomness Slider - Conditionally rendered */}
                        {isRainEffect && (
                            <div>
                                <label htmlFor="rainRandomnessSlider">Frequency: </label>
                                <input 
                                    type="range" 
                                    id="rainRandomnessSlider" 
                                    min="0" 
                                    max="1" 
                                    step="0.01" 
                                    value={rainRandomness} 
                                    onChange={(e) => setRainRandomness(Number(e.target.value))}
                                />
                            </div>
                        )}
                        {/* Rain Length Slider - Conditionally rendered */}
                        {isRainEffect && (
                            <div>
                                <label htmlFor="rainDropLengthSlider">Length: </label>
                                <input 
                                    type="range" 
                                    id="rainDropLengthSlider" 
                                    min="3"  // Minimum length
                                    max="100" // Maximum length
                                    value={rainDropLength} 
                                    onChange={(e) => setRainDropLength(Number(e.target.value))} 
                                />
                            </div>
                        )}
                        {/* Rain Colour Wheel - Conditionally rendered */}
                        {isRainEffect && (
                            <div>
                                <label htmlFor="rainColorPicker">Rain Color: </label>
                                <input 
                                    type="color" 
                                    id="rainColorPicker" 
                                    value={rainColor} 
                                    onChange={(e) => setRainColor(e.target.value)} 
                                />
                            </div>
                        )}
                        {/* Submenu-back button */}
                        <div className="submenu-back" onClick={handleBackClick}></div>
                    </div>

                    {/* Presets Submenu */}
                    <div className={`submenu presets-settings ${activeSubMenu === 'Presets' ? 'show' : ''}`}>
                    <div>
                        <label htmlFor="presetSelect">Choose Preset: </label>
                        <select id="presetSelect" value={selectedPreset} onChange={(e) => handlePresetSelection(e.target.value)}>
                        <option value="">--Select a Preset--</option>
                        {defaultPresets.concat(customPresets).map(preset => (
                            <option key={preset.name} value={preset.name}>{preset.name}</option>
                        ))}
                        </select>
                    </div>
                    <div>
                        <button onClick={() => saveAsCustomPreset(prompt("Enter preset name"))}>Save Current Settings as Preset</button>
                    </div>
                        <div className="submenu-back" onClick={handleBackClick}></div>
                    </div>
                </div>
            </div>

            <video 
                ref={videoRef} 
                style={{ display: 'none' }} 
                className={isMirrored ? 'mirrored' : ''}>
            </video>
            <canvas 
                ref={canvasRef} 
                style={{ 
                    width: `${canvasSize.width}px`, 
                    height: `${canvasSize.height}px`,
                    filter: `contrast(${contrast}%)`
                }}>
            </canvas>
            
            <canvas ref={offScreenCanvasRef} style={{ display: 'none' }}></canvas>

            <div className="fps-counter" style={{ display: hideUI ? 'none' : 'block' }}>
                FPS: {averageFps}
            </div>

            <div className="buy-me-a-coffee" style={{ display: hideUI ? 'none' : 'flex' }}>
                <a href="https://buymeacoffee.com/matt.banham" target="_blank" rel="noopener noreferrer">
                    <button>Buy Me a Coffee</button>
                </a>
            </div>
        </div>
    );
};

export default MatrixCam;
