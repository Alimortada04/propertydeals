import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const isMobile = useIsMobile();

  // Handle scroll to hide/show navbar - only on desktop
  useEffect(() => {
    if (typeof window === 'undefined' || isMobile) return;
    
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrolledDown = prevScrollPos < currentScrollPos;
      const isScrolledBeyondThreshold = currentScrollPos > 20;
      
      // Hide when scrolling down, show when scrolling up
      if (isScrolledDown && isScrolledBeyondThreshold) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, isMobile]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Determine if the current page should show the search bar
  const showSearch = ['/properties', '/reps'].includes(location);

  return (
    <header 
      className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
        !isMobile && !visible ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Menu toggle button */}
          <button 
            onClick={toggleSidebar}
            className="text-gray-700 p-2 hover:bg-gray-100 rounded-full"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo (only visible on mobile) */}
          {isMobile && (
            <Link href="/" className="ml-2">
              <img 
                src="/images/pdLogo.png" 
                alt="PropertyDeals Logo" 
                className="h-8 w-auto"
              />
            </Link>
          )}
          
          {/* Search bar - only shown on specific pages */}
          {showSearch && (
            <div className="hidden md:block ml-auto mr-4">
              <div className="relative w-80">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 border-gray-300 focus:border-gray-400 rounded-full bg-gray-50 hover:bg-white focus:bg-white"
                />
              </div>
            </div>
          )}
          
          {/* Spacer to push auth buttons to right */}
          <div className="flex-grow"></div>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-3 ml-auto">
            {user ? (
              <>
                <span className="hidden sm:inline-block text-gray-700">
                  {user.fullName || user.username}
                </span>
                <Button 
                  onClick={handleLogout} 
                  className="bg-[#09261E] hover:bg-[#135341] text-white"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <span className="text-gray-700 font-medium hover:text-[#09261E] px-3 py-1">
                    Sign In
                  </span>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#09261E] hover:bg-[#135341] text-white rounded-md">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
