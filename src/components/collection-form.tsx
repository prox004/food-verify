"use client";

import { useState, useTransition, useRef } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { type StudentData, searchRollNumber } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { StudentCard } from './student-card';

export function CollectionForm({ initialSheets }: { initialSheets: string[] }) {
  const [isPending, startTransition] = useTransition();
  const [sheet, setSheet] = useState(initialSheets[0] || '');
  const [rollDigits, setRollDigits] = useState(['', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StudentData | null>(null);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...rollDigits];
    newDigits[index] = value;
    setRollDigits(newDigits);

    if (value && index < 2) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !rollDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setResult(null);
    const rollSuffix = rollDigits.join('');


    if (!sheet) {
      setError('Please select a class/sheet.');
      return;
    }
    if (rollSuffix.length !== 3) {
      setError('Please enter the last 3 digits of the roll number.');
      return;
    }

    startTransition(async () => {
      const { data, error: searchError } = await searchRollNumber(sheet, rollSuffix);
      if (searchError) {
        setError(searchError);
      } else {
        setResult(data);
      }
    });
  };

  const handleCollectionSuccess = (updatedStudent: StudentData) => {
    setResult(updatedStudent);
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 3);
    if (pasteData.length === 3) {
      setRollDigits(pasteData.split(''));
      inputRefs[2].current?.focus();
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Select value={sheet} onValueChange={setSheet} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a class..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {initialSheets.map((sheetName) => (
                      <SelectItem key={sheetName} value={sheetName}>
                        {sheetName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {rollDigits.map((digit, index) => (
                   <Input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="h-14 w-12 text-center text-2xl font-mono tracking-widest"
                    required
                  />
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search />
              )}
              <span>Search</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Search Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <StudentCard 
          student={result} 
          sheetName={sheet}
          onCollectionSuccess={handleCollectionSuccess} 
        />
      )}
    </div>
  );
}
