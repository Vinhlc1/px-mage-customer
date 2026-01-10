"use client";

import { Button } from "@/components/ui/button";

interface SettingsTabProps {
  onLogout: () => void;
}

function SettingsTab({ onLogout }: SettingsTabProps) {
  return (
    <div className="card-glass p-8">
      <h2 className="text-3xl font-serif font-bold mb-6">Account Settings</h2>
      <div className="space-y-4">
        <Button variant="outline">Change Password</Button>
        <Button variant="destructive" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default SettingsTab;
