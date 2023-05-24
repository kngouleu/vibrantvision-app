import { ChevronDownIcon, MenuIcon, SearchIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { auth } from '@/firebase/firebaseConfig';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { User } from '@/types/types';


const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);  
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);


  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
    }
  };
  const handleSearchonClick = () => {
    if (search) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const clearSearch = () => {
    setSearch('');
  };
  
  const signOut = () => {
    firebaseSignOut(auth)
    .then(() => {
      router.push('/');
    })
    .catch((error) => console.log(error));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside as any);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, [sidebarRef, dropdownRef]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        setUser({ ...(userAuth as any), posts: [] });
      } else {
        setUser(null);
      }
    });
  
    return unsubscribe;
  }, []);

  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-gradient-to-r from-[#142d4c] to-[#2b5c94] text-white">
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link href="/" className="text-2xl font-bold cursor-pointer">Vibrant Visions</Link>
        <div className="md:hidden">
          {isSidebarOpen ? (
            <XIcon className="h-6 w-6 cursor-pointer" onClick={toggleSidebar} />
          ) : (
            <MenuIcon className="h-6 w-6 cursor-pointer" onClick={toggleSidebar} />
          )}
        </div>
      </div>
      {/* For small screens */}
      <nav ref={sidebarRef} className={`md:hidden w-[200px] transform fixed right-0 top-0 h-full bg-[#142d4c] text-white p-8 overflow-auto transition-transform duration-200 ease-in-out z-10 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="mb-6 flex items-center relative">
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onKeyDown={handleSearch}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full bg-white w-full p-2 h-7 text-black focus:outline-none focus:border-none pr-10"
          />
          <SearchIcon
            onClick={handleSearchonClick} 
            className="h-6 w-6 cursor-pointer bg-white text-black rounded-full absolute right-2 top-1/2 transform -translate-y-1/2"
          />
          {search && (
            <XIcon
              onClick={clearSearch}
              className="h-6 w-6 cursor-pointer bg-white text-black rounded-full absolute right-8 top-1/2 transform -translate-y-1/2"
            />
          )}
      </div>
        <ul className="space-y-4 ">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          {user ? (
          <div className="relative text-left cursor-pointer">
            <div>
              <button type="button" onClick={toggleDropdown} className="inline-flex justify-center w-full rounded-full overflow-hidden p-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="options-menu" aria-expanded="true" aria-haspopup="true">
                <img className="h-8 w-8 rounded-full" src={user.photoURL} alt="" />
                <ChevronDownIcon className="h-6 w-6" />
              </button>
            </div>
            {isDropdownOpen &&
            <div  className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div className="py-1" role="none">
                <Link href="/accounts/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Profile Page</Link>
                <Link href="/accounts/posts/newpost" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Add a Post</Link>
                <Link href="/accounts/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Settings</Link>
                <p onClick={signOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" role="menuitem">Sign Out</p>
              </div>
            </div>}
          </div>
          ) : (
            <>
              <li><Link href="/accounts/login">Sign In</Link></li>
              <li><Link href="/accounts/register">Sign Up</Link></li>
            </>
          )}

        </ul>
      </nav>
      {/* For medium screens and up */}
      <div className="hidden md:flex flex-auto items-center justify-center">
        <div className="relative w-2/5">
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onKeyDown={handleSearch}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full bg-white w-full p-2 h-7 text-black focus:outline-none focus:border-none pr-10"
          />
          <SearchIcon
            onClick={handleSearchonClick} 
            className="h-6 w-6 cursor-pointer bg-white text-black rounded-full absolute right-2 top-1/2 transform -translate-y-1/2"
          />
          {search && (
            <XIcon
              onClick={clearSearch}
              className="h-6 w-6 cursor-pointer bg-white text-black rounded-full absolute right-8 top-1/2 transform -translate-y-1/2"
            />
          )}
        </div>
      </div>

      <nav className="hidden md:block md:w-auto">
        <ul className="flex items-center space-x-4 justify-end">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          {user ? (
          <div className="relative inline-block text-left cursor-pointer">
            <div>
              <button type="button" onClick={toggleDropdown} className="inline-flex justify-center w-full rounded-full overflow-hidden p-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="options-menu" aria-expanded="true" aria-haspopup="true">
                <img className="h-8 w-8 rounded-full" src={user.photoURL} alt="" />
                <ChevronDownIcon className="h-6 w-6" />
              </button>
            </div>
            {isDropdownOpen &&
            <div  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div className="py-1" role="none">
                <Link href="/accounts/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Profile Page</Link>
                <Link href="/accounts/posts/newpost" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Add a Post</Link>
                <Link href="/accounts/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Settings</Link>
                <p onClick={signOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" role="menuitem">Sign Out</p>
              </div>
            </div>}
          </div>
          ) : (
          <>
            <li><Link href="/accounts/login">Sign In</Link></li>
            <li><Link href="/accounts/register">Sign Up</Link></li>
          </>
          )}

        </ul>
      </nav>
    </header>
  );
};

export default Header;

