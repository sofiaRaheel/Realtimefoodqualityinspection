import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, FolderOpen, X, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTheme } from './ThemeContext';

interface AnalysisResult {
  id: string;
  fileName: string;
  preview: string;
  status: 'fresh' | 'slightly-aged' | 'spoiled';
  confidence: number;
  details: {
    color: number;
    texture: number;
    freshness: number;
  };
}

export function TestingPage() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { isDark } = useTheme();

  const analyzeImages = async (files: FileList) => {
    setIsAnalyzing(true);
    const newResults: AnalysisResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const preview = URL.createObjectURL(file);

      // Simulate AI analysis with random results
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const statuses: ('fresh' | 'slightly-aged' | 'spoiled')[] = ['fresh', 'fresh', 'fresh', 'slightly-aged', 'spoiled'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      newResults.push({
        id: `${Date.now()}-${i}`,
        fileName: file.name,
        preview,
        status: randomStatus,
        confidence: 85 + Math.random() * 14,
        details: {
          color: 70 + Math.random() * 30,
          texture: 75 + Math.random() * 25,
          freshness: randomStatus === 'fresh' ? 85 + Math.random() * 15 : 
                     randomStatus === 'slightly-aged' ? 50 + Math.random() * 30 :
                     20 + Math.random() * 30
        }
      });
    }

    setResults(prev => [...prev, ...newResults]);
    setIsAnalyzing(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      analyzeImages(files);
    }
  };

  const removeResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const clearAll = () => {
    setResults([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh': return 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'slightly-aged': return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'spoiled': return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'text-neutral-700 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fresh': return <CheckCircle2 className="w-5 h-5" />;
      case 'slightly-aged': return <Clock className="w-5 h-5" />;
      case 'spoiled': return <AlertCircle className="w-5 h-5" />;
    }
  };

  // Calculate summary statistics
  const summaryData = [
    { name: 'Fresh', value: results.filter(r => r.status === 'fresh').length, color: isDark ? '#ffffff' : '#000000' },
    { name: 'Slightly Aged', value: results.filter(r => r.status === 'slightly-aged').length, color: isDark ? '#737373' : '#525252' },
    { name: 'Spoiled', value: results.filter(r => r.status === 'spoiled').length, color: isDark ? '#404040' : '#a3a3a3' }
  ].filter(d => d.value > 0);

  const averageMetrics = results.length > 0 ? {
    color: results.reduce((sum, r) => sum + r.details.color, 0) / results.length,
    texture: results.reduce((sum, r) => sum + r.details.texture, 0) / results.length,
    freshness: results.reduce((sum, r) => sum + r.details.freshness, 0) / results.length,
    confidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length
  } : null;

  const metricsData = averageMetrics ? [
    { metric: 'Color', score: averageMetrics.color },
    { metric: 'Texture', score: averageMetrics.texture },
    { metric: 'Freshness', score: averageMetrics.freshness },
    { metric: 'Confidence', score: averageMetrics.confidence }
  ] : [];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-neutral-900 dark:text-white mb-4 transition-colors">Image Testing Lab</h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto transition-colors">
            Upload single images or entire folders to analyze food quality. Our AI will assess freshness, 
            detect spoilage indicators, and provide detailed quality metrics.
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={folderInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-neutral-900 dark:bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-8 h-8 text-white dark:text-neutral-900" />
              </div>
              <div>
                <h3 className="text-neutral-900 dark:text-white mb-2 transition-colors">Upload Images</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm transition-colors">Select one or multiple images to analyze</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => folderInputRef.current?.click()}
            disabled={isAnalyzing}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-neutral-900 dark:bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderOpen className="w-8 h-8 text-white dark:text-neutral-900" />
              </div>
              <div>
                <h3 className="text-neutral-900 dark:text-white mb-2 transition-colors">Upload Folder</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm transition-colors">Process entire folders of images at once</p>
              </div>
            </div>
          </button>
        </div>

        {isAnalyzing && (
          <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 mb-8 transition-colors">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-900 dark:border-white"></div>
              <span className="text-neutral-900 dark:text-white transition-colors">Analyzing images with AI...</span>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {results.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-neutral-900 dark:text-white transition-colors">Analysis Results ({results.length} images)</h2>
              <button
                onClick={clearAll}
                className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Statistics Graphs */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Distribution Pie Chart */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors">
                <h3 className="text-neutral-900 dark:text-white mb-4 transition-colors">Quality Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={summaryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {summaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: `1px solid ${isDark ? '#404040' : '#e5e5e5'}`,
                        backgroundColor: isDark ? '#171717' : '#ffffff',
                        color: isDark ? '#ffffff' : '#000000'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Average Metrics Bar Chart */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors">
                <h3 className="text-neutral-900 dark:text-white mb-4 transition-colors">Average Quality Metrics</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#404040' : '#e5e5e5'} />
                    <XAxis dataKey="metric" stroke={isDark ? '#a3a3a3' : '#737373'} />
                    <YAxis domain={[0, 100]} stroke={isDark ? '#a3a3a3' : '#737373'} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: `1px solid ${isDark ? '#404040' : '#e5e5e5'}`,
                        backgroundColor: isDark ? '#171717' : '#ffffff',
                        color: isDark ? '#ffffff' : '#000000'
                      }} 
                    />
                    <Bar dataKey="score" fill={isDark ? '#ffffff' : '#000000'} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div key={result.id} className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden group transition-colors">
                  <div className="relative">
                    <img 
                      src={result.preview} 
                      alt={result.fileName}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => removeResult(result.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-neutral-900 dark:bg-white hover:bg-black dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate mb-3 transition-colors">{result.fileName}</p>
                    
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border mb-4 ${getStatusColor(result.status)} transition-colors`}>
                      {getStatusIcon(result.status)}
                      <span className="capitalize">{result.status.replace('-', ' ')}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400 transition-colors">Confidence:</span>
                        <span className="text-neutral-900 dark:text-white transition-colors">{result.confidence.toFixed(1)}%</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 transition-colors">
                          <span>Color Quality</span>
                          <span>{result.details.color.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors">
                          <div 
                            className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all"
                            style={{ width: `${result.details.color}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 transition-colors">
                          <span>Texture Quality</span>
                          <span>{result.details.texture.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors">
                          <div 
                            className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all"
                            style={{ width: `${result.details.texture}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 transition-colors">
                          <span>Freshness Score</span>
                          <span>{result.details.freshness.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              result.details.freshness > 70 ? 'bg-green-500 dark:bg-green-400' :
                              result.details.freshness > 40 ? 'bg-amber-500 dark:bg-amber-400' :
                              'bg-red-500 dark:bg-red-400'
                            }`}
                            style={{ width: `${result.details.freshness}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {results.length === 0 && !isAnalyzing && (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-12 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 transition-colors">
            <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
              <Upload className="w-10 h-10 text-neutral-400 dark:text-neutral-600 transition-colors" />
            </div>
            <h3 className="text-neutral-900 dark:text-white mb-2 transition-colors">No images uploaded yet</h3>
            <p className="text-neutral-600 dark:text-neutral-400 transition-colors">Upload images or folders to start analyzing food quality</p>
          </div>
        )}
      </div>
    </div>
  );
}