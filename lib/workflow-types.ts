// Step Definition - Platform-owned template
export type StepType = 'approval' | 'acknowledgement' | 'review' | 'assignment'

export interface StepDefinition {
  id: string
  type: StepType
  name: string
  description: string
  icon: string
  defaultActions: string[]
  /** Label for who can act on this step (e.g. Approvers, Purchasers, Acknowledgers). Shown in graph and config. */
  actorsLabel: string
  /** Short description for the actors section (e.g. Who can approve this step). */
  actorsDescription: string
  configSchema: {
    supportsCompletion: boolean
    supportsReassignment: boolean
    supportsTimeout: boolean
  }
}

// Actor configuration for a step
export type AssignmentType = 'specific_users' | 'roles' | 'dynamic'

export interface ActorConfig {
  assignmentType: AssignmentType
  userIds?: string[]
  roleIds?: string[]
  dynamicRule?: string
  dynamicRules?: ConditionRule[]
  allowReassignment: boolean
  reassignmentType?: AssignmentType
  reassignmentRoleIds?: string[]
}

// Completion configuration
export type CompletionCriteria = 'any' | 'all'

export interface CompletionConfig {
  criteria: CompletionCriteria
  enableTimeout: boolean
  timeoutHours?: number
  escalateTo?: string
}

// Condition configuration
export interface ConditionConfig {
  appliesTo: ('create' | 'amend' | 'cancel')[]
  rules: ConditionRule[]
}

export interface ConditionRule {
  id: string
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in'
  value: string | number | string[]
}

// Notification configuration
export interface NotificationConfig {
  onEntry: {
    notifyActors: boolean
    notifyRequester: boolean
    customRecipients?: string[]
  }
  onCompletion: {
    notifyRequester: boolean
    notifyNextActors: boolean
    customRecipients?: string[]
  }
}

// Visibility configuration
export type VisibilityType = 'all_participants' | 'specific_roles'

export interface VisibilityConfig {
  type: VisibilityType
  roleIds?: string[]
}

// Step - Instance within a workflow definition
export interface Step {
  id: string
  definitionId: string
  name: string
  type: StepType
  position: { x: number; y: number }
  config: {
    actors: ActorConfig
    completion: CompletionConfig
    conditions: ConditionConfig
    notifications: NotificationConfig
    visibility: VisibilityConfig
  }
}

// Transition Definition - How steps connect
export interface TransitionDefinition {
  id: string
  fromStepId: string | 'start'
  toStepId: string | 'end'
  action?: string
  label?: string
}

// Workflow Definition - Blueprint for a workflow
export interface WorkflowDefinition {
  id: string
  name: string
  description: string
  version: string
  appId: string
  entityType: string
  operation?: 'create' | 'amend' | 'cancel'
  steps: Step[]
  transitions: TransitionDefinition[]
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

// App categories for organizing workflow consumers
export type AppCategory = 
  | 'source-to-pay'      // Core procurement flow (Requisition, Invoice, Contract, etc.)
  | 'vendor-management'  // Vendor onboarding and lifecycle
  | 'master-data'        // Other master data management (Supplier, Category, etc.)
  | 'expense'            // Expense and travel management
  | 'asset'              // Asset lifecycle management
  | 'hr'                 // HR and employee workflows

// App type for grouping workflows
export interface App {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: AppCategory
  entityTypes: string[]
  workflowCount: number
}

// User and Role types for assignment
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Role {
  id: string
  name: string
  description: string
}

// ============================================
// S2P Pipeline Types
// ============================================

// Pipeline Stage status
export type StageStatus = 'enabled' | 'disabled' | 'coming_soon'

// Pipeline Stage - represents a major stage in the S2P pipeline
export interface PipelineStage {
  id: string
  appId: string  // Links to existing App
  name: string
  description: string
  icon: string
  color: string
  status: StageStatus
  position: { x: number; y: number }
}

// Stage Transition - how stages connect in the pipeline
export interface StageTransition {
  id: string
  fromStageId: string | 'start'
  toStageId: string | 'end'
}

// Pipeline Definition - the complete S2P pipeline
export interface PipelineDefinition {
  id: string
  name: string
  description: string
  stages: PipelineStage[]
  transitions: StageTransition[]
}

// ============================================
// Stage-Level Workflow Graph Types
// ============================================

// Workflow relationship type within a stage
export type WorkflowRelationType = 'sequential' | 'parallel'

// Workflow node position within a stage
export interface WorkflowNode {
  workflowId: string
  position: { x: number; y: number }
}

// Workflow transition within a stage
export interface WorkflowTransition {
  id: string
  fromWorkflowId: string | 'stage_start'
  toWorkflowId: string | 'stage_end'
  relationType: WorkflowRelationType
}

// Stage workflow graph - defines workflow arrangement within a stage
export interface StageWorkflowGraph {
  stageId: string
  workflows: WorkflowNode[]
  transitions: WorkflowTransition[]
}
