import type {
  App,
  AppCategory,
  PipelineDefinition,
  PipelineStage,
  Role,
  StageTransition,
  StageWorkflowGraph,
  StepDefinition,
  User,
  WorkflowDefinition,
  WorkflowNode,
  WorkflowTransition,
} from './workflow-types'

// Category metadata
export const appCategoryMetadata: Record<AppCategory, { label: string; description: string; order: number }> = {
  'source-to-pay': {
    label: 'Source-to-Pay',
    description: 'Core procurement business process apps',
    order: 1,
  },
  'vendor-management': {
    label: 'Vendor Management',
    description: 'Vendor onboarding and lifecycle management',
    order: 2,
  },
  'master-data': {
    label: 'Master Data',
    description: 'Master data management workflows',
    order: 3,
  },
  'expense': {
    label: 'Expense & Travel',
    description: 'Expense and travel management',
    order: 4,
  },
  'asset': {
    label: 'Asset Management',
    description: 'Asset lifecycle workflows',
    order: 5,
  },
  'hr': {
    label: 'HR & Employee',
    description: 'HR and employee workflows',
    order: 6,
  },
}

// Platform-owned Step Definitions
export const stepDefinitions: StepDefinition[] = [
  {
    id: 'approval',
    type: 'approval',
    name: 'Approval',
    description: 'Requires one or more actors to approve or reject',
    icon: 'Tick02Icon',
    defaultActions: ['approve', 'reject', 'return'],
    actorsLabel: 'Approvers',
    actorsDescription: 'Who can approve this step',
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
    actorsLabel: 'Acknowledgers',
    actorsDescription: 'Who must acknowledge this step',
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
    actorsLabel: 'Reviewers',
    actorsDescription: 'Who can review this step',
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
    actorsLabel: 'Assignees',
    actorsDescription: 'Who can claim this step',
    configSchema: {
      supportsCompletion: false,
      supportsReassignment: true,
      supportsTimeout: true,
    },
  },
  {
    id: 'purchaser_assignment',
    type: 'assignment',
    name: 'Purchaser Assignment',
    description: 'Assigns to a purchaser (e.g. by category or pool)',
    icon: 'UserAdd01Icon',
    defaultActions: ['claim', 'release', 'reassign'],
    actorsLabel: 'Purchasers',
    actorsDescription: 'Who can be assigned as purchaser',
    configSchema: {
      supportsCompletion: false,
      supportsReassignment: true,
      supportsTimeout: true,
    },
  },
]

// Sample Apps - Based on actual Jarvis system apps
export const apps: App[] = [
  // Source-to-Pay Apps
  {
    id: 'requisition',
    name: 'Requisition',
    description: 'Purchase requisition management',
    icon: 'ShoppingCart01Icon',
    color: '#ea580c',
    category: 'source-to-pay',
    entityTypes: ['requisition'],
    workflowCount: 8,
  },
  {
    id: 'intake',
    name: 'Intake',
    description: 'Intake request management',
    icon: 'InboxIcon',
    color: '#f59e0b',
    category: 'source-to-pay',
    entityTypes: ['intake'],
    workflowCount: 1,
  },
  {
    id: 'quote-request',
    name: 'QuoteRequest',
    description: 'Request for quotation and sourcing',
    icon: 'FileSearchIcon',
    color: '#8b5cf6',
    category: 'source-to-pay',
    entityTypes: ['quote_request'],
    workflowCount: 1,
  },
  {
    id: 'negotiation-request',
    name: 'NegotiationRequest',
    description: 'Supplier negotiation and bidding',
    icon: 'MessageMultiple02Icon',
    color: '#6366f1',
    category: 'source-to-pay',
    entityTypes: ['negotiation_request'],
    workflowCount: 0,
  },
  {
    id: 'purchase-order',
    name: 'Purchase Order',
    description: 'Purchase order creation and management',
    icon: 'ShoppingBasket01Icon',
    color: '#14b8a6',
    category: 'source-to-pay',
    entityTypes: ['purchase_order'],
    workflowCount: 0,
  },
  {
    id: 'grn',
    name: 'GRN',
    description: 'Goods receipt note processing',
    icon: 'PackageIcon',
    color: '#10b981',
    category: 'source-to-pay',
    entityTypes: ['grn'],
    workflowCount: 0,
  },
  {
    id: 'qc',
    name: 'QC',
    description: 'Quality control and inspection',
    icon: 'CheckmarkBadge01Icon',
    color: '#059669',
    category: 'source-to-pay',
    entityTypes: ['qc'],
    workflowCount: 0,
  },
  {
    id: 'invoice',
    name: 'Invoice',
    description: 'Invoice processing and approval',
    icon: 'Invoice01Icon',
    color: '#16a34a',
    category: 'source-to-pay',
    entityTypes: ['invoice'],
    workflowCount: 2,
  },
  {
    id: 'payment',
    name: 'Payment',
    description: 'Payment processing and approval',
    icon: 'Wallet02Icon',
    color: '#84cc16',
    category: 'source-to-pay',
    entityTypes: ['payment'],
    workflowCount: 0,
  },
  {
    id: 'advance',
    name: 'Advance',
    description: 'Advance payment requests',
    icon: 'MoneyBag01Icon',
    color: '#eab308',
    category: 'source-to-pay',
    entityTypes: ['advance'],
    workflowCount: 0,
  },
  {
    id: 'rate-contracts',
    name: 'Rate Contracts',
    description: 'Rate contract creation and management',
    icon: 'File01Icon',
    color: '#0ea5e9',
    category: 'source-to-pay',
    entityTypes: ['rate_contract'],
    workflowCount: 0,
  },
  {
    id: 'contract',
    name: 'Contract',
    description: 'Contract approval and management',
    icon: 'File01Icon',
    color: '#3b82f6',
    category: 'source-to-pay',
    entityTypes: ['contract'],
    workflowCount: 1,
  },
  {
    id: 'boq',
    name: 'BOQ',
    description: 'Bill of quantities management',
    icon: 'FileSearchIcon',
    color: '#06b6d4',
    category: 'source-to-pay',
    entityTypes: ['boq'],
    workflowCount: 0,
  },
  {
    id: 'prc',
    name: 'PRC',
    description: 'Purchase request for change',
    icon: 'Edit02Icon',
    color: '#64748b',
    category: 'source-to-pay',
    entityTypes: ['prc'],
    workflowCount: 0,
  },
  
  // Vendor Management Apps
  {
    id: 'supplier',
    name: 'Supplier',
    description: 'Supplier master data management',
    icon: 'Building03Icon',
    color: '#9333ea',
    category: 'vendor-management',
    entityTypes: ['supplier'],
    workflowCount: 0,
  },
  {
    id: 'supplier-onboarding',
    name: 'Supplier Onboarding',
    description: 'New supplier onboarding workflow',
    icon: 'UserAdd02Icon',
    color: '#a855f7',
    category: 'vendor-management',
    entityTypes: ['supplier_onboarding'],
    workflowCount: 2,
  },
  
  // Master Data Apps
  {
    id: 'product',
    name: 'Product',
    description: 'Product master data management',
    icon: 'PackageIcon',
    color: '#ec4899',
    category: 'master-data',
    entityTypes: ['product'],
    workflowCount: 0,
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
            dynamicRules: [
              {
                id: 'rule-dynamic-1',
                field: 'category',
                operator: 'equals',
                value: 'Indirect',
              },
            ],
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
  // Supplier Onboarding Workflow
  {
    id: 'supplier-onboard-wf',
    name: 'Supplier Onboarding Workflow',
    description: 'Complete supplier onboarding process',
    version: 'v2.0',
    appId: 'supplier-onboarding',
    entityType: 'supplier',
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
  // Supplier Lifecycle Workflow
  {
    id: 'supplier-lifecycle-wf',
    name: 'Supplier Status Change Workflow',
    description: 'Workflow for supplier status changes',
    version: 'v1.0',
    appId: 'supplier-onboarding',
    entityType: 'supplier',
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

export const getAppsByCategory = (): Record<AppCategory, App[]> => {
  const grouped = apps.reduce((acc, app) => {
    if (!acc[app.category]) {
      acc[app.category] = []
    }
    acc[app.category].push(app)
    return acc
  }, {} as Record<AppCategory, App[]>)
  
  return grouped
}

export const getActiveCategories = (): AppCategory[] => {
  const categories = new Set(apps.map(app => app.category))
  return Array.from(categories).sort((a, b) =>
    appCategoryMetadata[a].order - appCategoryMetadata[b].order
  )
}

// ============================================
// ProcureToPay Pipeline Data
// ============================================

// ProcureToPay Pipeline Stages
export const procureToPayPipelineStages: PipelineStage[] = [
  {
    id: 'stage-intake',
    appId: 'intake',
    name: 'Intake',
    description: 'Initial request intake',
    icon: 'InboxIcon',
    color: '#f59e0b',
    status: 'enabled',
    position: { x: 100, y: 200 },
  },
  {
    id: 'stage-requisition',
    appId: 'requisition',
    name: 'Requisition',
    description: 'Purchase requisition',
    icon: 'ShoppingCart01Icon',
    color: '#ea580c',
    status: 'enabled',
    position: { x: 280, y: 200 },
  },
  {
    id: 'stage-quote-request',
    appId: 'quote-request',
    name: 'Quote Request',
    description: 'Request for quotation',
    icon: 'FileSearchIcon',
    color: '#8b5cf6',
    status: 'enabled',
    position: { x: 460, y: 200 },
  },
  {
    id: 'stage-negotiation',
    appId: 'negotiation-request',
    name: 'Negotiation',
    description: 'Supplier negotiation',
    icon: 'MessageMultiple02Icon',
    color: '#6366f1',
    status: 'disabled',
    position: { x: 640, y: 200 },
  },
  {
    id: 'stage-purchase-order',
    appId: 'purchase-order',
    name: 'Purchase Order',
    description: 'PO creation',
    icon: 'ShoppingBasket01Icon',
    color: '#14b8a6',
    status: 'disabled',
    position: { x: 820, y: 200 },
  },
  {
    id: 'stage-grn',
    appId: 'grn',
    name: 'GRN',
    description: 'Goods receipt',
    icon: 'PackageIcon',
    color: '#10b981',
    status: 'disabled',
    position: { x: 1000, y: 200 },
  },
  {
    id: 'stage-qc',
    appId: 'qc',
    name: 'QC',
    description: 'Quality control',
    icon: 'CheckmarkBadge01Icon',
    color: '#059669',
    status: 'disabled',
    position: { x: 1180, y: 200 },
  },
  {
    id: 'stage-invoice',
    appId: 'invoice',
    name: 'Invoice',
    description: 'Invoice processing',
    icon: 'Invoice01Icon',
    color: '#16a34a',
    status: 'enabled',
    position: { x: 1360, y: 200 },
  },
  {
    id: 'stage-payment',
    appId: 'payment',
    name: 'Payment',
    description: 'Payment processing',
    icon: 'Wallet02Icon',
    color: '#84cc16',
    status: 'disabled',
    position: { x: 1540, y: 200 },
  },
]

// ProcureToPay Pipeline Transitions (linear flow for now)
export const procureToPayPipelineTransitions: StageTransition[] = [
  { id: 'tr-start-intake', fromStageId: 'start', toStageId: 'stage-intake' },
  { id: 'tr-intake-req', fromStageId: 'stage-intake', toStageId: 'stage-requisition' },
  { id: 'tr-req-quote', fromStageId: 'stage-requisition', toStageId: 'stage-quote-request' },
  { id: 'tr-quote-neg', fromStageId: 'stage-quote-request', toStageId: 'stage-negotiation' },
  { id: 'tr-neg-po', fromStageId: 'stage-negotiation', toStageId: 'stage-purchase-order' },
  { id: 'tr-po-grn', fromStageId: 'stage-purchase-order', toStageId: 'stage-grn' },
  { id: 'tr-grn-qc', fromStageId: 'stage-grn', toStageId: 'stage-qc' },
  { id: 'tr-qc-inv', fromStageId: 'stage-qc', toStageId: 'stage-invoice' },
  { id: 'tr-inv-pay', fromStageId: 'stage-invoice', toStageId: 'stage-payment' },
  { id: 'tr-pay-end', fromStageId: 'stage-payment', toStageId: 'end' },
]

// ProcureToPay Pipeline Definition
export const procureToPayPipeline: PipelineDefinition = {
  id: 'procure-to-pay-pipeline',
  name: 'Procure-to-Pay Pipeline',
  description: 'End-to-end procurement workflow from intake to payment',
  stages: procureToPayPipelineStages,
  transitions: procureToPayPipelineTransitions,
}

// ============================================
// Stage Workflow Graphs (workflows within each stage)
// ============================================

// Intake stage workflows
export const intakeStageWorkflowGraph: StageWorkflowGraph = {
  stageId: 'stage-intake',
  workflows: [
    { workflowId: 'intake-approval-wf', position: { x: 300, y: 150 } },
  ],
  transitions: [
    { id: 'wt-1', fromWorkflowId: 'stage_start', toWorkflowId: 'intake-approval-wf', relationType: 'sequential' },
    { id: 'wt-2', fromWorkflowId: 'intake-approval-wf', toWorkflowId: 'stage_end', relationType: 'sequential' },
  ],
}

// Requisition stage workflows - organized by lifecycle operation
export const requisitionStageWorkflowGraph: StageWorkflowGraph = {
  stageId: 'stage-requisition',
  workflows: [
    { workflowId: 'req-approval-wf', position: { x: 300, y: 150 } },
    { workflowId: 'req-purchaser-assignment-wf', position: { x: 300, y: 340 } },
    { workflowId: 'req-amend-wf', position: { x: 300, y: 150 } },
    { workflowId: 'req-partial-fulfillment-wf', position: { x: 300, y: 340 } },
    { workflowId: 'req-cancel-wf', position: { x: 300, y: 150 } },
  ],
  transitions: [
    // Create flow: Approval -> Purchaser Assignment -> End
    { id: 'wt-1', fromWorkflowId: 'stage_start', toWorkflowId: 'req-approval-wf', relationType: 'sequential' },
    { id: 'wt-2', fromWorkflowId: 'req-approval-wf', toWorkflowId: 'req-purchaser-assignment-wf', relationType: 'sequential' },
    { id: 'wt-3', fromWorkflowId: 'req-purchaser-assignment-wf', toWorkflowId: 'stage_end', relationType: 'sequential' },
    // Amend flow: Amend -> Partial Fulfillment -> End
    { id: 'wt-4', fromWorkflowId: 'stage_start', toWorkflowId: 'req-amend-wf', relationType: 'sequential' },
    { id: 'wt-5', fromWorkflowId: 'req-amend-wf', toWorkflowId: 'req-partial-fulfillment-wf', relationType: 'sequential' },
    { id: 'wt-6', fromWorkflowId: 'req-partial-fulfillment-wf', toWorkflowId: 'stage_end', relationType: 'sequential' },
    // Cancel flow: Cancel -> End
    { id: 'wt-7', fromWorkflowId: 'stage_start', toWorkflowId: 'req-cancel-wf', relationType: 'sequential' },
    { id: 'wt-8', fromWorkflowId: 'req-cancel-wf', toWorkflowId: 'stage_end', relationType: 'sequential' },
  ],
}

// Quote Request stage workflows
export const quoteRequestStageWorkflowGraph: StageWorkflowGraph = {
  stageId: 'stage-quote-request',
  workflows: [
    { workflowId: 'quote-request-wf', position: { x: 300, y: 150 } },
  ],
  transitions: [
    { id: 'wt-1', fromWorkflowId: 'stage_start', toWorkflowId: 'quote-request-wf', relationType: 'sequential' },
    { id: 'wt-2', fromWorkflowId: 'quote-request-wf', toWorkflowId: 'stage_end', relationType: 'sequential' },
  ],
}

// Invoice stage workflows (example with parallel workflows)
export const invoiceStageWorkflowGraph: StageWorkflowGraph = {
  stageId: 'stage-invoice',
  workflows: [
    { workflowId: 'inv-create-wf', position: { x: 200, y: 150 } },
    { workflowId: 'inv-cancel-wf', position: { x: 500, y: 150 } },
  ],
  transitions: [
    { id: 'wt-1', fromWorkflowId: 'stage_start', toWorkflowId: 'inv-create-wf', relationType: 'parallel' },
    { id: 'wt-2', fromWorkflowId: 'stage_start', toWorkflowId: 'inv-cancel-wf', relationType: 'parallel' },
    { id: 'wt-3', fromWorkflowId: 'inv-create-wf', toWorkflowId: 'stage_end', relationType: 'sequential' },
    { id: 'wt-4', fromWorkflowId: 'inv-cancel-wf', toWorkflowId: 'stage_end', relationType: 'sequential' },
  ],
}

// Map of all stage workflow graphs
export const stageWorkflowGraphs: Record<string, StageWorkflowGraph> = {
  'stage-intake': intakeStageWorkflowGraph,
  'stage-requisition': requisitionStageWorkflowGraph,
  'stage-quote-request': quoteRequestStageWorkflowGraph,
  'stage-invoice': invoiceStageWorkflowGraph,
}

// Additional workflows for ProcureToPay stages
export const intakeApprovalWorkflow: WorkflowDefinition = {
  id: 'intake-approval-wf',
  name: 'Intake Approval Workflow',
  description: 'Standard approval workflow for intake requests',
  version: 'v1.0',
  appId: 'intake',
  entityType: 'intake',
  operation: 'create',
  status: 'published',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-20T14:30:00Z',
  steps: [
    {
      id: 'step-1',
      definitionId: 'approval',
      name: 'Initial Review',
      type: 'approval',
      position: { x: 400, y: 150 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['l1_approver'],
          allowReassignment: true,
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 24 },
        conditions: { appliesTo: ['create'], rules: [] },
        notifications: {
          onEntry: { notifyActors: true, notifyRequester: false },
          onCompletion: { notifyRequester: true, notifyNextActors: true },
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
}

export const quoteRequestWorkflow: WorkflowDefinition = {
  id: 'quote-request-wf',
  name: 'Quote Request Workflow',
  description: 'Workflow for processing quote requests',
  version: 'v1.0',
  appId: 'quote-request',
  entityType: 'quote_request',
  operation: 'create',
  status: 'published',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-20T14:30:00Z',
  steps: [
    {
      id: 'step-1',
      definitionId: 'review',
      name: 'Quote Review',
      type: 'review',
      position: { x: 400, y: 150 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['purchaser'],
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
      name: 'Sourcing Approval',
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
}

// Requisition Approval Workflow - Multi-level approval based on amount
export const requisitionApprovalWorkflow: WorkflowDefinition = {
  id: 'req-approval-wf',
  name: 'Approval Workflow',
  description: 'Multi-level approval workflow for requisitions based on value thresholds',
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
      name: 'Manager Approval',
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
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 24 },
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
      name: 'Finance Review',
      type: 'approval',
      position: { x: 400, y: 270 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['finance_manager'],
          allowReassignment: true,
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 48 },
        conditions: {
          appliesTo: ['create'],
          rules: [
            { id: 'rule-1', field: 'amount', operator: 'greater_than', value: 5000 },
          ],
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
      name: 'Director Approval',
      type: 'approval',
      position: { x: 400, y: 390 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['l2_approver'],
          allowReassignment: false,
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 72 },
        conditions: {
          appliesTo: ['create'],
          rules: [
            { id: 'rule-1', field: 'amount', operator: 'greater_than', value: 25000 },
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
    { id: 'tr-3', fromStepId: 'step-1', toStepId: 'end', action: 'reject' },
    { id: 'tr-4', fromStepId: 'step-2', toStepId: 'step-3', action: 'approve' },
    { id: 'tr-5', fromStepId: 'step-2', toStepId: 'end', action: 'reject' },
    { id: 'tr-6', fromStepId: 'step-3', toStepId: 'end', action: 'approve' },
    { id: 'tr-7', fromStepId: 'step-3', toStepId: 'end', action: 'reject' },
  ],
}

// Requisition Purchaser Assignment Workflow - Assigns purchaser based on category
export const requisitionPurchaserAssignmentWorkflow: WorkflowDefinition = {
  id: 'req-purchaser-assignment-wf',
  name: 'Purchaser Assignment Workflow',
  description: 'Assigns a purchaser to handle the requisition based on category and workload',
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
      definitionId: 'assignment',
      name: 'Category-Based Assignment',
      type: 'assignment',
      position: { x: 400, y: 150 },
      config: {
        actors: {
          assignmentType: 'dynamic',
          dynamicRule: 'purchaser-pool-by-category',
          dynamicRules: [
            { id: 'rule-1', field: 'category', operator: 'equals', value: 'IT' },
          ],
          allowReassignment: true,
          reassignmentType: 'roles',
          reassignmentRoleIds: ['purchaser'],
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 8 },
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
      definitionId: 'acknowledgement',
      name: 'Purchaser Acknowledgement',
      type: 'acknowledgement',
      position: { x: 400, y: 270 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['purchaser'],
          allowReassignment: false,
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 4 },
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
    { id: 'tr-2', fromStepId: 'step-1', toStepId: 'step-2', action: 'claim' },
    { id: 'tr-3', fromStepId: 'step-2', toStepId: 'end', action: 'acknowledge' },
  ],
}

// Requisition Amend Workflow - For changes to existing requisitions
export const requisitionAmendWorkflow: WorkflowDefinition = {
  id: 'req-amend-wf',
  name: 'Amend Workflow',
  description: 'Approval workflow for requisition amendments and changes',
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
      definitionId: 'review',
      name: 'Change Impact Review',
      type: 'review',
      position: { x: 400, y: 150 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['purchaser'],
          allowReassignment: true,
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 24 },
        conditions: { appliesTo: ['amend'], rules: [] },
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
      name: 'Amendment Approval',
      type: 'approval',
      position: { x: 400, y: 270 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['l1_approver'],
          allowReassignment: true,
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 48 },
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
    { id: 'tr-2', fromStepId: 'step-1', toStepId: 'step-2', action: 'submit_review' },
    { id: 'tr-3', fromStepId: 'step-2', toStepId: 'end', action: 'approve' },
    { id: 'tr-4', fromStepId: 'step-2', toStepId: 'end', action: 'reject' },
  ],
}

// Requisition Partial Fulfillment Workflow - When not all items can be fulfilled
export const requisitionPartialFulfillmentWorkflow: WorkflowDefinition = {
  id: 'req-partial-fulfillment-wf',
  name: 'Partial Fulfillment Workflow',
  description: 'Handles cases where only some items can be fulfilled (e.g., requested 10, received 7)',
  version: 'v1.0',
  appId: 'requisition',
  entityType: 'requisition',
  operation: 'amend',
  status: 'published',
  createdAt: '2025-01-17T10:00:00Z',
  updatedAt: '2025-01-22T14:30:00Z',
  steps: [
    {
      id: 'step-1',
      definitionId: 'review',
      name: 'Fulfillment Gap Review',
      type: 'review',
      position: { x: 400, y: 150 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['purchaser'],
          allowReassignment: true,
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 24 },
        conditions: { appliesTo: ['amend'], rules: [] },
        notifications: {
          onEntry: { notifyActors: true, notifyRequester: true },
          onCompletion: { notifyRequester: true, notifyNextActors: true },
        },
        visibility: { type: 'all_participants' },
      },
    },
    {
      id: 'step-2',
      definitionId: 'acknowledgement',
      name: 'Requester Acknowledgement',
      type: 'acknowledgement',
      position: { x: 400, y: 270 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['requester'],
          allowReassignment: false,
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 48 },
        conditions: { appliesTo: ['amend'], rules: [] },
        notifications: {
          onEntry: { notifyActors: true, notifyRequester: false },
          onCompletion: { notifyRequester: false, notifyNextActors: true },
        },
        visibility: { type: 'all_participants' },
      },
    },
    {
      id: 'step-3',
      definitionId: 'approval',
      name: 'Manager Sign-off',
      type: 'approval',
      position: { x: 400, y: 390 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['l1_approver'],
          allowReassignment: true,
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 24 },
        conditions: {
          appliesTo: ['amend'],
          rules: [
            { id: 'rule-1', field: 'fulfillment_gap_percent', operator: 'greater_than', value: 20 },
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
    { id: 'tr-2', fromStepId: 'step-1', toStepId: 'step-2', action: 'submit_review' },
    { id: 'tr-3', fromStepId: 'step-2', toStepId: 'step-3', action: 'acknowledge' },
    { id: 'tr-4', fromStepId: 'step-3', toStepId: 'end', action: 'approve' },
    { id: 'tr-5', fromStepId: 'step-3', toStepId: 'end', action: 'reject' },
  ],
}

// Requisition Cancel Workflow - For cancelling requisitions
export const requisitionCancelWorkflow: WorkflowDefinition = {
  id: 'req-cancel-wf',
  name: 'Cancel Workflow',
  description: 'Approval workflow for requisition cancellation',
  version: 'v1.0',
  appId: 'requisition',
  entityType: 'requisition',
  operation: 'cancel',
  status: 'published',
  createdAt: '2025-01-17T10:00:00Z',
  updatedAt: '2025-01-22T14:30:00Z',
  steps: [
    {
      id: 'step-1',
      definitionId: 'acknowledgement',
      name: 'Purchaser Acknowledgement',
      type: 'acknowledgement',
      position: { x: 400, y: 150 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['purchaser'],
          allowReassignment: false,
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 24 },
        conditions: { appliesTo: ['cancel'], rules: [] },
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
      name: 'Cancellation Approval',
      type: 'approval',
      position: { x: 400, y: 270 },
      config: {
        actors: {
          assignmentType: 'roles',
          roleIds: ['l1_approver'],
          allowReassignment: true,
        },
        completion: { criteria: 'any', enableTimeout: true, timeoutHours: 48 },
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
    { id: 'tr-2', fromStepId: 'step-1', toStepId: 'step-2', action: 'acknowledge' },
    { id: 'tr-3', fromStepId: 'step-2', toStepId: 'end', action: 'approve' },
    { id: 'tr-4', fromStepId: 'step-2', toStepId: 'end', action: 'reject' },
  ],
}

// Add the new workflows to workflowDefinitions - use spread to extend
export const allWorkflowDefinitions: WorkflowDefinition[] = [
  ...workflowDefinitions,
  intakeApprovalWorkflow,
  quoteRequestWorkflow,
  requisitionApprovalWorkflow,
  requisitionPurchaserAssignmentWorkflow,
  requisitionAmendWorkflow,
  requisitionPartialFulfillmentWorkflow,
  requisitionCancelWorkflow,
]

// Helper functions for ProcureToPay Pipeline
export const getPipelineById = (pipelineId: string): PipelineDefinition | undefined => {
  if (pipelineId === 'procure-to-pay-pipeline') return procureToPayPipeline
  return undefined
}

export const getStageById = (stageId: string): PipelineStage | undefined => {
  return procureToPayPipelineStages.find((stage) => stage.id === stageId)
}

export const getStageWorkflowGraph = (stageId: string): StageWorkflowGraph | undefined => {
  return stageWorkflowGraphs[stageId]
}

export const getWorkflowsForStage = (stageId: string): WorkflowDefinition[] => {
  const graph = stageWorkflowGraphs[stageId]
  if (!graph) return []

  return graph.workflows
    .map((node) => allWorkflowDefinitions.find((wf) => wf.id === node.workflowId))
    .filter((wf): wf is WorkflowDefinition => wf !== undefined)
}

export const getEnabledStages = (): PipelineStage[] => {
  return procureToPayPipelineStages.filter((stage) => stage.status === 'enabled')
}
