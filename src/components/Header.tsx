'use client';

import { Button } from "./ui/button";
import { Moon, Sun, Languages } from "lucide-react";
import { useUIStore } from "../lib/store";
import { useTranslation } from "../hooks/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const { currentPage, isDarkMode, language, setCurrentPage, toggleDarkMode, setLanguage } = useUIStore();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <nav className="flex gap-2 md:gap-6">
          <Button
            variant={currentPage === 'home' ? 'default' : 'ghost'}
            onClick={() => setCurrentPage('home')}
            className={currentPage === 'home' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : ''}
          >
            {t('home')}
          </Button>
          <Button
            variant={currentPage === 'products' ? 'default' : 'ghost'}
            onClick={() => setCurrentPage('products')}
            className={currentPage === 'products' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : ''}
          >
            {t('products')}
          </Button>
          <Button
            variant={currentPage === 'admin' ? 'default' : 'ghost'}
            onClick={() => setCurrentPage('admin')}
            className={currentPage === 'admin' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : ''}
          >
            {t('admin')}
          </Button>
        </nav>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('fa')}>
                <span className={language === 'fa' ? 'font-bold' : ''}>فارسی</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                <span className={language === 'en' ? 'font-bold' : ''}>English</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <div 
            onClick={() => setCurrentPage('home')}
            className="cursor-pointer"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            <h1 className="text-primary">{t('brandName')}</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
