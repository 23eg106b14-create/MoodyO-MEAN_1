import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Music2, BrainCircuit } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl py-12 md:py-20 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-primary">About MoodyO</h1>
            <p className="mt-4 text-lg text-muted-foreground">The story behind mood based audio.</p>
          </div>
          
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Music2 className="w-8 h-8 text-accent"/>
                Our Mission
              </CardTitle>
              <CardDescription>Crafting the perfect soundtrack for every feeling.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-base md:text-lg text-foreground/80">
              <p>
                MoodyO was born from a simple idea: music is more than just sound; it's a feeling. We believe that the right song at the right moment can transform your day, lift your spirits, or provide comfort when you need it most. Our mission is to seamlessly connect you with the music that resonates with your current state of mind.
              </p>
              <p>
                Whether you're feeling joyful and want to dance, or you need a calming melody to soothe a stressful day, MoodyO is your personal audio companion.
              </p>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BrainCircuit className="w-8 h-8 text-accent"/>
                Powered by AI
              </CardTitle>
              <CardDescription>Intelligent curation for a personalized experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-base md:text-lg text-foreground/80">
              <p>
                At the heart of MoodyO is a powerful AI engine. By leveraging Genkit and Google's Gemini models, we go beyond generic playlists. Our AI analyzes the nuances of each mood to curate a unique and fitting selection of songs, just for you.
              </p>
              <p>
                This isn't just about matching genres to moods. Our technology understands the subtle qualities of music—tempo, key, instrumentation—to create a truly immersive and emotionally resonant listening experience. We're constantly refining our AI to make your playlists even more personal and surprising.
              </p>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
