import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@repo/design-system/components/ui/dialog";
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

type TaskDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: any) => void;
};

export default function TaskDialog({
  isOpen,
  onClose,
  onAddTask,
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("To Do");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: any = {
      id: Date.now().toString(),
      title,
      status,
      description,
    };
    onAddTask(newTask);
    onClose();
    setTitle("");
    setStatus("To Do");
    setDescription("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Add New Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <DialogFooter>
            <Button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
