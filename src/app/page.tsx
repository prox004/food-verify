import { getSheets } from '@/app/actions';
import { CollectionForm } from '@/components/collection-form';
import { UtensilsCrossed } from 'lucide-react';

export default async function Home() {
  const initialSheets = await getSheets();

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 dark:bg-neutral-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
             <UtensilsCrossed className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            SheetCollect
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Food Collection Management
          </p>
        </div>
        <CollectionForm initialSheets={initialSheets} />
      </div>
    </main>
  );
}
