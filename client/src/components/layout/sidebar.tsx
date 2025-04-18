import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Home, Building, Users, LayoutDashboard, Book, 
  Calculator, MessageCircle, UserCircle, Settings, ChevronRight, HelpCircle
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export default function Sidebar({ isOpen, closeSidebar, isExpanded, setIsExpanded }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [showExpandIndicator, setShowExpandIndicator] = useState(false);
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && isOpen) {
      closeSidebar();
    }
  }, [location, isOpen, closeSidebar]);

  // Handle window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      if (window.innerWidth >= 1024 && !isOpen) {
        // Ensure sidebar is open on desktop
        document.getElementById('sidebar')?.classList.remove('-translate-x-full');
        document.getElementById('sidebar')?.classList.add('translate-x-0');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Show expand indicator when mouse is near the edge
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isExpanded && e.clientX < 20 && e.clientY > 60) {
        setShowExpandIndicator(true);
      } else if (!isExpanded && e.clientX > 40) {
        setShowExpandIndicator(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isExpanded]);

  // Nav item classes with immediate color change on hover - full width with no rounded corners
  const getNavItemClasses = (path: string) => {
    const isActive = location === path;
    return `
      group flex items-center px-3 py-2 mx-0 whitespace-nowrap transition-colors duration-0
      ${isActive 
        ? 'bg-[#09261E] text-white' 
        : 'text-gray-700 hover:bg-[#D8D8D8]'}
    `;
  };

  return (
    <>
      {/* Expansion indicator that peeks from the edge */}
      {!isExpanded && showExpandIndicator && (
        <div 
          className="fixed top-1/3 left-0 z-30 cursor-pointer h-10"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center bg-white shadow-md h-full">
            <div className="w-2 h-full border-r border-gray-200"></div>
            <div className="w-4 h-full flex items-center justify-center">
              <ChevronRight size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <aside 
        id="sidebar" 
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen overflow-y-auto z-50 shadow-lg
          transition-all duration-200 bg-white
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isExpanded ? 'w-64' : 'w-16'}
        `}
        onMouseEnter={() => window.innerWidth >= 1024 && setIsExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 1024 && setIsExpanded(false)}
      >
        <nav className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-14 flex items-center justify-center border-b">
            <Link href="/" className={`flex items-center ${isExpanded ? 'ml-4 justify-start w-full' : 'mx-auto'}`}>
              <img 
                src="/images/pdLogo.png" 
                alt="PropertyDeals Logo" 
                className="h-8 w-auto"
              />
              {isExpanded && (
                <span className="ml-2 font-heading font-bold text-[#09261E] text-lg">
                  PropertyDeals
                </span>
              )}
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="py-4">
            <div className="mb-6">
              {isExpanded && (
                <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider px-4 mb-2">
                  Navigation
                </h3>
              )}
              <ul>
                <li>
                  <Link href="/" className={getNavItemClasses("/")}>
                    <Home className={`w-5 h-5 flex-shrink-0 ${!isExpanded && 'mx-auto'}`} />
                    {isExpanded && <span className="ml-3">Home</span>}
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className={getNavItemClasses("/properties")}>
                    <Building className={`w-5 h-5 flex-shrink-0 ${!isExpanded && 'mx-auto'}`} />
                    {isExpanded && <span className="ml-3">Properties</span>}
                  </Link>
                </li>
                <li>
                  <Link href="/reps" className={getNavItemClasses("/reps")}>
                    <Users className={`w-5 h-5 flex-shrink-0 ${!isExpanded && 'mx-auto'}`} />
                    {isExpanded && <span className="ml-3">REPs</span>}
                  </Link>
                </li>
                <li>
                  <Link href="/discussions" className={getNavItemClasses("/discussions")}>
                    <MessageCircle className={`w-5 h-5 flex-shrink-0 ${!isExpanded && 'mx-auto'}`} />
                    {isExpanded && <span className="ml-3">Discussions</span>}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className={getNavItemClasses("/dashboard")}>
                    <LayoutDashboard className={`w-5 h-5 flex-shrink-0 ${!isExpanded && 'mx-auto'}`} />
                    {isExpanded && <span className="ml-3">Dashboard</span>}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className="mb-6">
              {isExpanded && (
                <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider px-4 mb-2">
                  Resources
                </h3>
              )}
              <ul>
                <li>
                  <Link href="/guides" className={getNavItemClasses("/guides")}>
                    <Book className={`w-5 h-5 flex-shrink-0 ${!isExpanded && 'mx-auto'}`} />
                    {isExpanded && <span className="ml-3">Guides</span>}
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className={getNavItemClasses("/tools")}>
                    <Calculator className={`w-5 h-5 flex-shrink-0 ${!isExpanded && 'mx-auto'}`} />
                    {isExpanded && <span className="ml-3">Tools</span>}
                  </Link>
                </li>
                <li>
                  <Link href="/help" className={getNavItemClasses("/help")}>
                    <HelpCircle className={`w-5 h-5 flex-shrink-0 ${!isExpanded && 'mx-auto'}`} />
                    {isExpanded && <span className="ml-3">Help</span>}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Spacer to push profile section to bottom */}
            <div className="flex-grow"></div>
          </div>
          
          {/* Profile & Settings */}
          <div className="mt-auto border-t border-gray-200 py-4">
            {isExpanded && (
              <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider px-4 mb-2">
                Account
              </h3>
            )}
            <ul>
              <li>
                <Link href="/profile" className={getNavItemClasses("/profile")}>
                  <UserCircle className={`w-5 h-5 flex-shrink-0 ${!isExpanded && 'mx-auto'}`} />
                  {isExpanded && <span className="ml-3">Profile</span>}
                </Link>
              </li>
              <li>
                <Link href="/settings" className={getNavItemClasses("/settings")}>
                  <Settings className={`w-5 h-5 flex-shrink-0 ${!isExpanded && 'mx-auto'}`} />
                  {isExpanded && <span className="ml-3">Settings</span>}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}
