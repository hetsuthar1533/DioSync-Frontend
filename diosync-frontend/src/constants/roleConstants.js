export const userRoles = {
  Owner: 'OWNER',
  Manager: 'MANAGER',
  SuperAdmin: 'ADMIN',
}

export const BulkAction = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
}

export const BulkActionModel = {
  bar_owner: 'bar_owner',
  subscription_plan: 'subscription_plan',
  category: 'category',
  sub_category: 'sub_category',
  case_size: 'case_size',
  unit_of_measure: 'unit_of_measure',
  container: 'container',
  breakage_loss_reason: 'breakage_loss_reason',
  item: 'item',
  ingredient: 'ingredient',
  bar_vanue: 'bar_vanue',
  subscriber: 'subscriber', //not used
}

export const DELETE = 'delete'
export const UPDATE = 'update'
export const VIEW = 'view'
export const LOGINUSER = 'login'
export const USER = 'user'
export const ACTIVE = 'active'
export const INACTIVE = 'In active'

export const tableFilter = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
  {
    label: 'Delete',
    value: 'delete',
  },
]
