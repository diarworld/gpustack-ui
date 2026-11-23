export default {
  'groups.title': 'グループ',
  'groups.button.create': 'グループを追加',
  'groups.form.create': 'グループを追加',
  'groups.form.edit': 'グループを編集',
  'groups.form.name.placeholder':
    '例: SDLC users。title/、dept/、store/ のプレフィックスは IdP 連携グループ用です。',
  'groups.form.description': '説明',
  'groups.table.members': 'メンバー',
  'groups.table.group': 'グループ',
  'groups.table.type': 'グループタイプ',
  'groups.filter.type': 'グループタイプで絞り込む',
  'groups.syncedFromIdpHint':
    'このグループのメンバーはKeyCloakから同期され、KeyCloakでのみ変更できます',
  'groups.type.profession': '職種',
  'groups.type.department': '部門',
  'groups.type.business-unit': 'ビジネスユニット',
  'groups.type.unknown': '不明',
  'groups.type.local': 'ローカル',
  'groups.type.idp': 'IdP',
  'groups.action.members': 'メンバーを管理',
  'groups.members.usersTab': 'ユーザー',
  'groups.members.subgroupsTab': 'サブグループ',
  'groups.members.add': '追加',
  'groups.members.addUsersPlaceholder': '追加するユーザーを選択',
  'groups.members.addSubgroupsPlaceholder': '追加するサブグループを選択',
  'groups.members.removeConfirm':
    'このメンバーをグループから削除しますか？ネストされたグループは、ここを通じて付与されたアクセス権を失います。',
  'groups.action.limits': '制限を管理',
  'groups.table.rpm': 'RPM',
  'groups.table.tpm': 'TPM',
  'groups.table.week': '週',
  'groups.table.month': '月',
  'groups.table.rpmHint':
    'グループメンバーの 1 分あたりリクエスト数：アカウント自身の設定がない場合、所属グループの中で最小の値が適用されます。',
  'groups.table.tpmHint':
    'グループメンバーの 1 分あたりトークン数。所属グループの中で最小の値が適用されます。',
  'groups.table.weekHint':
    'グループメンバーの 7 日間ローリングトークン予算。デプロイのデフォルトはありません。',
  'groups.table.monthHint': 'グループメンバーの暦月トークン予算。',
  'groups.limits.rpmHint':
    '1 分あたりリクエスト数。自身の明示的な制限がないメンバーに適用され、複数のグループが設定していれば最小値が採用されます。',
  'groups.limits.tpmHint':
    '1 分あたりトークン数。自身の明示的な制限がないメンバーに適用され、所属グループの中で最小の値が採用されます。',
  'groups.limits.weeklyHint':
    '自身の予算を持たないメンバーに適用される 7 日間ローリングトークン予算。所属グループの中で最小の値が採用されます。',
  'groups.limits.monthlyHint':
    '自身の予算を持たないメンバーに適用される暦月トークン予算。所属グループの中で最小の値が採用されます。',
  'groups.limits.concurrencyHint':
    'グループメンバーのモデル別同時実行上限。メンバー自身の上書きが優先され、なければ各グループの最小の非ゼロ値が適用されます。グループ側の 0 は「このグループは制限しない」を意味します。',
  'groups.limits.success': 'グループの制限を更新しました'
};
