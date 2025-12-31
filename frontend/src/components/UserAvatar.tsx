import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/authcontext";
import { 
  User, Settings, LogOut, CreditCard, 
  Bell, HelpCircle, Shield 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserAvatarProps {
  isMobile?: boolean;
}

export default function UserAvatar({ isMobile = false }: UserAvatarProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsOpen(false);
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleMyPlanClick = () => {
    setIsOpen(false);
    navigate('/pricing');
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  const handleNotificationsClick = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  const handleHelpClick = () => {
    setIsOpen(false);
    navigate('/help');
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    logout();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Get user role color
  const getRoleColor = () => {
    if (!user) return 'bg-gray-500';
    switch(user.role) {
      case 'admin': return 'bg-purple-500';
      case 'doctor': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  // Don't render if no user
  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button - Different for mobile/desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center rounded-lg hover:bg-accent transition-colors ${
          isMobile ? "p-1" : "p-2 space-x-3"
        }`}
        aria-label="User menu"
      >
        <div className={`flex items-center ${isMobile ? "" : "space-x-2"}`}>
          {/* Avatar Circle */}
          <div className={`relative ${isMobile ? "w-8 h-8" : "w-10 h-10"} rounded-full ${getRoleColor()} flex items-center justify-center text-white font-semibold`}>
            {getUserInitials()}
            {user?.role === 'admin' && !isMobile && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center">
                <Shield className="h-2.5 w-2.5 text-white" />
              </div>
            )}
          </div>
          
          {/* User Info (Desktop only) */}
          {!isMobile && (
            <div className="text-left">
              <p className="text-sm font-medium text-foreground line-clamp-1 max-w-[120px]">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role || 'user'}
              </p>
            </div>
          )}
        </div>
      </button>

      {/* Dropdown Menu - Different size for mobile/desktop */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 ${isMobile ? "w-56" : "w-64"} bg-background rounded-lg shadow-lg border border-border z-50 overflow-hidden`}>
          {/* User Info Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className={`${isMobile ? "w-8 h-8" : "w-12 h-12"} rounded-full ${getRoleColor()} flex items-center justify-center text-white font-semibold ${isMobile ? "text-sm" : "text-lg"}`}>
                {getUserInitials()}
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                  user?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">My Profile</span>
            </button>

            <button
              onClick={handleMyPlanClick}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
            >
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">My Plan</span>
            </button>

            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Settings</span>
            </button>

            <button
              onClick={handleNotificationsClick}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Notifications</span>
            </button>

            <button
              onClick={handleHelpClick}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Help & Support</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="border-t border-border">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}