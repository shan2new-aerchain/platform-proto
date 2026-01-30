import type {
  App,
  Role,
  StepDefinition,
  User,
  WorkflowDefinition,
} from './workflow-types'

// Platform-owned Step Definitions
export const stepDefinitions: StepDefinition[] = [
  {
    id: 'approval',
    type: 'approval',
    name: 'Approval',
    description: 'Requires one or more actors to approve or reject',
    icon: 'Tick02Icon',
    defaultActions: ['approve', 'reject', 'return'],
    configSchema: {
      supportsCompletion: true,
      supportsReassignment: true,
      supportsTimeout: true,
    },
  },
  {
    id: 'acknowledgement',
    type: 'acknowledgement',
    name: 'Acknowledgement',
    description: 'Requires actors to acknowledge they have seen the item',
    icon: 'ThumbsUpIcon',
    defaultActions: ['acknowledge'],
    configSchema: {
      supportsCompletion: true,
      supportsReassignment: false,
      supportsTimeout: true,
    },
  },
  {
    id: 'review',
    type: 'review',
    name: 'Review',
    description: 'Allows actors to review and provide feedback',
    icon: 'ViewIcon',
    defaultActions: ['submit_review', 'request_info'],
    configSchema: {
      supportsCompletion: true,
      supportsReassignment: true,
      supportsTimeout: true,
    },
  },
  {
    id: 'assignment',
    type: 'assignment',
    name: 'Assignment',
    description: 'Allows eligible actors to claim ownership',
    icon: 'UserAdd01Icon',
    defaultActions: ['claim', 'release', 'reassign'],
    configSchema: {
      supportsCompletion: false,
      supportsReassignment: true,
      supportsTimeout: true,
    },
  },
]

// Sample Apps
export const apps: App[] = [
  {
    id: 'requisition',
    name: 'Requisition',
    description: 'Purchase requisition management',
    icon: 'ShoppingCart01Icon',
    color: '#ea580c',
    entityTypes: ['requisition'],
    workflowCount: 3,
  },
  {
    id: 'invoice',
    name: 'Invoice',
    description: 'Invoice processing and approval',
    icon: 'Invoice01Icon',
    color: '#16a34a',
    entityTypes: ['invoice'],
    workflowCount: 2,
  },
  {
    id: 'vendor',
    name: 'Vendor Management',
    description: 'Vendor onboarding and lifecycle',
    icon: 'Building03Icon',
    defaultActions: [],
    color: '#9333ea',
    entityTypes: ['vendor'],
    workflowCount: 2,
  },
  {
    id: 'contract',
    name: 'Contract',
    description: 'Contract approval and management',
    icon: 'File01Icon',
    color: '#0ea5e9',
    entityTypes: ['contract'],
    workflowCount: 1,
  },
]

// Sample Roles
export const roles: Role[] = [
  { id: 'requester', name: 'Requester', description: 'Can create requests' },
  { id: 'l1_approver', name: 'L1 Approver', description: 'First level approval' },
  { id: 'l2_approver', name: 'L2 Approver', description: 'Second level approval' },
  { id: 'finance_manager', name: 'Finance Manager', description: 'Finance department head' },
  { id: 'purchaser', name: 'Purchaser', description: 'Procurement team member' },
  { id: 'vendor_manager', name: 'Vendor Manager', description: 'Manages vendor relationships' },
  { id: 'legal', name: 'Legal', description: 'Legal review team' },
]

// Sample Users
export const users: User[] = [
  { id: 'user1', name: 'John Smith', email: 'john.smith@example.com' },
  { id: 'user2', name: 'Jane Doe', email: 'jane.doe@example.com' },
  { id: 'user3', name: 'Bob Wilson', email: 'bob.wilson@example.com' },
  { id: 'user4', name: 'Alice Johnson', email: 'alice.johnson@example.com' },
  { id: 'user5', name: 'Charlie Brown', email: 'charlie.brown@example.com' },
]

// Sample Workflow Definitions
export const workflowDefinitions: WorkflowDefinition[] = [
  // Requisition Create Workflow
  {
    id: 'req-create-wf',
    name: 'Requisition Create Workflow',
    description: 'Standard approval workflow for new requisitions',
    version: 'v1.0',
    appId: 'requisition',
    entityType: 'requisition',
    operation: 'create',
    status: 'published',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
    steps: [
      {
        id: 'step-1',
        definitionId: 'approval',
        name: 'L1 Approval',
        type: 'approval',
        position: { x: 400, y: 150 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['l1_approver'],
            allowReassignment: true,
            reassignmentType: 'roles',
            reassignmentRoleIds: ['l1_approver', 'l2_approver'],
          },
          completion: {
            criteria: 'any',
            enableTimeout: true,
            timeoutHours: 48,
            escalateTo: 'l2_approver',
          },
          conditions: {
            appliesTo: ['create', 'amend'],
            rules: [],
          },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: true },
          },
          visibility: { type: 'all_participants' },
        },
      },
      {
        id: 'step-2',
        definitionId: 'assignment',
        name: 'Purchaser Assignment',
        type: 'assignment',
        position: { x: 400, y: 300 },
        config: {
          actors: {
            assignmentType: 'dynamic',
            dynamicRule: 'purchaser-pool-by-category',
            allowReassignment: true,
            reassignmentType: 'roles',
            reassignmentRoleIds: ['purchaser'],
          },
          completion: {
            criteria: 'any',
            enableTimeout: true,
            timeoutHours: 24,
          },
          conditions: {
            appliesTo: ['create'],
            rules: [],
          },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: true },
          },
          visibility: { type: 'all_participants' },
        },
      },
      {
        id: 'step-3',
        definitionId: 'approval',
        name: 'L2 Approval',
        type: 'approval',
        position: { x: 400, y: 450 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['l2_approver', 'finance_manager'],
            allowReassignment: true,
            reassignmentType: 'roles',
            reassignmentRoleIds: ['finance_manager'],
          },
          completion: {
            criteria: 'all',
            enableTimeout: true,
            timeoutHours: 72,
          },
          conditions: {
            appliesTo: ['create', 'amend'],
            rules: [
              { id: 'rule-1', field: 'amount', operator: 'greater_than', value: 10000 },
            ],
          },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: false },
          },
          visibility: { type: 'all_participants' },
        },
      },
    ],
    transitions: [
      { id: 'tr-1', fromStepId: 'start', toStepId: 'step-1' },
      { id: 'tr-2', fromStepId: 'step-1', toStepId: 'step-2', action: 'approve' },
      { id: 'tr-3', fromStepId: 'step-1', toStepId: 'end', action: 'reject', label: 'Rejected' },
      { id: 'tr-4', fromStepId: 'step-2', toStepId: 'step-3', action: 'claim' },
      { id: 'tr-5', fromStepId: 'step-3', toStepId: 'end', action: 'approve', label: 'Approved' },
      { id: 'tr-6', fromStepId: 'step-3', toStepId: 'end', action: 'reject', label: 'Rejected' },
    ],
  },
  // Requisition Amend Workflow
  {
    id: 'req-amend-wf',
    name: 'Requisition Amend Workflow',
    description: 'Approval workflow for requisition amendments',
    version: 'v1.0',
    appId: 'requisition',
    entityType: 'requisition',
    operation: 'amend',
    status: 'published',
    createdAt: '2025-01-16T10:00:00Z',
    updatedAt: '2025-01-21T14:30:00Z',
    steps: [
      {
        id: 'step-1',
        definitionId: 'approval',
        name: 'Amendment Approval',
        type: 'approval',
        position: { x: 400, y: 150 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['l1_approver'],
            allowReassignment: true,
          },
          completion: { criteria: 'any', enableTimeout: false },
          conditions: { appliesTo: ['amend'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: false },
          },
          visibility: { type: 'all_participants' },
        },
      },
    ],
    transitions: [
      { id: 'tr-1', fromStepId: 'start', toStepId: 'step-1' },
      { id: 'tr-2', fromStepId: 'step-1', toStepId: 'end', action: 'approve' },
      { id: 'tr-3', fromStepId: 'step-1', toStepId: 'end', action: 'reject' },
    ],
  },
  // Requisition Cancel Workflow  
  {
    id: 'req-cancel-wf',
    name: 'Requisition Cancel Workflow',
    description: 'Approval workflow for requisition cancellation',
    version: 'v1.0',
    appId: 'requisition',
    entityType: 'requisition',
    operation: 'cancel',
    status: 'draft',
    createdAt: '2025-01-17T10:00:00Z',
    updatedAt: '2025-01-22T14:30:00Z',
    steps: [
      {
        id: 'step-1',
        definitionId: 'acknowledgement',
        name: 'Cancellation Acknowledgement',
        type: 'acknowledgement',
        position: { x: 400, y: 150 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['purchaser'],
            allowReassignment: false,
          },
          completion: { criteria: 'all', enableTimeout: false },
          conditions: { appliesTo: ['cancel'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: false },
          },
          visibility: { type: 'all_participants' },
        },
      },
    ],
    transitions: [
      { id: 'tr-1', fromStepId: 'start', toStepId: 'step-1' },
      { id: 'tr-2', fromStepId: 'step-1', toStepId: 'end', action: 'acknowledge' },
    ],
  },
  // Invoice Create Workflow
  {
    id: 'inv-create-wf',
    name: 'Invoice Approval Workflow',
    description: 'Three-way match and approval for invoices',
    version: 'v1.2',
    appId: 'invoice',
    entityType: 'invoice',
    operation: 'create',
    status: 'published',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-25T14:30:00Z',
    steps: [
      {
        id: 'step-1',
        definitionId: 'review',
        name: 'Three-Way Match Review',
        type: 'review',
        position: { x: 400, y: 150 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['finance_manager'],
            allowReassignment: true,
          },
          completion: { criteria: 'any', enableTimeout: false },
          conditions: { appliesTo: ['create'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: true },
          },
          visibility: { type: 'all_participants' },
        },
      },
      {
        id: 'step-2',
        definitionId: 'approval',
        name: 'Finance Approval',
        type: 'approval',
        position: { x: 400, y: 300 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['finance_manager'],
            allowReassignment: true,
          },
          completion: { criteria: 'any', enableTimeout: true, timeoutHours: 48 },
          conditions: { appliesTo: ['create'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: false },
          },
          visibility: { type: 'all_participants' },
        },
      },
    ],
    transitions: [
      { id: 'tr-1', fromStepId: 'start', toStepId: 'step-1' },
      { id: 'tr-2', fromStepId: 'step-1', toStepId: 'step-2', action: 'submit_review' },
      { id: 'tr-3', fromStepId: 'step-2', toStepId: 'end', action: 'approve' },
      { id: 'tr-4', fromStepId: 'step-2', toStepId: 'end', action: 'reject' },
    ],
  },
  // Invoice Cancel Workflow
  {
    id: 'inv-cancel-wf',
    name: 'Invoice Cancel Workflow',
    description: 'Workflow for cancelling invoices',
    version: 'v1.0',
    appId: 'invoice',
    entityType: 'invoice',
    operation: 'cancel',
    status: 'draft',
    createdAt: '2025-01-18T10:00:00Z',
    updatedAt: '2025-01-23T14:30:00Z',
    steps: [
      {
        id: 'step-1',
        definitionId: 'approval',
        name: 'Cancel Approval',
        type: 'approval',
        position: { x: 400, y: 150 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['finance_manager'],
            allowReassignment: false,
          },
          completion: { criteria: 'any', enableTimeout: false },
          conditions: { appliesTo: ['cancel'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: false },
          },
          visibility: { type: 'all_participants' },
        },
      },
    ],
    transitions: [
      { id: 'tr-1', fromStepId: 'start', toStepId: 'step-1' },
      { id: 'tr-2', fromStepId: 'step-1', toStepId: 'end', action: 'approve' },
      { id: 'tr-3', fromStepId: 'step-1', toStepId: 'end', action: 'reject' },
    ],
  },
  // Vendor Onboarding Workflow
  {
    id: 'vendor-onboard-wf',
    name: 'Vendor Onboarding Workflow',
    description: 'Complete vendor onboarding process',
    version: 'v2.0',
    appId: 'vendor',
    entityType: 'vendor',
    operation: 'create',
    status: 'published',
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-28T14:30:00Z',
    steps: [
      {
        id: 'step-1',
        definitionId: 'review',
        name: 'Document Review',
        type: 'review',
        position: { x: 400, y: 150 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['vendor_manager'],
            allowReassignment: true,
          },
          completion: { criteria: 'any', enableTimeout: true, timeoutHours: 72 },
          conditions: { appliesTo: ['create'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: true },
            onCompletion: { notifyRequester: true, notifyNextActors: true },
          },
          visibility: { type: 'all_participants' },
        },
      },
      {
        id: 'step-2',
        definitionId: 'approval',
        name: 'Legal Review',
        type: 'approval',
        position: { x: 400, y: 300 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['legal'],
            allowReassignment: true,
          },
          completion: { criteria: 'any', enableTimeout: true, timeoutHours: 120 },
          conditions: { appliesTo: ['create'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: true },
          },
          visibility: { type: 'specific_roles', roleIds: ['legal', 'vendor_manager'] },
        },
      },
      {
        id: 'step-3',
        definitionId: 'approval',
        name: 'Final Approval',
        type: 'approval',
        position: { x: 400, y: 450 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['finance_manager', 'vendor_manager'],
            allowReassignment: false,
          },
          completion: { criteria: 'all', enableTimeout: false },
          conditions: { appliesTo: ['create'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: false },
          },
          visibility: { type: 'all_participants' },
        },
      },
    ],
    transitions: [
      { id: 'tr-1', fromStepId: 'start', toStepId: 'step-1' },
      { id: 'tr-2', fromStepId: 'step-1', toStepId: 'step-2', action: 'submit_review' },
      { id: 'tr-3', fromStepId: 'step-1', toStepId: 'end', action: 'reject' },
      { id: 'tr-4', fromStepId: 'step-2', toStepId: 'step-3', action: 'approve' },
      { id: 'tr-5', fromStepId: 'step-2', toStepId: 'end', action: 'reject' },
      { id: 'tr-6', fromStepId: 'step-3', toStepId: 'end', action: 'approve' },
      { id: 'tr-7', fromStepId: 'step-3', toStepId: 'end', action: 'reject' },
    ],
  },
  // Vendor Lifecycle Workflow
  {
    id: 'vendor-lifecycle-wf',
    name: 'Vendor Status Change Workflow',
    description: 'Workflow for vendor status changes',
    version: 'v1.0',
    appId: 'vendor',
    entityType: 'vendor',
    operation: 'amend',
    status: 'published',
    createdAt: '2025-01-12T10:00:00Z',
    updatedAt: '2025-01-26T14:30:00Z',
    steps: [
      {
        id: 'step-1',
        definitionId: 'approval',
        name: 'Status Change Approval',
        type: 'approval',
        position: { x: 400, y: 150 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['vendor_manager'],
            allowReassignment: true,
          },
          completion: { criteria: 'any', enableTimeout: false },
          conditions: { appliesTo: ['amend'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: false },
          },
          visibility: { type: 'all_participants' },
        },
      },
    ],
    transitions: [
      { id: 'tr-1', fromStepId: 'start', toStepId: 'step-1' },
      { id: 'tr-2', fromStepId: 'step-1', toStepId: 'end', action: 'approve' },
      { id: 'tr-3', fromStepId: 'step-1', toStepId: 'end', action: 'reject' },
    ],
  },
  // Contract Approval Workflow
  {
    id: 'contract-approval-wf',
    name: 'Contract Approval Workflow',
    description: 'Multi-level contract approval process',
    version: 'v1.5',
    appId: 'contract',
    entityType: 'contract',
    operation: 'create',
    status: 'published',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-27T14:30:00Z',
    steps: [
      {
        id: 'step-1',
        definitionId: 'review',
        name: 'Legal Review',
        type: 'review',
        position: { x: 400, y: 150 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['legal'],
            allowReassignment: true,
          },
          completion: { criteria: 'any', enableTimeout: true, timeoutHours: 96 },
          conditions: { appliesTo: ['create'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: true },
          },
          visibility: { type: 'specific_roles', roleIds: ['legal'] },
        },
      },
      {
        id: 'step-2',
        definitionId: 'approval',
        name: 'Business Approval',
        type: 'approval',
        position: { x: 400, y: 300 },
        config: {
          actors: {
            assignmentType: 'roles',
            roleIds: ['l2_approver'],
            allowReassignment: true,
          },
          completion: { criteria: 'any', enableTimeout: true, timeoutHours: 48 },
          conditions: { appliesTo: ['create'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: true },
          },
          visibility: { type: 'all_participants' },
        },
      },
      {
        id: 'step-3',
        definitionId: 'acknowledgement',
        name: 'Stakeholder Acknowledgement',
        type: 'acknowledgement',
        position: { x: 400, y: 450 },
        config: {
          actors: {
            assignmentType: 'specific_users',
            userIds: ['user1', 'user2'],
            allowReassignment: false,
          },
          completion: { criteria: 'all', enableTimeout: false },
          conditions: { appliesTo: ['create'], rules: [] },
          notifications: {
            onEntry: { notifyActors: true, notifyRequester: false },
            onCompletion: { notifyRequester: true, notifyNextActors: false },
          },
          visibility: { type: 'all_participants' },
        },
      },
    ],
    transitions: [
      { id: 'tr-1', fromStepId: 'start', toStepId: 'step-1' },
      { id: 'tr-2', fromStepId: 'step-1', toStepId: 'step-2', action: 'submit_review' },
      { id: 'tr-3', fromStepId: 'step-2', toStepId: 'step-3', action: 'approve' },
      { id: 'tr-4', fromStepId: 'step-2', toStepId: 'end', action: 'reject' },
      { id: 'tr-5', fromStepId: 'step-3', toStepId: 'end', action: 'acknowledge' },
    ],
  },
]

// Helper functions
export const getWorkflowsByApp = (appId: string): WorkflowDefinition[] => {
  return workflowDefinitions.filter((wf) => wf.appId === appId)
}

export const getAppById = (appId: string): App | undefined => {
  return apps.find((app) => app.id === appId)
}

export const getWorkflowById = (workflowId: string): WorkflowDefinition | undefined => {
  return workflowDefinitions.find((wf) => wf.id === workflowId)
}

export const getStepDefinitionById = (definitionId: string): StepDefinition | undefined => {
  return stepDefinitions.find((sd) => sd.id === definitionId)
}

export const getRoleById = (roleId: string): Role | undefined => {
  return roles.find((r) => r.id === roleId)
}

export const getUserById = (userId: string): User | undefined => {
  return users.find((u) => u.id === userId)
}
