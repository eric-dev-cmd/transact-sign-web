import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/modules/login/stores/useAuthStore";
import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

// Define menu items to make code more maintainable
const MENU_ITEMS = [
  // { path: "/dashboard", label: "Dashboard" },
  { path: "/transactions", label: "Transactions" },
];

// Define dropdown items
const DROPDOWN_ITEMS = [
  { path: "#profile", label: "Profile" },
  { path: "#settings", label: "Settings" },
];

const MainLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    navigate(ROUTES.LOGIN);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to check if a menu item is active
  const isActive = (path: string) => {
    // Exact match for dashboard, or starts with for nested routes
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Extract Avatar component for better organization
  const Avatar = () => (
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white cursor-pointer">
      <span className="text-sm font-medium">TV</span>
    </div>
  );

  // Extract DropdownMenu component
  const DropdownMenu = () =>
    isMenuOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
        {DROPDOWN_ITEMS.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
        >
          Logout
        </button>
      </div>
    );

  // Extract Mobile Menu Items component
  const MobileMenuItems = () => (
    <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} mt-4`}>
      <nav className="flex flex-col space-y-2">
        {MENU_ITEMS.map((item, index) => {
          const active = isActive(item.path);
          return (
            <Link
              key={index}
              to={item.path}
              className={`text-sm font-medium block py-2 px-4 transition-colors
              ${
                active
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                  : "hover:text-blue-500 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}

        <div className="border-t border-gray-200 pt-2 mt-2">
          {DROPDOWN_ITEMS.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="text-sm font-medium block py-2 px-4 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 block py-2 px-4 hover:bg-gray-50 w-full text-left"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md px-4 md:px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to={ROUTES.TRANSACTIONS}
            className="text-xl font-bold text-blue-600"
          >
            Admin Panel
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <nav className="flex space-x-6">
              {MENU_ITEMS.map((item, index) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`text-sm font-medium px-2 py-1 transition-colors border-b-2 ${
                      active
                        ? "text-blue-600 border-blue-500"
                        : "hover:text-blue-500 border-transparent"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Avatar Dropdown */}
            <div className="relative ml-6" ref={dropdownRef}>
              <button
                className="flex items-center focus:outline-none"
                onClick={toggleMenu}
                aria-label="User menu"
                aria-haspopup="true"
              >
                <Avatar />
                <svg
                  className={`ml-1 h-5 w-5 text-gray-400 transition-transform duration-200 cursor-pointer ${isMenuOpen ? "transform rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <DropdownMenu />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              title="Menu"
              className="p-1 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenuItems />
      </header>

      <main className="flex-grow px-4 md:px-6 py-6">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto">
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
