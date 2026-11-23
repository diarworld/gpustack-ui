export default {
  'users.title': 'Пользователи',
  'users.button.create': 'Новый пользователь',
  'users.form.edit': 'Редактировать пользователя',
  'users.form.create': 'Новый пользователь',
  'users.table.username': 'Имя пользователя',
  'users.table.role': 'Роль',
  'users.table.status': 'Статус',
  'users.status.active': 'Активен',
  'users.status.inactive': 'Неактивен',
  'users.form.active': 'Активная учетная запись',
  'users.form.active.description':
    'Включить или отключить эту учетную запись пользователя',
  'users.form.fullname': 'Полное имя',
  'users.form.groups': 'Группы',
  'users.form.groups.hint':
    'Только локальные группы, созданные вручную. Состав групп, синхронизируемых из KeyCloak, меняется в KeyCloak.',
  'users.form.source': 'Источник',
  'users.form.source.local': 'Локальный',
  'users.form.source.tip.switchToLocal':
    'Переключение на «Локальный» требует ввода нового пароля. После этого пользователь будет входить через стандартную форму входа.',
  'users.form.source.tip.switchToExternal':
    'Переключение на внешний источник удаляет локальный пароль пользователя. После этого вход будет выполняться через настроенного провайдера идентификации.',
  'users.table.user': 'пользователи',
  'users.form.admin': 'Администратор',
  'users.form.user': 'Пользователь',
  'users.form.newpassword': 'Новый пароль',
  'users.form.currentpassword': 'Текущий пароль',
  'users.form.updatepassword': 'Изменить пароль',
  'users.form.rule.password':
    'Должен содержать заглавные и строчные буквы, цифры и спецсимволы (!@#$%^&*_+.), длина 6-64 символов, без пробелов.',
  'users.password.uppcase': 'Минимум одна заглавная буква',
  'users.password.lowercase': 'Минимум одна строчная буква',
  'users.password.number': 'Минимум одна цифра',
  'users.password.special': 'Минимум один спецсимвол',
  'users.password.length': 'Длина от 6 до 64 символов',
  'users.password.modify.title': 'Смена пароля',
  'users.password.modify.description':
    'В целях безопасности измените первоначальный пароль.',
  'users.password.modify.tips':
    'Регулярное обновление пароля помогает защитить вашу учётную запись.',
  'users.password.confirm': 'Подтвердите новый пароль',
  'users.password.confirm.empty': 'Подтвердите новый пароль',
  'users.password.confirm.error': 'Пароли не совпадают',
  'users.login.title': 'Вход в',
  'users.version.islatest': 'GPUStack {version} — последняя версия',
  'users.version.update': 'Доступно обновление GPUStack {version}',
  'users.settings.title': 'Настройки пользователя',
  'users.status.activate': 'Активировать аккаунт',
  'users.status.deactivate': 'Деактивировать аккаунт',
  'users.status.inactiveAccount': 'Неактивный аккаунт',
  'users.login.getInitialPassword':
    'Выполните следующую команду на вашем GPUStack Server, чтобы получить начальный пароль администратора.',
  'users.form.rpm': 'RPM',
  'users.form.tpm': 'TPM',
  'users.form.rateLimits.hint':
    'Запросов в минуту — общий лимит на все API-ключи пользователя. Пусто — дефолт деплоя.',
  'users.form.rateLimits.tpmHint':
    'Токенов в минуту — общий лимит на все API-ключи пользователя. Пусто — дефолт деплоя.',
  'users.form.weeklyTokens': 'Недельный бюджет токенов',
  'users.form.monthlyTokens': 'Месячный бюджет токенов',
  'users.form.tokenBudgets.none': 'Без лимита',
  'users.form.tokenBudgets.hint':
    'Общий для всех API-ключей пользователя и сессий в интерфейсе.',
  'users.form.modelConcurrency': 'Одновременные запросы на модель',
  'users.form.modelConcurrency.hint':
    'Максимум одновременных запросов пользователя к каждой модели. 0 — без лимита; пустое поле — дефолт деплоя. Модели, не указанные здесь, следуют дефолту.',
  'users.form.defaultPlaceholder': 'По умолчанию: {default}'
};
