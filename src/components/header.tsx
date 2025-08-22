"use client";

import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import { UtensilsCrossed, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SheetCollect</h1>
            <p className="text-sm text-muted-foreground">Food Collection Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.firstName || user.emailAddresses[0].emailAddress}
              </span>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  }
                }}
                userProfileUrl="/user-profile"
              />
            </div>
          ) : (
            <SignInButton mode="modal">
              <Button variant="default" size="sm">
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
