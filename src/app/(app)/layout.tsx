'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppSidebar } from '@/components/shell/app-sidebar';
import { AppHeader } from '@/components/shell/app-header';
import { MobileNav } from '@/components/shell/mobile-nav';
import { CommandPalette } from '@/components/shared/command-palette';
import { DemoControlPanel } from '@/components/shared/demo-control-panel';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  TrendingUp,
  Settings,
  ShieldCheck,
  User,
  LogOut,
  Palette,
  HelpCircle,
} from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Desktop App Sidebar */}
      <AppSidebar unreviewedCount={1} />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <AppHeader
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <MobileNav
        onOpenMenu={() => setMobileMenuOpen(true)}
        unreviewedCount={1}
      />

      {/* Global ⌘K Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      {/* Persistent Floating Demo Sandbox Control */}
      <DemoControlPanel />

      {/* Mobile Drawer Menu */}
      <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DrawerContent className="p-4 bg-[var(--card)] border-t border-[var(--border)] max-w-md mx-auto">
          <DrawerHeader className="text-left pb-3 border-b border-[var(--border)]">
            <DrawerTitle className="text-base font-bold text-[var(--foreground)]">SoloFi Menu</DrawerTitle>
            <DrawerDescription className="text-xs text-[var(--muted-foreground)]">
              Additional modules & sandbox tools
            </DrawerDescription>
          </DrawerHeader>

          <div className="py-4 space-y-2">
            <Link
              href="/cards"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--card-subtle)] text-xs font-medium text-[var(--foreground)]"
            >
              <CreditCard className="w-4 h-4 text-[var(--primary)]" />
              <span>Virtual Cards & Limits</span>
            </Link>

            <Link
              href="/forecast"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--card-subtle)] text-xs font-medium text-[var(--foreground)]"
            >
              <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
              <span>Forecast & Safe-to-Spend Runway</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--card-subtle)] text-xs font-medium text-[var(--foreground)]"
            >
              <Settings className="w-4 h-4 text-[var(--muted-foreground)]" />
              <span>Tax Profile & Settings</span>
            </Link>

            <Link
              href="/security"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--card-subtle)] text-xs font-medium text-[var(--foreground)]"
            >
              <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
              <span>Partner Bank & FDIC Disclosure</span>
            </Link>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--card-subtle)] text-xs font-medium text-[var(--foreground)]"
            >
              <User className="w-4 h-4 text-[var(--muted-foreground)]" />
              <span>Switch Persona / Sign Out</span>
            </Link>
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
