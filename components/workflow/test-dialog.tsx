"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCanvasDialogContainer } from "./flow-canvas"

interface TestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TestDialog({ open, onOpenChange }: TestDialogProps) {
  const canvasContainer = useCanvasDialogContainer()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        container={canvasContainer ?? undefined}
        className="w-[min(32rem,calc(100vw-2rem))] sm:max-w-none"
      >
        <DialogHeader>
          <DialogTitle>Test Workflow</DialogTitle>
          <DialogDescription>
            Workflow testing will be available soon.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-2">
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
