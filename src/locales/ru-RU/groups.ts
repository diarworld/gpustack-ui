export default {
  'groups.title': 'Группы',
  'groups.button.create': 'Добавить группу',
  'groups.form.create': 'Добавить группу',
  'groups.form.edit': 'Изменить группу',
  'groups.form.name.placeholder':
    'например, SDLC users. Префиксы title/, dept/ и store/ закреплены за группами из IdP.',
  'groups.form.description': 'Описание',
  'groups.table.members': 'Участники',
  'groups.table.group': 'групп',
  'groups.table.type': 'Тип группы',
  'groups.filter.type': 'Фильтр по типу группы',
  'groups.syncedFromIdpHint':
    'Состав этой группы синхронизируется из KeyCloak и меняется только там',
  'groups.type.profession': 'Профессия',
  'groups.type.department': 'Отдел',
  'groups.type.business-unit': 'Бизнес Юнит',
  'groups.type.unknown': 'Неизвестные',
  'groups.type.local': 'Локальная',
  'groups.type.idp': 'IdP',
  'groups.action.members': 'Управлять участниками',
  'groups.members.usersTab': 'Пользователи',
  'groups.members.subgroupsTab': 'Подгруппы',
  'groups.members.add': 'Добавить',
  'groups.members.addUsersPlaceholder': 'Выберите пользователей',
  'groups.members.addSubgroupsPlaceholder': 'Выберите подгруппы',
  'groups.members.removeConfirm':
    'Удалить участника из группы? Вложенные группы потеряют доступ, выданный через неё.',
  'groups.action.limits': 'Управлять лимитами',
  'groups.table.rpm': 'RPM',
  'groups.table.tpm': 'TPM',
  'groups.table.week': 'Неделя',
  'groups.table.month': 'Месяц',
  'groups.table.rpmHint':
    'Запросов в минуту для участников группы: применяется наименьший лимит среди их групп, если в учётной записи не задан свой.',
  'groups.table.tpmHint':
    'Токенов в минуту для участников группы; применяется наименьшее значение среди их групп.',
  'groups.table.weekHint':
    'Скользящий 7-дневный бюджет токенов для участников группы; дефолта деплоя у него нет.',
  'groups.table.monthHint':
    'Календарный месячный бюджет токенов для участников группы.',
  'groups.limits.rpmHint':
    'Запросов в минуту. Действует для участников без явного лимита в учётной записи; если лимит задан в нескольких группах — берётся наименьший.',
  'groups.limits.tpmHint':
    'Токенов в минуту. Действует для участников без явного лимита; берётся наименьшее значение среди их групп.',
  'groups.limits.weeklyHint':
    'Скользящий 7-дневный бюджет токенов для участников без своего бюджета; берётся наименьшее значение среди их групп.',
  'groups.limits.monthlyHint':
    'Календарный месячный бюджет токенов для участников без своего бюджета; берётся наименьшее значение среди их групп.',
  'groups.limits.concurrencyHint':
    'Лимиты одновременных запросов на модель для участников группы. Собственные переопределения пользователя выигрывают; иначе берётся наименьший ненулевой лимит среди групп; 0 у группы означает, что она не ограничивает модель.',
  'groups.limits.success': 'Лимиты группы обновлены'
};
