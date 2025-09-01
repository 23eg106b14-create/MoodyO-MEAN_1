import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import Image from 'next/image';

export function Player() {
  return (
    <footer className="sticky bottom-0 z-40 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Card className="rounded-none border-x-0 border-b-0">
        <div className="container flex items-center justify-between p-4 h-24">
          <div className="flex items-center gap-4 w-1/4">
            <Image
              src="https://picsum.photos/64/64"
              data-ai-hint="album cover"
              alt="Album Art"
              width={56}
              height={56}
              className="rounded-md"
            />
            <div>
              <p className="font-semibold text-sm">Song Title</p>
              <p className="text-xs text-muted-foreground">Artist Name</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 w-1/2">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button variant="default" size="icon" className="w-12 h-12 bg-primary hover:bg-primary/90 rounded-full">
                <Play className="h-6 w-6 fill-primary-foreground" />
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full max-w-sm">
                <span className="text-xs text-muted-foreground">0:42</span>
                <Progress value={33} className="h-1.5"/>
                <span className="text-xs text-muted-foreground">2:51</span>
            </div>
          </div>
          <div className="w-1/4">
            {/* Volume controls or other actions can go here */}
          </div>
        </div>
      </Card>
    </footer>
  );
}
