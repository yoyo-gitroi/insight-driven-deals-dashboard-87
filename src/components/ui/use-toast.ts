
// Re-export the hook and toast function from the hooks directory
import * as React from "react"
import { useToast, toast, ToastProps } from "@/hooks/use-toast"

export { useToast, toast, type ToastProps }
