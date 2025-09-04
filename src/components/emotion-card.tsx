import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Emotion } from '@/lib/constants';
import { Card } from './ui/card';

export function EmotionCard({ emotion }: { emotion: Emotion }) {
  return (
    <Link href={`/playlist/${emotion.name.toLowerCase()}`} className="group">
      <Card
        className={cn(
          'flex aspect-square items-center justify-center p-4 text-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl',
          'bg-card/50 hover:bg-primary/10 border-2 border-transparent hover:border-primary/50'
        )}
      >
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{emotion.name}</h3>
      </Card>
    </Link>
  );
}
