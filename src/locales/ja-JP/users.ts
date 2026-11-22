export default {
  'users.title': 'ユーザー',
  'users.button.create': 'ユーザーを追加',
  'users.form.edit': 'ユーザーを編集',
  'users.form.create': 'ユーザーを追加',
  'users.table.username': 'ユーザー名',
  'users.table.role': '役割',
  'users.table.status': 'ステータス',
  'users.status.active': 'アクティブ',
  'users.status.inactive': '非アクティブ',
  'users.form.active': 'アクティブアカウント',
  'users.form.active.description':
    'このユーザーアカウントを有効または無効にする',
  'users.form.fullname': 'フルネーム',
  'users.form.groups': 'グループ',
  'users.form.groups.placeholder': 'グループを選択',
  'users.form.groups.hint':
    '手動で作成したローカルグループのみです。KeyCloakから同期されるグループはKeyCloakで管理します。',
  'users.form.source': 'ソース',
  'users.form.source.local': 'ローカル',
  'users.form.source.tip.switchToLocal':
    'ローカルに切り替えるには新しいパスワードが必要です。以後、ユーザーは標準のログインフォームからサインインします。',
  'users.form.source.tip.switchToExternal':
    '外部ソースに切り替えるとユーザーのローカルパスワードが削除され、設定済みの ID プロバイダーからサインインするようになります。',
  'users.table.user': 'ユーザー',
  'users.form.admin': '管理者',
  'users.form.user': '一般ユーザー',
  'users.form.newpassword': '新しいパスワード',
  'users.form.currentpassword': '現在のパスワード',
  'users.form.updatepassword': 'パスワードを変更',
  'users.form.rule.password':
    '大文字と小文字、数字、特殊文字(!@#$%^&*_+.)を含む6〜64文字で、スペースは使用できません。',
  'users.password.uppcase': '少なくとも1つの大文字を含む',
  'users.password.lowercase': '少なくとも1つの小文字を含む',
  'users.password.number': '少なくとも1つの数字を含む',
  'users.password.special': '少なくとも1つの特殊文字を含む',
  'users.password.length': '6〜64文字の長さ',
  'users.password.modify.title': 'パスワードを変更',
  'users.password.modify.description':
    'アカウントのセキュリティのため、初期パスワードを変更してください。',
  'users.password.modify.tips':
    'パスワードを定期的に更新すると、アカウントの安全を保てます。',
  'users.password.confirm': '新しいパスワードを確認',
  'users.password.confirm.empty': '新しいパスワードを確認してください。',
  'users.password.confirm.error': '入力された2つのパスワードが一致しません。',
  'users.login.title': 'ログイン',
  'users.version.islatest': 'GPUStack {version} は最新バージョンです',
  'users.version.update': 'GPUStack {version} が利用可能です',
  'users.settings.title': 'ユーザー設定',
  'users.status.activate': 'アカウントを有効化',
  'users.status.deactivate': 'アカウントを無効化',
  'users.status.inactiveAccount': '無効なアカウント',
  'users.login.getInitialPassword':
    'GPUStack Server で次のコマンドを実行し、管理者の初期パスワードを取得してください。',
  'users.form.rpm': 'RPM',
  'users.form.tpm': 'TPM',
  'users.form.rateLimits.hint':
    '1分あたりのリクエスト数。ユーザーのすべてのAPIキーで共有される上限です。空欄の場合はデプロイのデフォルト値。',
  'users.form.rateLimits.tpmHint':
    '1分あたりのトークン数。ユーザーのすべてのAPIキーで共有される上限です。空欄の場合はデプロイのデフォルト値。',
  'users.form.weeklyTokens': '週間トークン予算',
  'users.form.monthlyTokens': '月間トークン予算',
  'users.form.tokenBudgets.none': '制限なし',
  'users.form.tokenBudgets.hint':
    'ユーザーのすべてのAPIキーとUIセッションに共通して適用されます。',
  'users.form.modelConcurrency': 'モデルごとの同時リクエスト数',
  'users.form.modelConcurrency.hint':
    'ユーザーが各モデルに対して同時に実行できるリクエストの上限。0 は無制限、1 はデプロイのデフォルト値です。記載のないモデルにはデフォルト値が適用されます。',
  'users.form.modelConcurrency.default': 'デフォルト: 1'
};
