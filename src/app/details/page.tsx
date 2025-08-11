import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Bot, Clock3, Database, Edit, List, Smartphone, Palette } from 'lucide-react';

const features = [
    {
        icon: <List className="h-6 w-6 text-primary" />,
        title: "Simple Expense Tracking",
        description: "Easily log expenses between two users. The app tracks who paid for what, keeping a running total.",
    },
    {
        icon: <Database className="h-6 w-6 text-primary" />,
        title: "Persistent Data",
        description: "All transactions are saved in your browser's local storage, so your data persists even after you close the tab or refresh the page.",
    },
    {
        icon: <Bot className="h-6 w-6 text-primary" />,
        title: "AI-Powered Insights",
        description: "Get an AI-generated summary of your spending habits and receive funny, flirty, or romantic messages with each new transaction.",
    },
    {
        icon: <Clock3 className="h-6 w-6 text-primary" />,
        title: "3-Minute Edit/Delete Window",
        description: "Made a mistake? You have a 3-minute window to edit or delete any transaction you've just added.",
    },
    {
        icon: <Palette className="h-6 w-6 text-primary" />,
        title: "Two History Styles",
        description: "Choose between two different visual styles for viewing your transaction history.",
    },
    {
        icon: <Smartphone className="h-6 w-6 text-primary" />,
        title: "Mobile Friendly",
        description: "The entire app is designed to work beautifully on both desktop and mobile devices.",
    }
]

export default function DetailsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-body p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">About Secret</h1>
          <CardDescription className="text-lg mt-2">
            A simple, private expense tracker for two.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg">
                    <div>{feature.icon}</div>
                    <div>
                        <h3 className="font-bold text-card-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/" passHref>
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
