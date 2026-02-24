// Thin shim — re-exports from the react-toastify adapter so all existing
// call-sites (import { toast } / import { useToast }) keep working as-is.
export { toast, useToast } from "@/lib/toast";
