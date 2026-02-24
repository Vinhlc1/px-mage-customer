"use client";

import { toast as _toast, type ToastOptions } from "react-toastify";

interface ToastInput {
  title: string;
  description?: string;
  /** "destructive" → error toast, anything else → success */
  variant?: "default" | "destructive";
}

const ToastContent = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <div>
    <p className="font-semibold text-sm leading-snug">{title}</p>
    {description && (
      <p className="text-xs mt-0.5 opacity-90 leading-snug">{description}</p>
    )}
  </div>
);

const baseOpts: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export function toast({ title, description, variant }: ToastInput) {
  const content = <ToastContent title={title} description={description} />;
  if (variant === "destructive") {
    _toast.error(content, baseOpts);
  } else {
    _toast.success(content, baseOpts);
  }
}

export function useToast() {
  return { toast };
}
