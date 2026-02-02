import type {
  App,
  AppCategory,
  Role,
  StepDefinition,
  User,
  WorkflowDefinition,
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
    workflowCount: 3,
  },
  {
    id: 'intake',
    name: 'Intake',
    description: 'Intake request management',
    icon: 'InboxIcon',
    color: '#f59e0b',
    category: 'source-to-pay',
    entityTypes: ['intake'],
    workflowCount: 0,
  },
  {
    id: 'quote-request',
    name: 'QuoteRequest',
    description: 'Request for quotation and sourcing',
    icon: 'FileSearchIcon',
    color: '#8b5cf6',
    category: 'source-to-pay',
    entityTypes: ['quote_request'],
    workflowCount: 0,
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
