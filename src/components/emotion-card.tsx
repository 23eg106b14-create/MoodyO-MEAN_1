import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Emotion } from '@/lib/constants';

export function EmotionCard({ emotion }: { emotion: Emotion }) {
  return (
    <Link href={`/playlist/${emotion.name.toLowerCase()}`} className="group">
      <div
        className={cn(
          'flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br p-4 text-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl',
          emotion.className
        )}
      >
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">{emotion.name}</h3>
      </div>
    </Link>
  );
}
