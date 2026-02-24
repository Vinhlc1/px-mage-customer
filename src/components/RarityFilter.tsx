import { Button } from "@/components/ui/button";

export const RARITY_OPTIONS = [
  { value: "All", label: "Tất cả" },
  { value: "Common", label: "Phổ thông" },
  { value: "Rare", label: "Hiếm" },
  { value: "Epic", label: "Sử thi" },
  { value: "Legendary", label: "Huyền thoại" },
] as const;

interface RarityFilterProps {
  value: string;
  onChange: (rarity: string) => void;
}

export function RarityFilter({ value, onChange }: RarityFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {RARITY_OPTIONS.map(({ value: v, label }) => (
        <Button
          key={v}
          variant={value === v ? "default" : "outline"}
          onClick={() => onChange(v)}
          className={value === v ? "bg-primary" : ""}
          size="sm"
        >
          <span className="text-xs sm:text-sm">{label}</span>
        </Button>
      ))}
    </div>
  );
}
