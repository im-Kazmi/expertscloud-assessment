import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { Calendar, Flag } from "lucide-react";

export function TaskCardSkeleton() {
  return (
    <Card className="bg-gray-50 h-40 rounded-lg border border-dashed shadow-sm rounded-none my-3 overflow-hidden">
      <CardContent className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 skeleton-shimmer shadow-inner" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full skeleton-shimmer  shadow-inner" />
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-300" />
            <div className="h-4 bg-gray-200 rounded w-1/3 skeleton-shimmer  shadow-inner" />
          </div>
          <div className="flex items-center">
            <Flag className="mr-2 h-4 w-4 text-gray-300" />
            <div className="h-4 bg-gray-200 rounded w-1/4 skeleton-shimmer  shadow-inner" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
