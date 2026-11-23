export default {
  'groups.title': '用户组',
  'groups.button.create': '添加用户组',
  'groups.form.create': '添加用户组',
  'groups.form.edit': '编辑用户组',
  'groups.form.name.placeholder':
    '例如 SDLC users。前缀 title/、dept/ 和 store/ 保留给来自 IdP 的用户组。',
  'groups.form.description': '描述',
  'groups.table.members': '成员',
  'groups.table.group': '个用户组',
  'groups.table.type': '用户组类型',
  'groups.filter.type': '按用户组类型筛选',
  'groups.syncedFromIdpHint':
    '该群组的成员从 KeyCloak 同步，仅可在 KeyCloak 中变更',
  'groups.type.profession': '职位',
  'groups.type.department': '部门',
  'groups.type.business-unit': '业务单元',
  'groups.type.unknown': '未知',
  'groups.type.local': '本地',
  'groups.type.idp': 'IdP',
  'groups.action.members': '管理成员',
  'groups.members.usersTab': '用户',
  'groups.members.subgroupsTab': '子用户组',
  'groups.members.add': '添加',
  'groups.members.addUsersPlaceholder': '选择要添加的用户',
  'groups.members.addSubgroupsPlaceholder': '选择要添加的子用户组',
  'groups.members.removeConfirm':
    '确定将该成员移出用户组？嵌套的用户组将随之失去由此授予的访问权限。',
  'groups.action.limits': '管理限额',
  'groups.table.rpm': 'RPM',
  'groups.table.tpm': 'TPM',
  'groups.table.week': '周',
  'groups.table.month': '月',
  'groups.table.rpmHint':
    '组成员的每分钟请求数：取其各用户组中的最小值，除非账户自身设置了限额。',
  'groups.table.tpmHint': '组成员的每分钟令牌数；取其各用户组中的最小值。',
  'groups.table.weekHint':
    '组成员的滚动 7 天令牌预算；部署没有为它设置默认值。',
  'groups.table.monthHint': '组成员的自然月令牌预算。',
  'groups.limits.rpmHint':
    '每分钟请求数。对自身未设置显式限额的成员生效；多个用户组都设置时取最小值。',
  'groups.limits.tpmHint':
    '每分钟令牌数。对自身未设置显式限额的成员生效；取其各用户组中的最小值。',
  'groups.limits.weeklyHint':
    '对自身未设置周预算的成员生效的滚动 7 天令牌预算；取其各用户组中的最小值。',
  'groups.limits.monthlyHint':
    '对自身未设置月预算的成员生效的自然月令牌预算；取其各用户组中的最小值。',
  'groups.limits.concurrencyHint':
    '组成员的每模型并发上限。成员自己的覆盖值优先；否则取各用户组中最小的非零值；用户组上的 0 表示该组不限制该模型。',
  'groups.limits.success': '用户组限额已更新'
};
