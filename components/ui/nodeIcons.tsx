import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  ImageIcon,
  LineChart,
  MessageSquare,
  Receipt,
  type LucideIcon,
} from "lucide-react";

import type { NodeIconId } from "@/lib/scriptedRecording";

export const NODE_ICON_MAP: Record<NodeIconId, LucideIcon> = {
  slack: MessageSquare,
  download: Download,
  excel: FileSpreadsheet,
  check: CheckCircle2,
  image: ImageIcon,
  quickbooks: LineChart,
  entry: Receipt,
};
