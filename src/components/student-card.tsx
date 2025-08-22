"use client";

import { useState, useTransition } from 'react';
import { type StudentData, markAsCollected } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2, User, Utensils, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentCardProps {
  student: StudentData;
  sheetName: string;
  onCollectionSuccess: (updatedStudent: StudentData) => void;
}

export function StudentCard({ student, sheetName, onCollectionSuccess }: StudentCardProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const { toast } = useToast();
  
  const isCollected = student.Collected.toUpperCase() !== 'FALSE';
  const isVeg = student.Preference.toUpperCase() === 'VEG';

  const handleCollect = () => {
    startUpdateTransition(async () => {
      // Pass rowIndex to the action
      const { success, error } = await markAsCollected(sheetName, student.Roll, student.rowIndex);
      if (success) {
        toast({
          title: "Success",
          description: `${student.Name} marked as collected.`,
        });
        const updatedStudentData = { ...student, Collected: new Date().toISOString() };
        onCollectionSuccess(updatedStudentData);
      } else {
        toast({
          variant: 'destructive',
          title: "Update Failed",
          description: error,
        });
      }
    });
  };
  
  return (
    <Card className="animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="text-primary"/> 
          <span>{student.Name}</span>
        </CardTitle>
        <CardDescription>{student.Roll}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Utensils className="text-muted-foreground"/>
            <span className="font-medium">Preference</span>
          </div>
           <Badge
            className={cn(
              isVeg ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
            )}
           >
            {student.Preference}
          </Badge>
        </div>
         <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            {isCollected ? <CheckCircle2 className="text-green-500"/> : <XCircle className="text-destructive"/>}
            <span className="font-medium">Status</span>
          </div>
          <Badge variant={isCollected ? "default" : "destructive"} className={isCollected ? 'bg-green-500 hover:bg-green-600' : ''}>
            {isCollected ? "Collected" : "Not Collected"}
          </Badge>
        </div>
      </CardContent>
      {!isCollected && (
        <CardFooter>
          <Button className="w-full" onClick={handleCollect} disabled={isUpdatePending}>
            {isUpdatePending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2 />
            )}
            <span>Mark as Collected</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
