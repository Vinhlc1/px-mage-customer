import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  username: string;
  email: string;
  cardsCount: number;
  collectedCount: number;
  completedSeriesCount: number;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSave: () => void;
}

export default function ProfileHeader({
  username,
  email,
  cardsCount,
  collectedCount,
  completedSeriesCount,
  onUsernameChange,
  onEmailChange,
  onSave
}: ProfileHeaderProps) {
  return (
    <div className="card-glass p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-3xl sm:text-4xl font-bold flex-shrink-0">
          {username.charAt(0)}
        </div>
        <div className="flex-1 text-center sm:text-left w-full">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2">{username}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Member since January 2025</p>
          <Badge className="mt-2">Total Cards: {cardsCount}</Badge>
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
            <Badge variant="outline">
              📚 {collectedCount} Cards Collected
            </Badge>
            <Badge variant="outline">
              ✅ {completedSeriesCount} Stories Completed
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="text-xs sm:text-sm font-medium mb-2 block">Username</label>
          <Input value={username} onChange={(e) => onUsernameChange(e.target.value)} className="text-sm sm:text-base" />
        </div>
        <div>
          <label className="text-xs sm:text-sm font-medium mb-2 block">Email</label>
          <Input type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} className="text-sm sm:text-base" />
        </div>
        <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
