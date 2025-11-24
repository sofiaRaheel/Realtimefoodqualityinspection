import { Link, useLocation } from 'react-router-dom';
import { Home, TestTube2, Video, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

export function Navigation() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50 shadow-sm transition-colors">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-200 rounded-lg flex items-center justify-center">
              <TestTube2 className="w-6 h-6 text-white dark:text-neutral-900" />
            </div>
            <span className="text-neutral-900 dark:text-white transition-colors">Food Quality AI</span>
          </Link>
          
          <div className="flex gap-2 items-center">
            <Link
              to="/"
              className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
                isActive('/')
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/testing"
              className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
                isActive('/testing')
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <TestTube2 className="w-4 h-4" />
              <span>Testing</span>
            </Link>
            
            <Link
              to="/realtime"
              className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
                isActive('/realtime')
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Real-time</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="ml-2 w-10 h-10 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}