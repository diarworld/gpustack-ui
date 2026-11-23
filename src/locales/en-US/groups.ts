export default {
  'groups.title': 'Groups',
  'groups.button.create': 'Add Group',
  'groups.form.create': 'Add Group',
  'groups.form.edit': 'Edit Group',
  'groups.form.name.placeholder':
    'e.g. SDLC users. Prefixes title/, dept/ and store/ belong to IdP-managed groups.',
  'groups.form.description': 'Description',
  'groups.table.members': 'Members',
  'groups.table.group': 'groups',
  'groups.table.type': 'Group Type',
  'groups.filter.type': 'Filter by group type',
  'groups.syncedFromIdpHint':
    'This group is synced from KeyCloak; its composition can only be changed there',
  'groups.type.profession': 'Profession',
  'groups.type.department': 'Department',
  'groups.type.business-unit': 'Business Unit',
  'groups.type.unknown': 'Unknown',
  'groups.type.local': 'Local',
  'groups.type.idp': 'IdP',
  'groups.action.members': 'Manage Members',
  'groups.members.usersTab': 'Users',
  'groups.members.subgroupsTab': 'Subgroups',
  'groups.members.add': 'Add',
  'groups.members.addUsersPlaceholder': 'Select users to add',
  'groups.members.addSubgroupsPlaceholder': 'Select subgroups to add',
  'groups.members.removeConfirm':
    'Remove this member from the group? Nested groups lose the access granted through it.',
  'groups.action.limits': 'Manage limits',
  'groups.table.rpm': 'RPM',
  'groups.table.tpm': 'TPM',
  'groups.table.week': 'Week',
  'groups.table.month': 'Month',
  'groups.table.rpmHint':
    "Requests per minute enforced for the group's members: the smallest limit across their groups applies unless the account sets its own.",
  'groups.table.tpmHint':
    "Tokens per minute for the group's members; the smallest value across their groups applies.",
  'groups.table.weekHint':
    "Rolling 7-day token budget for the group's members; no deployment default exists for it.",
  'groups.table.monthHint':
    "Calendar-month token budget for the group's members.",
  'groups.limits.rpmHint':
    'Requests per minute. Applies to members without an explicit limit of their own; when several groups set it, the smallest value wins.',
  'groups.limits.tpmHint':
    'Tokens per minute. Applies to members without an explicit limit of their own; the smallest value across their groups wins.',
  'groups.limits.weeklyHint':
    'Rolling 7-day token budget for members without one of their own; the smallest value across their groups wins.',
  'groups.limits.monthlyHint':
    'Calendar-month token budget for members without one of their own; the smallest value across their groups wins.',
  'groups.limits.concurrencyHint':
    "Per-model in-flight caps for the group's members. A member's own overrides win; otherwise the smallest non-zero group cap applies; a 0 on a group means it does not constrain the model.",
  'groups.limits.success': 'Group limits updated'
};
