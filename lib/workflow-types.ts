// Step Definition - Platform-owned template
export type StepType = 'approval' | 'acknowledgement' | 'review' | 'assignment'

export interface StepDefinition {
  id: string
  type: StepType
  name: string
  description: string
  icon: string
  defaultActions: string[]
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

// App type for grouping workflows
export interface App {
  id: string
  name: string
  description: string
  icon: string
  color: string
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
