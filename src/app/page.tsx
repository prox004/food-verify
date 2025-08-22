import { getSheets } from '@/app/actions';
import { CollectionForm } from '@/components/collection-form';
import { Header } from '@/components/header';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const initialSheets = await getSheets();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Search Student Records
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the last 3 digits of a roll number to find and manage food collection status
            </p>
          </div>
          <CollectionForm initialSheets={initialSheets} />
        </div>
      </main>
    </div>
  );
}
