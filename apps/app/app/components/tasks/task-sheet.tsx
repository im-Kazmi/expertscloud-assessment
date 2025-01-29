import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@repo/design-system/components/ui/sheet";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Textarea } from "@repo/design-system/components/ui/textarea";

interface TaskSheetProps {
  task: any | null;
  onClose: () => void;
  onUpdateTask: (task: any) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskSheet({
  task,
  onClose,
  onUpdateTask,
  onDeleteTask,
}: TaskSheetProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStatus(task.status);
      setDescription(task.description);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      const updatedTask: any = {
        ...task,
        title,
        status,
        description,
      };
      onUpdateTask(updatedTask);
      onClose();
    }
  };

  const handleDelete = () => {
    if (task) {
      onDeleteTask(task.id);
      onClose();
    }
  };

  return (
    <Sheet open={!!task} onOpenChange={onClose}>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold text-gray-800">
            Task Details
          </SheetTitle>
        </SheetHeader>
        {task && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            />
            <SheetFooter>
              <Button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Update Task
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete Task
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
