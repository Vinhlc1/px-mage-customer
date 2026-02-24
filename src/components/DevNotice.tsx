import { AlertTriangle } from "lucide-react";

interface DevNoticeProps {
  /** Short feature name, e.g. "Auctions" */
  feature?: string;
  /** Override default description */
  description?: string;
}

/**
 * Yellow banner displayed below the Navbar on pages that have no backend API yet.
 * Visible to developers / testers to indicate mock / static data is being used.
 */
const DevNotice = ({
  feature = "Trang này",
  description = "chưa có API — đang hiển thị dữ liệu mẫu.",
}: DevNoticeProps) => (
  <div className="bg-amber-500/10 border-b border-amber-500/30 py-2 px-4">
    <div className="container mx-auto flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
      <span>
        <strong>[DEV]</strong> {feature} {description}
      </span>
    </div>
  </div>
);

export default DevNotice;
