import { Input } from "@/components/ui/input";
import { Laugh, Plus } from "lucide-react";

interface ChatInputProps {
  type: "channel" | "conversation";
  placeholder: string;
}

const ChatInput = ({ type, placeholder }: ChatInputProps) => {
  return (
    <div className="p-2 relative flex items-center">
      <div className="absolute left-3">
        <Plus />
      </div>
      <Input
        type="text"
        className="px-12 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0"
        placeholder={type == "channel" ? `Message in #${placeholder}` : ""}
      />
      <div className="absolute right-3">
        <Laugh />
      </div>
    </div>
  );
};

export default ChatInput;
