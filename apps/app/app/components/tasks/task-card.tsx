import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { Calendar, Flag, User } from "lucide-react";
import { format } from "date-fns";
import { TaskWithOrg } from "@/app/lib/types";

type TaskCardProps = {
  task: TaskWithOrg;
};

export function TaskCard({ task }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-green-200 text-green-800";
      case "MEDIUM":
        return "bg-yellow-200 text-yellow-800";
      case "HIGH":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Card className="bg-gray-50 h-40  hover:bg-gray-100 transition-colors duration-200 border border-dashed shadow-sm rounded-none my-3">
      <CardContent className="p-4">
        <div className="text-lg font-medium text-gray-800 mb-2">
          {task.title}
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            {task.description}
          </div>
          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="mr-2 h-4 w-4" />
              {format(new Date(task.dueDate), "MMM dd, yyyy")}
            </div>
          )}
          <div className="flex items-center">
            <Flag className="mr-2 h-4 w-4" />
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${getPriorityColor(task.priority)}`}
            >
              {task.priority}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
