import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Tag } from "@/lib/supabase/supabase.types"; // Adjust the import based on your file structure

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onSelectionChange: (tags: Tag[]) => void;
  title: string;
  placeholder: string;
  type: "add" | "remove";
}

export function TagSelector({
  availableTags,
  selectedTags,
  onSelectionChange,
  title,
  placeholder,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      onSelectionChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onSelectionChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium">{title}</h4>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              className={`border cursor-pointer !bg-[${tag.color}+20] !text-[${tag.color}] !border-[${tag.color}]`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag.name}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            {placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.some((t) => t.id === tag.id);
                  return (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => handleTagToggle(tag)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full bg-[${tag.color}]`}
                        />
                        <span>{tag.name}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
