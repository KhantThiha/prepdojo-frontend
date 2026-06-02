'use client';

import { School, Bell, UserCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    
];

export function Navbar({ children }: { children?: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();
    const avatarUrl =
    user?.user_metadata?.avatar_url || // GitHub, some Google
    user?.user_metadata?.picture ||    // Google
    null;

    const displayName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email ||
        "";
    const initial = displayName.charAt(0).toUpperCase();
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 lg:px-10 py-3">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/jlpt" className="flex items-center gap-4 text-[#3182ed] hover:opacity-90 transition-opacity">
                    <div className="size-8 flex items-center justify-center bg-[#3182ed]/10 rounded-lg shadow-sm">
                        <School className="size-5" />
                    </div>
                    <h2 className="text-slate-900 dark:text-slate-100 text-lg font-black leading-tight tracking-tight">JLPT Academy</h2>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "text-sm font-semibold transition-all relative py-1",
                                    isActive
                                        ? "text-[#3182ed]"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                )}
                            >
                                {item.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3182ed] rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions Icons */}
                <div className="flex items-center gap-2">
                    <button className="hidden sm:flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-700">
                        <Bell className="size-5" />
                    </button>

                    {children && (
                        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4 ml-2">
                            {children}
                        </div>
                    )}

                    <div className="flex items-center gap-3 ml-2">
                        <div className="bg-[#3182ed]/10 rounded-full size-10 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden cursor-pointer hover:border-[#3182ed]/30 transition-all">
                           <Avatar className="cursor-pointer">
                                <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                                <AvatarFallback>{initial}</AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden flex items-center justify-center rounded-lg h-10 w-10 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-200 shadow-xl">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "text-base font-bold transition-colors py-2 px-4 rounded-lg",
                                pathname === item.href
                                    ? "bg-[#3182ed]/10 text-[#3182ed]"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 px-4">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <Bell className="size-5" />
                            <span className="text-sm font-bold">Notifications</span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
