export default {
  'usage.title': '使用量',
  'usage.filter.user': 'ユーザーで絞り込み',
  'usage.filter.model': 'モデルで絞り込み',
  'usage.filter.apikey': 'API キーで絞り込み',
  'usage.filter.metric': '指標',
  'usage.filter.groupBy': 'グループ化',
  'usage.filter.group.user': 'ユーザー',
  'usage.filter.group.model': 'モデル',
  'usage.filter.group.apikey': 'API キー',
  'usage.filter.inputTokens': '入力 Token',
  'usage.filter.outputTokens': '出力 Token',
  'usage.filter.totalTokens': '合計 Token',
  'usage.filter.apiRequests': 'API リクエスト',
  'usage.filter.modelsUsed': '使用モデル数',
  'usage.table.user.modelsUsed': '使用モデル数',
  'usage.table.user.apiKeysUsed': '使用 API キー数',
  'usage.table.lastActive': '最終利用日時',
  'usage.filter.granularity': '集計単位',
  'usage.filter.granularity.hour': '時間',
  'usage.filter.granularity.day': '日',
  'usage.filter.granularity.week': '週',
  'usage.filter.granularity.month': '月',
  'usage.tabs.summary': '概要',
  'usage.tabs.tokens': 'Token',
  'usage.tabs.limits': '制限',
  'usage.tabs.gpuInstances': 'GPU インスタンス',
  'usage.tabs.storage': 'ストレージ',
  'usage.tabs.resourceEvents': 'イベント',
  'usage.tabs.models': 'モデル',
  'usage.tabs.apikeys': 'API キー',
  'usage.tabs.users': 'ユーザー',
  'usage.export.chart': 'グラフデータをエクスポート',
  'usage.export.table': 'テーブルデータをエクスポート',
  'usage.export.rows': '約 {total} 行をエクスポートします。',
  'usage.export.rowsSlow':
    '約 {total} 行をエクスポートします。時間がかかる場合があります。このページを開いたままにしてください。',
  'usage.export.rowsExceeded':
    '約 {total} 行あり、1 回のエクスポート上限 {limit} 行を超えています。期間を {days} 日以内に短縮するか、フィルターを追加してください。',
  'usage.export.error.tooLarge':
    'このクエリは約 {total} 行を返し、1 回のエクスポート上限 {limit} 行を超えています。期間を {days} 日以内に短縮するか、フィルターを追加してください。',
  'usage.export.splitAsCsv':
    '結果が 1 つのファイルに収まらないため、{parts} 個の CSV ファイルを ZIP にまとめて出力します。',
  'usage.export.csvFallback':
    '結果が Excel のシートあたりの上限 {limit} 行を超えているため、xlsx の代わりに CSV でエクスポートします。',
  'usage.export.error.splitTooManyParts':
    '分割すると {total} 個のファイルになり、上限 {limit} 個を超えます。期間を短縮するか、一度にエクスポートするテーブルを減らしてください。',
  'usage.export.estimateFailed':
    'エクスポートのサイズを見積もれないため、プレビューに列を表示できません。ダウンロードは引き続き可能です。いずれの場合も、サーバー側で上限が適用されます。',
  'usage.export.error.failed': 'エクスポートに失敗しました。',
  'usage.export.suggest.shortenRange': '{days} 日に短縮',
  'usage.export.suggest.split': '{parts} 個の CSV ファイルでエクスポート',
  'usage.user.currentAccount': '現在のアカウント',
  'usage.table.cluster': 'クラスター',
  'usage.table.provider': 'プロバイダー',
  'usage.table.deleted': '削除済み',
  'usage.chart.cached': 'キャッシュ済み',
  'usage.chart.uncached': '未キャッシュ',
  'usage.chart.inputTokensCached': '入力 Token（キャッシュ済み/未キャッシュ）',
  'usage.chart.moreGroups':
    '他 {count} 件（合計 {value} Token）。棒をクリックしてすべて表示。',
  'usage.chart.apiKeyDetails': 'API キー',
  'usage.chart.groupCount': '合計 {count} 件',
  'usage.chart.searchModels': 'モデルを検索',
  'usage.chart.searchUsers': 'ユーザーを検索',
  'usage.chart.searchApiKeys': 'API キーを検索',
  'usage.chart.modelName': 'モデル名',
  'usage.chart.userName': 'ユーザー名',
  'usage.chart.apiKeyName': 'キー名',
  'usage.chart.pageOf': '{page} / {total} ページ',
  'usage.chart.previousPage': '前のページ',
  'usage.chart.nextPage': '次のページ',
  'usage.table.inputTokensCached': 'キャッシュ済み入力 Token',

  // --- Resource usage: shared metrics & units ---
  'usage.metric.tokens': 'Token数',
  'usage.metric.input': '入力',
  'usage.metric.output': '出力',
  'usage.metric.gpuHours': 'GPU 時間',
  'usage.metric.runningTime': '稼働時間',
  'usage.metric.usage': '使用量',
  'usage.metric.gbDays': 'GB·日',
  'usage.metric.gbHours': 'GB·時間',
  'usage.metric.activeUsers': 'アクティブユーザー',
  'usage.metric.activeInstances': 'アクティブインスタンス',
  'usage.metric.activeStorage': 'アクティブストレージ',
  'usage.metric.activeVolumes': 'アクティブボリューム',
  'usage.metric.storageTypes': 'ストレージタイプ',
  'usage.metric.gpuHours.tip':
    'インスタンスの稼働時間を GPU 数で重み付けした値：N 個の GPU を使用するインスタンスが H 時間稼働すると N × H GPU 時間としてカウントされます。すべてのインスタンスが単一の GPU を使用する場合はインスタンス時間と等しくなります。',
  'usage.metric.runningTime.tip':
    'インスタンスが実際に稼働した時間。保持していたユニット数とは無関係で、2 時間稼働すれば 1 枚でも 8 枚でも 2 h です。使用量はこれをユニット数で重み付けした値です。',
  'usage.metric.usage.tip':
    'インスタンスが保持していた課金ユニット数で稼働時間を重み付けした値：アクセラレーテッドインスタンスは GPU 枚数、CPU インスタンスは基本フレーバー単位数。セルには数値の下に内訳を表示し、期間中に構成変更されたインスタンスは規格ごとに行を分けます。',
  'usage.metric.gbDays.tip':
    'ストレージ容量を時間で積分した値（GB × 日）：10 GB を 5 日間保持 = 50 GB·日。（= GB·時間 ÷ 24）',
  'usage.metric.gbHours.tip':
    'ストレージ容量を時間で積分した値（GB × 時間）：10 GB を 5 時間保持 = 50 GB·時間。',

  // --- Resource usage: common table / labels ---
  'usage.common.noData': 'データがありません',
  'usage.common.unknown': '不明',
  'usage.table.date': '日付',
  'usage.table.name': '名前',
  'usage.table.user': 'ユーザー',
  'usage.table.users': 'ユーザー',
  'usage.table.type': 'タイプ',
  'usage.table.instance': 'インスタンス',
  'usage.table.resized': '構成変更あり',
  'usage.table.currentShape': '現在',
  'usage.table.shapeAndMore': '{shape} ほか {count} 件',
  'usage.table.instanceType': 'インスタンスタイプ',
  'usage.table.instanceTypes': 'インスタンスタイプ',
  'usage.table.instances': 'インスタンス',
  'usage.table.capacity': '容量',
  'usage.export.tableNamed': 'テーブルデータをエクスポート — {name}',

  // --- Summary tab ---
  'usage.summary.compute': 'コンピュート',
  'usage.summary.tokensOverTime': 'Token数の推移',
  'usage.summary.usageOverTime': '使用量の推移',
  'usage.summary.gbDaysOverTime': 'GB·日の推移',

  // --- Summary tab: limit-rejection stats ---
  'usage.summary.limits.total': 'レート制限イベント',
  'usage.summary.limits.rps': 'RPS',
  'usage.summary.limits.tpm': 'TPM',
  'usage.summary.limits.concurrency': '同時実行',
  'usage.summary.limits.weekly': '週次',
  'usage.summary.limits.monthly': '月次',
  'usage.summary.limits.overTime': 'レート制限の発生推移',

  // --- Summary tab: rate limits ---
  'usage.rateLimits.title': 'レート制限',
  'usage.rateLimits.resetsIn': '{time}後にリセット',
  'usage.rateLimits.usageUnavailable':
    'リアルタイムの使用量は表示できません: レート制限が共有 Redis なしで動作しています。',
  'usage.rateLimits.usageError': 'リアルタイムの使用量は現在利用できません。',
  'usage.rateLimits.rpm': 'RPM',
  'usage.rateLimits.tpm': 'TPM',
  'usage.rateLimits.weekly': '週',
  'usage.rateLimits.monthly': '月',
  'usage.rateLimits.rpmHint': '1分あたりのリクエスト数上限',
  'usage.rateLimits.tpmHint': '1分あたりのトークン数上限',
  'usage.rateLimits.weeklyHint': '週間トークン上限',
  'usage.rateLimits.monthlyHint': '月間トークン上限',
  'usage.rateLimits.concurrency.title': 'モデル別の同時実行',
  'usage.rateLimits.concurrency.hint':
    '各モデルに対して同時に実行できるリクエスト数。上限はアカウントのモデル別上書き値、またはデプロイのデフォルトです。実行数が上限に達した行は「Too many concurrent requests」拒否の発生源です。管理者にはこの制限は適用されません。',
  'usage.rateLimits.concurrency.model': 'モデル',
  'usage.rateLimits.concurrency.running': '実行中',
  'usage.rateLimits.resetButton': 'リセット',
  'usage.rateLimits.resetConfirmTitle': 'よろしいですか？',
  'usage.rateLimits.resetQuotaLeft':
    'この期間の残りリセット回数: {count, plural, other {# 回}}。',
  'usage.rateLimits.resetReasonPlaceholder': '実行中のタスクを記入してください',
  'usage.rateLimits.resetQuotaExhausted':
    'この期間のリセット回数を使い切りました。{date} に更新されます',
  'usage.rateLimits.resetSuccess': '上限をリセットしました',
  'usage.rateLimits.duration.days': '{count, plural, other {#日}}',
  'usage.rateLimits.duration.hours': '{count, plural, other {#時間}}',
  'usage.rateLimits.duration.minutes': '{count, plural, other {#分}}',
  'usage.rateLimits.duration.seconds': '{count, plural, other {#秒}}',
  'usage.rateLimits.noLimits': 'レート制限は設定されていません。',

  // --- Limits tab: free-window badge ---
  'usage.rateLimits.freeActive': 'フリータイム',
  'usage.rateLimits.freeActiveHint':
    'デプロイのフリーウィンドウが有効です：すべてのリクエストが許可され、リミットカウンターは凍結されます（使用統計は記録され続けます）。',

  // --- Limits tab: deployment defaults (admin) ---
  'usage.deploymentDefaults.title': 'デプロイのデフォルト',
  'usage.deploymentDefaults.hint':
    '個別設定のない全ユーザーに適用されるデフォルトです。変更は次のリコンサイル処理（最大1分）でゲートウェイに反映され、再起動は不要です。',
  'usage.deploymentDefaults.rpm': 'デフォルトRPM',
  'usage.deploymentDefaults.tpm': 'デフォルトTPM',
  'usage.deploymentDefaults.monthly': '月間トークン予算',
  'usage.deploymentDefaults.concurrency': 'モデルごとの同時実行',
  'usage.deploymentDefaults.rpmHint':
    '個別設定のないユーザーに許可される1分あたりのリクエスト数。空欄＝サーバー設定ファイルの値を継承。',
  'usage.deploymentDefaults.tpmHint':
    '個別設定のないユーザーの1分あたりトークン数。空欄＝サーバー設定ファイルの値を継承。',
  'usage.deploymentDefaults.monthlyHint':
    '個別設定のないユーザーの月間トークン予算。空欄＝デプロイ既定なし（全アカウントを黙って制限することはない）。',
  'usage.deploymentDefaults.concurrencyHint':
    '個別設定のないユーザーのモデルごとの同時実行数。0で上限なし。空欄＝サーバー設定ファイルの値を継承。',
  'usage.deploymentDefaults.inheritPlaceholder': '継承',
  'usage.deploymentDefaults.inheritHint':
    '空欄＝サーバー設定ファイルの値を継承。同時実行は0で「上限なし」。',
  'usage.deploymentDefaults.free': 'フリーウィンドウ',
  'usage.deploymentDefaults.freeStart': '開始（ローカル時刻）',
  'usage.deploymentDefaults.freeEnd': '終了（ローカル時刻）',
  'usage.deploymentDefaults.freeDays': '終日フリーの曜日',
  'usage.deploymentDefaults.freeDaysPlaceholder':
    'なし — 毎日のウィンドウのみ適用',
  'usage.deploymentDefaults.browserZoneHint':
    '時刻はブラウザのタイムゾーンで表示・入力され、UTCで保存されます。曜日はUTC基準。ウィンドウは深夜0時をまたげます。ウィンドウ中はすべてのリクエストが許可され、リミットカウンターは凍結されます（使用統計は記録され続けます）。',
  'usage.deploymentDefaults.save': '保存',
  'usage.deploymentDefaults.saved': 'デプロイのデフォルトを保存しました',

  // --- GPU Instances / Storage filters ---
  'usage.filter.instance': 'インスタンスで絞り込み',
  'usage.filter.storage': 'ストレージで絞り込み',

  // --- Resource events ---
  'usage.events.resourceType': 'リソースタイプ',
  'usage.events.eventType': 'イベントタイプ',
  'usage.events.resourceName': '名前で絞り込み',
  'usage.events.col.time': '時刻',
  'usage.events.col.resource': 'リソース',
  'usage.events.col.event': 'イベント',
  'usage.events.col.message': 'メッセージ',
  'usage.events.resource.gpuInstance': 'GPU インスタンス',
  'usage.events.resource.cpuInstance': 'CPU インスタンス',
  'usage.events.type.created': '作成済み',
  'usage.events.type.deleted': '削除済み',
  'usage.events.type.started': '開始',
  'usage.events.type.stopped': '停止',
  'usage.events.type.updated': '更新済み',
  'usage.events.type.attached': 'アタッチ済み',
  'usage.events.type.detached': 'デタッチ済み',
  'usage.events.resource.limit': 'リミット',
  'usage.events.type.limitRateRequests': 'リクエストが多すぎます',
  'usage.events.type.limitRateTokens': 'トークンが多すぎます',
  'usage.events.type.limitConcurrency': '同時実行リクエストが多すぎます',
  'usage.events.type.limitQuotaWeekly': '週次トークンクォータを使い切りました',
  'usage.events.type.limitQuotaMonthly': '月次トークンクォータを使い切りました',
  'usage.events.type.limitGeneric': 'レートリミットが発動しました',
  'usage.events.tooltip.businessUnit': 'ビジネスユニット',
  'usage.events.tooltip.department': '部門',
  'usage.events.tooltip.profession': '職種'
};
