import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sparkles, CheckCircle, AlertTriangle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTheme } from './ThemeContext';

const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1682406779763-6859b993b279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NjM5ODE1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Fresh Produce Analysis'
  },
  {
    url: 'https://images.unsplash.com/photo-1609819390597-783ccdfc2529?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwaW5zcGVjdGlvbiUyMGxhYm9yYXRvcnl8ZW58MXx8fHwxNzYzOTgxNTA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Laboratory Testing'
  },
  {
    url: 'https://images.unsplash.com/photo-1705928629040-c701a1e70531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwcHJvZHVjZSUyMG1hcmtldHxlbnwxfHx8fDE3NjM5ODE1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Quality Assurance'
  },
  {
    url: 'https://images.unsplash.com/photo-1763716231851-97671bf59d5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcXVhbGl0eSUyMHRlc3Rpbmd8ZW58MXx8fHwxNzYzOTgxNTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Real-time Detection'
  }
];

const qualityData = [
  { month: 'Jan', fresh: 89, spoiled: 11 },
  { month: 'Feb', fresh: 92, spoiled: 8 },
  { month: 'Mar', fresh: 88, spoiled: 12 },
  { month: 'Apr', fresh: 94, spoiled: 6 },
  { month: 'May', fresh: 91, spoiled: 9 },
  { month: 'Jun', fresh: 95, spoiled: 5 }
];

const detectionData = [
  { name: 'Fresh', value: 2840, color: '#10b981' },
  { name: 'Slightly Aged', value: 1240, color: '#f59e0b' },
  { name: 'Spoiled', value: 320, color: '#ef4444' }
];

const accuracyData = [
  { category: 'Fruits', accuracy: 96 },
  { category: 'Vegetables', accuracy: 94 },
  { category: 'Meat', accuracy: 98 },
  { category: 'Dairy', accuracy: 95 },
  { category: 'Bakery', accuracy: 92 }
];

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-900 dark:text-neutral-100 mb-6 transition-colors">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">AI-Powered Detection System</span>
        </div>
        
        <h1 className="text-neutral-900 dark:text-white mb-6 transition-colors bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-300 dark:to-white bg-clip-text text-transparent">
          Food Quality Inspection
        </h1>
        
        <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-4 transition-colors">
          Harness the power of advanced artificial intelligence to detect food freshness and quality in real-time. 
          Our cutting-edge computer vision technology analyzes visual indicators to determine spoilage, ensuring 
          food safety and reducing waste across the supply chain.
        </p>
        
        <div className="flex items-center justify-center gap-8 mt-8">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
            <span className="text-neutral-700 dark:text-neutral-300 transition-colors">98% Accuracy</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            <span className="text-neutral-700 dark:text-neutral-300 transition-colors">Real-time Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <span className="text-neutral-700 dark:text-neutral-300 transition-colors">Early Detection</span>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="mb-16 max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-2xl relative border border-neutral-200 dark:border-neutral-800 transition-colors">
          <div className="relative h-96">
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ImageWithFallback
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end">
                  <div className="p-8 text-white">
                    <h3>{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 rounded-full flex items-center justify-center transition-all shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-900 dark:text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 rounded-full flex items-center justify-center transition-all shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-neutral-900 dark:text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mb-16">
        <h2 className="text-neutral-900 dark:text-white text-center mb-12 transition-colors">Analytics & Insights</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Quality Trend Chart */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors">
            <h3 className="text-neutral-900 dark:text-white mb-6 transition-colors">Quality Detection Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={qualityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#404040' : '#e5e5e5'} />
                <XAxis dataKey="month" stroke={isDark ? '#a3a3a3' : '#737373'} />
                <YAxis stroke={isDark ? '#a3a3a3' : '#737373'} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: `1px solid ${isDark ? '#404040' : '#e5e5e5'}`,
                    backgroundColor: isDark ? '#171717' : '#ffffff',
                    color: isDark ? '#ffffff' : '#000000'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="fresh" stroke={isDark ? '#ffffff' : '#000000'} strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="spoiled" stroke={isDark ? '#737373' : '#a3a3a3'} strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Detection Distribution */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors">
            <h3 className="text-neutral-900 dark:text-white mb-6 transition-colors">Detection Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={detectionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {detectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={isDark ? (index === 0 ? '#ffffff' : index === 1 ? '#737373' : '#404040') : entry.color} />
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
        </div>

        {/* Accuracy by Category */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors">
          <h3 className="text-neutral-900 dark:text-white mb-6 transition-colors">Model Accuracy by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#404040' : '#e5e5e5'} />
              <XAxis dataKey="category" stroke={isDark ? '#a3a3a3' : '#737373'} />
              <YAxis stroke={isDark ? '#a3a3a3' : '#737373'} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: `1px solid ${isDark ? '#404040' : '#e5e5e5'}`,
                  backgroundColor: isDark ? '#171717' : '#ffffff',
                  color: isDark ? '#ffffff' : '#000000'
                }} 
              />
              <Bar dataKey="accuracy" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl p-12 shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors">
        <h2 className="text-neutral-900 dark:text-white text-center mb-8 transition-colors">About Our Technology</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 transition-colors" />
            </div>
            <h4 className="text-neutral-900 dark:text-white mb-3 transition-colors">Advanced AI Models</h4>
            <p className="text-neutral-600 dark:text-neutral-400 transition-colors">
              Our deep learning models are trained on millions of food images, enabling precise detection of spoilage indicators.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 transition-colors" />
            </div>
            <h4 className="text-neutral-900 dark:text-white mb-3 transition-colors">Real-time Processing</h4>
            <p className="text-neutral-600 dark:text-neutral-400 transition-colors">
              Instant analysis and results allow for immediate decision-making in quality control processes.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <TrendingUp className="w-8 h-8 text-amber-600 dark:text-amber-400 transition-colors" />
            </div>
            <h4 className="text-neutral-900 dark:text-white mb-3 transition-colors">Continuous Learning</h4>
            <p className="text-neutral-600 dark:text-neutral-400 transition-colors">
              Our system continuously improves its accuracy through ongoing training and validation processes.
            </p>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4 transition-colors">
            The Food Quality Inspection system leverages state-of-the-art computer vision and machine learning algorithms 
            to assess food freshness through visual analysis. By examining color patterns, texture variations, and surface 
            characteristics, our AI can identify early signs of spoilage that may not be visible to the human eye.
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 transition-colors">
            Whether you're managing a restaurant, grocery store, or food processing facility, our technology helps maintain 
            the highest standards of food safety while minimizing waste. Upload images for batch testing or use real-time 
            camera detection for on-the-spot quality checks.
          </p>
        </div>
      </div>
    </div>
  );
}