import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Info } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-body">
      <Card className="w-full max-w-md mx-4 relative">
        <CardHeader className="text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Secret</h1>
          <CardTitle className="text-2xl font-bold mt-4">Who are you?</CardTitle>
          <CardDescription>Choose your name to see your expenses.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-6">
          <Link href="/user/Meruputhiga" passHref>
            <Button className="w-full justify-between h-14 text-lg" size="lg">
              Meruputhiga
              <ArrowRight />
            </Button>
          </Link>
          <Link href="/user/Pikachu" passHref>
            <Button variant="secondary" className="w-full justify-between h-14 text-lg" size="lg">
              Pikachu
              <ArrowRight />
            </Button>
          </Link>
        </CardContent>
        <div className="absolute top-4 right-4">
          <Link href="/details" passHref>
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
