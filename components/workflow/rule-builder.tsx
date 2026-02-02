"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import type { ConditionRule } from "@/lib/workflow-types"
import { cn } from "@/lib/utils"

export type RuleFieldOption = {
  id: string
  label: string
  valueType: "string" | "number"
}

export const defaultRuleFields: RuleFieldOption[] = [
  { id: "amount", label: "Amount", valueType: "number" },
  { id: "category", label: "Category", valueType: "string" },
  { id: "department", label: "Department", valueType: "string" },
  { id: "region", label: "Region", valueType: "string" },
  { id: "vendor", label: "Vendor", valueType: "string" },
  { id: "currency", label: "Currency", valueType: "string" },
]

const operatorOptions: Array<{ value: ConditionRule["operator"]; label: string }> = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not equals" },
  { value: "greater_than", label: "Greater than" },
  { value: "less_than", label: "Less than" },
  { value: "contains", label: "Contains" },
  { value: "in", label: "In list" },
]

const normalizeValue = (
  rawValue: string,
  valueType: RuleFieldOption["valueType"],
  operator: ConditionRule["operator"]
) => {
  if (operator === "in") {
    return rawValue
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
  }

  if (valueType === "number") {
    const parsed = Number(rawValue)
    return Number.isNaN(parsed) ? rawValue : parsed
  }

  return rawValue
}

const formatValue = (value: ConditionRule["value"]) => {
  if (Array.isArray(value)) {
    return value.join(", ")
  }
  return String(value ?? "")
}

interface RuleBuilderProps {
  rules: ConditionRule[]
  onRulesChange: (nextRules: ConditionRule[]) => void
  fields?: RuleFieldOption[]
  emptyState?: string
  className?: string
}

export function RuleBuilder({
  rules,
  onRulesChange,
  fields = defaultRuleFields,
  emptyState = "No rules added yet.",
  className,
}: RuleBuilderProps) {
  const handleAddRule = () => {
    const defaultField = fields[0]
    const nextRule: ConditionRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      field: defaultField?.id ?? "field",
      operator: "equals",
      value: "",
    }
    onRulesChange([...rules, nextRule])
  }

  const handleRemoveRule = (ruleId: string) => {
    onRulesChange(rules.filter((rule) => rule.id !== ruleId))
  }

  const handleUpdateRule = (ruleId: string, updates: Partial<ConditionRule>) => {
    onRulesChange(
      rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule))
    )
  }

  if (rules.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed p-3 text-sm text-muted-foreground", className)}>
        <div className="flex items-center justify-between gap-3">
          <span>{emptyState}</span>
          <Button variant="outline" size="sm" onClick={handleAddRule}>
            <HugeiconsIcon icon={Add01Icon} size={12} />
            Add rule
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {rules.map((rule) => {
        const field = fields.find((item) => item.id === rule.field) ?? fields[0]
        const valueType = field?.valueType ?? "string"
        const valuePlaceholder =
          rule.operator === "in" ? "Comma-separated values" : "Enter value"

        return (
          <div key={rule.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center">
            <Select
              value={rule.field}
              onValueChange={(next) =>
                handleUpdateRule(rule.id, {
                  field: next,
                  value: normalizeValue("", valueType, rule.operator),
                })
              }
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={rule.operator}
              onValueChange={(next) =>
                handleUpdateRule(rule.id, {
                  operator: next as ConditionRule["operator"],
                  value: normalizeValue(formatValue(rule.value), valueType, next as ConditionRule["operator"]),
                })
              }
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {operatorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              className="w-full sm:flex-1"
              placeholder={valuePlaceholder}
              type={valueType === "number" ? "number" : "text"}
              value={formatValue(rule.value)}
              onChange={(event) => {
                const rawValue = event.target.value
                handleUpdateRule(rule.id, {
                  value: normalizeValue(rawValue, valueType, rule.operator),
                })
              }}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="self-end sm:self-auto"
              onClick={() => handleRemoveRule(rule.id)}
              aria-label="Remove rule"
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
            </Button>
          </div>
        )
      })}
      <div>
        <Button variant="outline" size="sm" onClick={handleAddRule}>
          <HugeiconsIcon icon={Add01Icon} size={12} />
          Add rule
        </Button>
      </div>
    </div>
  )
}
