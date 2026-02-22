import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Keep the internal type for definition/safety
type Topic = "kanji" | "grammar" | "vocab" | "reading";

const TOPICS: { value: Topic; label: string }[] = [
  { value: "kanji", label: "Kanji" },
  { value: "grammar", label: "Grammar" },
  { value: "vocab", label: "Vocabulary" },
  { value: "reading", label: "Reading" },
];

interface TopicSelectorProps {
  selectedTopics: string | null; 
  onChange: (topics: string | null) => void;
}

export function TopicSelector({ selectedTopics, onChange }: TopicSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={(value) => {
           onChange(value ? value : null);
        }}
      >
        <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Topic" />
        </SelectTrigger>
        <SelectContent>
          {TOPICS.map((topic) => (
            <SelectItem key={topic.value} value={topic.value}>
              {topic.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}