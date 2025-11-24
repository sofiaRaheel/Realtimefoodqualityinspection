import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Play, Pause, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from './ThemeContext';

interface Detection {
  timestamp: string;
  status: 'fresh' | 'slightly-aged' | 'spoiled';
  confidence: number;
  metrics: {
    color: number;
    texture: number;
    freshness: number;
  };
}

export function RealtimePage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentDetection, setCurrentDetection] = useState<Detection | null>(null);
  const [detectionHistory, setDetectionHistory] = useState<Detection[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { isDark } = useTheme();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1280, height: 720 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsDetecting(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
      }
    }
  };

  const runDetection = () => {
    captureFrame();
    
    // Simulate AI detection with random results
    const statuses: ('fresh' | 'slightly-aged' | 'spoiled')[] = ['fresh', 'fresh', 'slightly-aged', 'spoiled'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const detection: Detection = {
      timestamp: new Date().toLocaleTimeString(),
      status: randomStatus,
      confidence: 85 + Math.random() * 14,
      metrics: {
        color: 70 + Math.random() * 30,
        texture: 75 + Math.random() * 25,
        freshness: randomStatus === 'fresh' ? 85 + Math.random() * 15 : 
                   randomStatus === 'slightly-aged' ? 50 + Math.random() * 30 :
                   20 + Math.random() * 30
      }
    };

    setCurrentDetection(detection);
    setDetectionHistory(prev => [...prev.slice(-9), detection]);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDetecting && isCameraActive) {
      interval = setInterval(runDetection, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDetecting, isCameraActive]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    if (isDark) {
      switch (status) {
        case 'fresh': return 'text-white bg-neutral-800 border-neutral-700';
        case 'slightly-aged': return 'text-neutral-300 bg-neutral-800 border-neutral-600';
        case 'spoiled': return 'text-neutral-400 bg-neutral-900 border-neutral-700';
        default: return 'text-neutral-400 bg-neutral-800 border-neutral-700';
      }
    } else {
      switch (status) {
        case 'fresh': return 'text-neutral-900 bg-neutral-100 border-neutral-300';
        case 'slightly-aged': return 'text-neutral-700 bg-neutral-50 border-neutral-200';
        case 'spoiled': return 'text-neutral-600 bg-white border-neutral-200';
        default: return 'text-neutral-700 bg-neutral-100 border-neutral-200';
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fresh': return <CheckCircle2 className="w-6 h-6" />;
      case 'slightly-aged': return <Clock className="w-6 h-6" />;
      case 'spoiled': return <AlertCircle className="w-6 h-6" />;
    }
  };

  const freshnessHistory = detectionHistory.map((d, i) => ({
    time: i + 1,
    freshness: d.metrics.freshness
  }));

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-neutral-900 dark:text-white mb-4 transition-colors">Real-time Detection</h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto transition-colors">
            Access your camera to perform live food quality analysis. Our AI continuously monitors 
            the video feed and provides instant freshness assessments.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors">
              <div className="relative bg-neutral-900 aspect-video flex items-center justify-center">
                {isCameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {isDetecting && (
                      <div className="absolute top-4 left-4 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full flex items-center gap-2 animate-pulse transition-colors">
                        <div className="w-2 h-2 bg-white dark:bg-neutral-900 rounded-full"></div>
                        <span className="text-sm">Detecting</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400">Camera is off</p>
                  </div>
                )}
              </div>

              <div className="p-6 flex items-center justify-center gap-4">
                {!isCameraActive ? (
                  <button
                    onClick={startCamera}
                    className="px-8 py-3 bg-neutral-900 dark:bg-white hover:bg-black dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Start Camera</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsDetecting(!isDetecting)}
                      className={`px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg ${
                        isDetecting
                          ? 'bg-neutral-600 dark:bg-neutral-400 hover:bg-neutral-700 dark:hover:bg-neutral-300 text-white dark:text-neutral-900'
                          : 'bg-neutral-900 dark:bg-white hover:bg-black dark:hover:bg-neutral-100 text-white dark:text-neutral-900'
                      }`}
                    >
                      {isDetecting ? (
                        <>
                          <Pause className="w-5 h-5" />
                          <span>Pause Detection</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          <span>Start Detection</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={stopCamera}
                      className="px-8 py-3 bg-neutral-700 dark:bg-neutral-600 hover:bg-neutral-800 dark:hover:bg-neutral-500 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg"
                    >
                      <CameraOff className="w-5 h-5" />
                      <span>Stop Camera</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Freshness History Chart */}
            {detectionHistory.length > 0 && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors">
                <h3 className="text-neutral-900 dark:text-white mb-4 transition-colors">Freshness Score History</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={freshnessHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#404040' : '#e5e5e5'} />
                    <XAxis dataKey="time" stroke={isDark ? '#a3a3a3' : '#737373'} />
                    <YAxis domain={[0, 100]} stroke={isDark ? '#a3a3a3' : '#737373'} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: `1px solid ${isDark ? '#404040' : '#e5e5e5'}`,
                        backgroundColor: isDark ? '#171717' : '#ffffff',
                        color: isDark ? '#ffffff' : '#000000'
                      }} 
                    />
                    <Line type="monotone" dataKey="freshness" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Detection Results Panel */}
          <div className="space-y-6">
            {/* Current Detection */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors">
              <div className="p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
                <h3 className="text-neutral-900 dark:text-white transition-colors">Current Detection</h3>
              </div>

              {currentDetection ? (
                <div className="p-6 space-y-6">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${getStatusColor(currentDetection.status)} transition-colors`}>
                    {getStatusIcon(currentDetection.status)}
                    <div className="flex-1">
                      <div className="capitalize">{currentDetection.status.replace('-', ' ')}</div>
                      <div className="text-sm opacity-80">{currentDetection.timestamp}</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-neutral-600 dark:text-neutral-400 text-sm transition-colors">Confidence</span>
                      <span className="text-neutral-900 dark:text-white transition-colors">{currentDetection.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors">
                      <div 
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                        style={{ width: `${currentDetection.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-neutral-600 dark:text-neutral-400 text-sm transition-colors">Color Quality</span>
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm transition-colors">{currentDetection.metrics.color.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors">
                        <div 
                          className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all"
                          style={{ width: `${currentDetection.metrics.color}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-neutral-600 dark:text-neutral-400 text-sm transition-colors">Texture Quality</span>
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm transition-colors">{currentDetection.metrics.texture.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors">
                        <div 
                          className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all"
                          style={{ width: `${currentDetection.metrics.texture}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-neutral-600 dark:text-neutral-400 text-sm transition-colors">Freshness Score</span>
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm transition-colors">{currentDetection.metrics.freshness.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            currentDetection.metrics.freshness > 70 ? 'bg-green-500 dark:bg-green-400' :
                            currentDetection.metrics.freshness > 40 ? 'bg-amber-500 dark:bg-amber-400' :
                            'bg-red-500 dark:bg-red-400'
                          }`}
                          style={{ width: `${currentDetection.metrics.freshness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                    <AlertCircle className="w-8 h-8 text-neutral-400 dark:text-neutral-600 transition-colors" />
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 transition-colors">No detection yet</p>
                  <p className="text-neutral-400 dark:text-neutral-600 text-sm mt-1 transition-colors">Start camera and detection to see results</p>
                </div>
              )}
            </div>

            {/* Detection Stats */}
            {detectionHistory.length > 0 && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors">
                <h3 className="text-neutral-900 dark:text-white mb-4 transition-colors">Session Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800 transition-colors">
                    <span className="text-neutral-600 dark:text-neutral-400 transition-colors">Total Scans</span>
                    <span className="text-neutral-900 dark:text-white transition-colors">{detectionHistory.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full transition-colors"></div>
                      <span className="text-neutral-600 dark:text-neutral-400 transition-colors">Fresh</span>
                    </div>
                    <span className="text-neutral-900 dark:text-white transition-colors">
                      {detectionHistory.filter(d => d.status === 'fresh').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 dark:bg-amber-400 rounded-full transition-colors"></div>
                      <span className="text-neutral-600 dark:text-neutral-400 transition-colors">Slightly Aged</span>
                    </div>
                    <span className="text-neutral-900 dark:text-white transition-colors">
                      {detectionHistory.filter(d => d.status === 'slightly-aged').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full transition-colors"></div>
                      <span className="text-neutral-600 dark:text-neutral-400 transition-colors">Spoiled</span>
                    </div>
                    <span className="text-neutral-900 dark:text-white transition-colors">
                      {detectionHistory.filter(d => d.status === 'spoiled').length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}