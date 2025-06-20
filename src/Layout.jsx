import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';
import ProgressStats from '@/components/organisms/ProgressStats';
import QuickAddButton from '@/components/organisms/QuickAddButton';
import CategorySidebar from '@/components/organisms/CategorySidebar';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to tasks if on root
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/tasks', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header with Progress Stats */}
      <header className="flex-shrink-0 bg-surface border-b border-gray-200 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="Menu" size={20} />
              </button>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                TaskFlow
              </h1>
            </div>
            <ProgressStats />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-80 bg-surface border-r border-gray-200 flex-col z-40">
          {/* Navigation */}
          <nav className="p-4 border-b border-gray-200">
            <div className="space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={20} />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Category Sidebar */}
          <div className="flex-1 overflow-y-auto">
            <CategorySidebar />
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Drawer */}
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: mobileMenuOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="md:hidden fixed left-0 top-0 bottom-0 w-80 bg-surface border-r border-gray-200 flex flex-col z-50"
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-gray-900">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          <nav className="p-4 border-b border-gray-200">
            <div className="space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={20} />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="flex-1 overflow-y-auto">
            <CategorySidebar />
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Quick Add Button */}
      <QuickAddButton />
    </div>
  );
}

export default Layout;