export default {
  'usage.title': 'Usage',
  'usage.filter.user': 'Filter by user',
  'usage.filter.model': 'Filter by model',
  'usage.filter.apikey': 'Filter by API key',
  'usage.filter.metric': 'Metric',
  'usage.filter.groupBy': 'Group by',
  'usage.filter.group.user': 'User',
  'usage.filter.group.model': 'Model',
  'usage.filter.group.apikey': 'API Key',
  'usage.filter.inputTokens': 'Input Tokens',
  'usage.filter.outputTokens': 'Output Tokens',
  'usage.filter.totalTokens': 'Total Tokens',
  'usage.filter.apiRequests': 'API Requests',
  'usage.filter.modelsUsed': 'Models Used',
  'usage.table.user.modelsUsed': 'Models Used',
  'usage.table.user.apiKeysUsed': 'API Keys Used',
  'usage.table.lastActive': 'Last Active',
  'usage.filter.granularity': 'Granularity',
  'usage.filter.granularity.hour': 'Hour',
  'usage.filter.granularity.day': 'Day',
  'usage.filter.granularity.week': 'Week',
  'usage.filter.granularity.month': 'Month',
  'usage.tabs.summary': 'Summary',
  'usage.tabs.tokens': 'Tokens',
  'usage.tabs.limits': 'Limits',
  'usage.tabs.gpuInstances': 'GPU Instances',
  'usage.tabs.storage': 'Storage',
  'usage.tabs.resourceEvents': 'Events',
  'usage.tabs.models': 'Models',
  'usage.tabs.apikeys': 'API Keys',
  'usage.tabs.users': 'User',
  'usage.export.chart': 'Export Chart Data',
  'usage.export.table': 'Export Table Data',
  'usage.export.rows': 'About {total} rows will be exported.',
  'usage.export.rowsSlow':
    'About {total} rows will be exported. This may take a while — please keep this page open.',
  'usage.export.rowsExceeded':
    'About {total} rows, over the {limit}-row limit for a single export. Shorten the date range to {days} days or fewer, or add filters.',
  'usage.export.error.tooLarge':
    'This query returns about {total} rows, over the {limit}-row limit for a single export. Shorten the date range to {days} days or fewer, or add filters.',
  'usage.export.splitAsCsv':
    'The result is too large for one file, so it will be delivered as {parts} CSV files in a zip.',
  'usage.export.csvFallback':
    "The result exceeds Excel's {limit}-row limit per sheet, so it will be exported as CSV instead of xlsx.",
  'usage.export.error.splitTooManyParts':
    'Splitting would produce {total} files, over the {limit} limit. Narrow the date range or export fewer tables at once.',
  'usage.export.estimateFailed':
    'Could not size this export, so the preview has no columns to show. The download still works; the server enforces the limits either way.',
  'usage.export.error.failed': 'Export failed.',
  'usage.export.suggest.shortenRange': 'Shorten to {days} days',
  'usage.export.suggest.split': 'Export in {parts} CSV files',
  'usage.user.currentAccount': 'Current Account',
  'usage.table.cluster': 'Cluster',
  'usage.table.provider': 'Provider',
  'usage.table.deleted': 'Deleted',
  'usage.chart.cached': 'Cached',
  'usage.chart.uncached': 'Uncached',
  'usage.chart.inputTokensCached': 'Input Tokens (Cached/Uncached)',
  'usage.chart.moreGroups':
    '{count} more items ({value} tokens). Click the bar to view all.',
  'usage.chart.apiKeyDetails': 'API Key',
  'usage.chart.groupCount': 'Total: {count}',
  'usage.chart.searchModels': 'Search models',
  'usage.chart.searchUsers': 'Search users',
  'usage.chart.searchApiKeys': 'Search API keys',
  'usage.chart.modelName': 'Model name',
  'usage.chart.userName': 'User name',
  'usage.chart.apiKeyName': 'Key name',
  'usage.chart.pageOf': 'Page {page} of {total}',
  'usage.chart.previousPage': 'Previous page',
  'usage.chart.nextPage': 'Next page',
  'usage.table.inputTokensCached': 'Input Tokens Cached',

  // --- Resource usage: shared metrics & units ---
  'usage.metric.tokens': 'Tokens',
  'usage.metric.input': 'Input',
  'usage.metric.output': 'Output',
  'usage.metric.gpuHours': 'GPU Hours',
  'usage.metric.runningTime': 'Running Time',
  'usage.metric.usage': 'Usage',
  'usage.metric.gbDays': 'GB-Days',
  'usage.metric.gbHours': 'GB-Hours',
  'usage.metric.activeUsers': 'Active Users',
  'usage.metric.activeInstances': 'Active Instances',
  'usage.metric.activeStorage': 'Active Storage',
  'usage.metric.activeVolumes': 'Active Volumes',
  'usage.metric.storageTypes': 'Storage Types',
  'usage.metric.gpuHours.tip':
    'Instance running time weighted by GPU count: an instance with N GPUs running for H hours counts as N × H GPU-hours. Equal to Instance Hours when every instance uses a single GPU.',
  'usage.metric.runningTime.tip':
    'Wall-clock time the instance ran, regardless of how many units it held — one instance running for 2 hours is 2 h whether it holds 1 card or 8. Usage is this weighted by the unit count.',
  'usage.metric.usage.tip':
    'Running time weighted by how many billing units the instance held: GPU cards for an accelerated instance, base-flavor units for a CPU one. The cell shows the composition under the number, and one line per size for an instance that was resized during the period.',
  'usage.metric.gbDays.tip':
    'Storage capacity integrated over time, in GB × days: 10 GB kept for 5 days = 50 GB-days. (= GB-Hours ÷ 24)',
  'usage.metric.gbHours.tip':
    'Storage capacity integrated over time, in GB × hours: 10 GB kept for 5 hours = 50 GB-hours.',

  // --- Resource usage: common table / labels ---
  'usage.common.noData': 'No data',
  'usage.common.unknown': 'unknown',
  'usage.table.date': 'Date',
  'usage.table.name': 'Name',
  'usage.table.user': 'User',
  'usage.table.users': 'Users',
  'usage.table.type': 'Type',
  'usage.table.instance': 'Instance',
  'usage.table.resized': 'Resized',
  'usage.table.currentShape': 'Current',
  'usage.table.shapeAndMore': '{shape} and {count} more',
  'usage.table.instanceType': 'Instance Type',
  'usage.table.instanceTypes': 'Instance Types',
  'usage.table.instances': 'Instances',
  'usage.table.capacity': 'Capacity',
  'usage.export.tableNamed': 'Export Table Data — {name}',

  // --- Summary tab ---
  'usage.summary.compute': 'Compute',
  'usage.summary.tokensOverTime': 'Tokens over time',
  'usage.summary.usageOverTime': 'Usage over time',
  'usage.summary.gbDaysOverTime': 'GB-Days over time',

  // --- Summary tab: limit-rejection stats ---
  'usage.summary.limits.total': 'limit-trigger events',
  'usage.summary.limits.rps': 'RPS',
  'usage.summary.limits.tpm': 'TPM',
  'usage.summary.limits.concurrency': 'concurrency',
  'usage.summary.limits.weekly': 'weekly',
  'usage.summary.limits.monthly': 'monthly',
  'usage.summary.limits.overTime': 'Limit triggers over time',

  // --- Summary tab: rate limits ---
  'usage.rateLimits.title': 'Rate Limits',
  'usage.rateLimits.resetsIn': 'Resets in {time}',
  'usage.rateLimits.usageUnavailable':
    'Live usage is unavailable: rate limiting is running without a shared Redis.',
  'usage.rateLimits.usageError': 'Live usage is temporarily unavailable.',
  'usage.rateLimits.rpm': 'RPM',
  'usage.rateLimits.tpm': 'TPM',
  'usage.rateLimits.weekly': 'Week',
  'usage.rateLimits.monthly': 'Month',
  'usage.rateLimits.rpmHint': 'Requests per minute limit',
  'usage.rateLimits.tpmHint': 'Tokens per minute limit',
  'usage.rateLimits.weeklyHint': 'Weekly token limit',
  'usage.rateLimits.monthlyHint': 'Monthly token limit',
  'usage.rateLimits.concurrency.title': 'Concurrency by model',
  'usage.rateLimits.concurrency.hint':
    'How many of your requests may run against each model at the same time. The limit is your account\'s per-model override, or the deployment default; a running count at the limit is where "Too many concurrent requests" rejections come from. Administrators are exempt.',
  'usage.rateLimits.concurrency.model': 'Model',
  'usage.rateLimits.concurrency.running': 'Running',
  'usage.rateLimits.resetButton': 'Reset',
  'usage.rateLimits.resetConfirmTitle': 'Are you sure?',
  'usage.rateLimits.resetQuotaLeft':
    '{count, plural, one {# reset left} other {# resets left}} in this period.',
  'usage.rateLimits.resetReasonPlaceholder':
    'Describe the task you were working on',
  'usage.rateLimits.resetQuotaExhausted':
    'Reset quota exhausted for this period, resets {date}',
  'usage.rateLimits.resetSuccess': 'Limit reset',
  // The decision model's rejection causes, as the dialog phrases them for
  // the user. The generic wording covers a confident refusal that named no
  // cause.
  'usage.rateLimits.resetRejected.tooVague':
    'Request rejected: the description is too vague — name a concrete task and project',
  'usage.rateLimits.resetRejected.bypassAttempt':
    'Request rejected: this looks like an attempt to bypass the check — describe a real work task',
  'usage.rateLimits.resetRejected.nonIT':
    'Request rejected: the task is not an IT work task',
  'usage.rateLimits.resetRejected.gibberish':
    'Request rejected: the description could not be parsed — describe your work task',
  'usage.rateLimits.resetRejected.generic':
    'Request rejected — describe a concrete work task',
  // The admin's editor for the pinned user's limits, on the same card.
  'usage.rateLimits.editLimits': 'Edit limits',
  'usage.rateLimits.editLimitsSuccess': 'Limits updated',
  'usage.rateLimits.duration.days':
    '{count, plural, one {# day} other {# days}}',
  'usage.rateLimits.duration.hours':
    '{count, plural, one {# hour} other {# hours}}',
  'usage.rateLimits.duration.minutes':
    '{count, plural, one {# min} other {# mins}}',
  'usage.rateLimits.duration.seconds':
    '{count, plural, one {# sec} other {# secs}}',
  'usage.rateLimits.noLimits': 'No rate limits configured.',

  // --- Limits tab: free-window badge ---
  'usage.rateLimits.freeActive': 'Free hours',
  'usage.rateLimits.freeActiveHint':
    "The deployment's free-window schedule is active: every request is admitted and the limit counters are frozen (usage statistics keep being collected).",

  // --- Limits tab: deployment defaults (admin) ---
  'usage.deploymentDefaults.title': 'Deployment defaults',
  'usage.deploymentDefaults.hint':
    'Defaults applied to every user without their own setting. Changes land on the gateway at the next reconcile pass (up to a minute), no restart needed.',
  'usage.deploymentDefaults.rpm': 'Default RPM',
  'usage.deploymentDefaults.tpm': 'Default TPM',
  'usage.deploymentDefaults.monthly': 'Monthly token budget',
  'usage.deploymentDefaults.concurrency': 'Concurrency per model',
  'usage.deploymentDefaults.rpmHint':
    'Requests per minute allowed for users without their own setting. Empty = inherit the value from the server config file.',
  'usage.deploymentDefaults.tpmHint':
    'Tokens per minute for users without their own setting. Empty = inherit the value from the server config file.',
  'usage.deploymentDefaults.monthlyHint':
    'Monthly token budget for users without their own setting. Empty = no deployment default (a default budget silently capping every account is not implied).',
  'usage.deploymentDefaults.concurrencyHint':
    'In-flight requests per model for users without their own setting; 0 turns the cap off. Empty = inherit the value from the server config file.',
  'usage.deploymentDefaults.inheritPlaceholder': 'Inherited',
  'usage.deploymentDefaults.inheritHint':
    'Empty field = inherit the value from the server config file. Concurrency accepts 0 as "no cap".',
  'usage.deploymentDefaults.free': 'Free window',
  'usage.deploymentDefaults.freeStart': 'Start (your local time)',
  'usage.deploymentDefaults.freeEnd': 'End (your local time)',
  'usage.deploymentDefaults.freeDays': 'Whole free days',
  'usage.deploymentDefaults.freeDaysPlaceholder':
    'None — only the daily window applies',
  'usage.deploymentDefaults.browserZoneHint':
    "Times are shown and picked in your browser's timezone and stored in UTC. Days follow UTC; the window may span midnight. During the window every request is admitted and the limit counters freeze — usage statistics keep being collected.",
  'usage.deploymentDefaults.save': 'Save',
  'usage.deploymentDefaults.saved': 'Deployment defaults saved',

  // --- GPU Instances / Storage filters ---
  'usage.filter.instance': 'Filter by instance',
  'usage.filter.storage': 'Filter by storage',

  // --- Resource events ---
  'usage.events.resourceType': 'Resource type',
  'usage.events.eventType': 'Event type',
  'usage.events.resourceName': 'Filter by name',
  'usage.events.col.time': 'Time',
  'usage.events.col.resource': 'Resource',
  'usage.events.col.event': 'Event',
  'usage.events.col.message': 'Message',
  'usage.events.resource.gpuInstance': 'GPU Instance',
  'usage.events.resource.cpuInstance': 'CPU Instance',
  'usage.events.type.created': 'Created',
  'usage.events.type.deleted': 'Deleted',
  'usage.events.type.started': 'Started',
  'usage.events.type.stopped': 'Stopped',
  'usage.events.type.updated': 'Updated',
  'usage.events.type.attached': 'Attached',
  'usage.events.type.detached': 'Detached',
  // Rate-limit rejections (resource type "limit"): every row is the same
  // kind of event — a limit tripping — the axis that tripped is the label.
  // The concrete window (per minute vs per hour) rides in the message.
  'usage.events.resource.limit': 'Limit',
  'usage.events.type.limitRateRequests': 'Too many requests',
  'usage.events.type.limitRateTokens': 'Too many tokens',
  'usage.events.type.limitConcurrency': 'Too many concurrent requests',
  'usage.events.type.limitQuotaWeekly': 'Weekly token quota exceeded',
  'usage.events.type.limitQuotaMonthly': 'Monthly token quota exceeded',
  // Backend fallback for a limit axis this build does not enumerate yet.
  'usage.events.type.limitGeneric': 'Rate limit tripped',
  // Hover tooltip on the name column: the creator's attribute-derived labels.
  'usage.events.tooltip.businessUnit': 'Business Unit',
  'usage.events.tooltip.department': 'Department',
  'usage.events.tooltip.profession': 'Profession'
};
