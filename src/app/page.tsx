import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-body">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Secret</h1>
          <CardTitle className="text-2xl font-bold mt-4">Welcome Back!</CardTitle>
          <CardDescription>Please select your name to continue.</CardDescription>
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
      </Card>
    </div>
  );
}
