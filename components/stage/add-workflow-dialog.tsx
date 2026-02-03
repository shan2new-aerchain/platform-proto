"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCanvasDialogContainer } from "./stage-workflow-canvas"

interface AddWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateWorkflow: (workflow: {
    name: string
    description: string
    operation: "create" | "amend" | "cancel"
  }) => void
  stageName: string
  defaultOperation?: "create" | "amend" | "cancel"
}

export function AddWorkflowDialog({
  open,
  onOpenChange,
  onCreateWorkflow,
  stageName,
  defaultOperation = "create",
}: AddWorkflowDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [operation, setOperation] = useState<"create" | "amend" | "cancel">(defaultOperation)

  const canvasContainer = useCanvasDialogContainer()

  // Update operation when defaultOperation changes (e.g., switching tabs)
  useEffect(() => {
    setOperation(defaultOperation)
  }, [defaultOperation])

  const handleCreate = () => {
    if (!name.trim()) return

    onCreateWorkflow({
      name: name.trim(),
      description: description.trim(),
      operation,
    })

    // Reset form
    setName("")
    setDescription("")
    setOperation(defaultOperation)
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setName("")
      setDescription("")
      setOperation(defaultOperation)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent container={canvasContainer ?? undefined} className="sm:max-w-md">
        <DialogHeader className="gap-1">
          <DialogTitle>Create Workflow</DialogTitle>
          <DialogDescription>
            Add a new workflow to the {stageName} stage.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Approval Workflow"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this workflow does..."
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="operation">Operation</Label>
            <Select value={operation} onValueChange={(v) => setOperation(v as typeof operation)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="amend">Amend</SelectItem>
                <SelectItem value="cancel">Cancel</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              When should this workflow be triggered?
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
