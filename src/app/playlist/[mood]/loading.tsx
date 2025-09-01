import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Music2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative w-full h-full min-h-[calc(100vh-12rem)] p-4 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-mood-color-start/20 via-background to-background animate-pulse"></div>
        <div className="relative mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto mt-4" />
          </div>
          
          <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-2 rounded-md">
                     <div className="text-muted-foreground">
                        <Music2 className="w-5 h-5"/>
                     </div>
                     <Skeleton className="h-6 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
