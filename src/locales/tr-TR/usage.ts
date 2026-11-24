export default {
  'usage.title': 'Kullanım',
  'usage.filter.user': 'Kullanıcıya göre filtrele',
  'usage.filter.model': 'Modele göre filtrele',
  'usage.filter.apikey': 'API anahtarına göre filtrele',
  'usage.filter.metric': 'Metrik',
  'usage.filter.groupBy': 'Şuna göre grupla',
  'usage.filter.group.user': 'Kullanıcı',
  'usage.filter.group.model': 'Model',
  'usage.filter.group.apikey': 'API Anahtarı',
  'usage.filter.inputTokens': 'Giriş Tokenları',
  'usage.filter.outputTokens': 'Çıkış Tokenları',
  'usage.filter.totalTokens': 'Toplam Tokenlar',
  'usage.filter.apiRequests': 'API İstekleri',
  'usage.filter.modelsUsed': 'Kullanılan Modeller',
  'usage.table.user.modelsUsed': 'Kullanılan Modeller',
  'usage.table.user.apiKeysUsed': 'Kullanılan API Anahtarları',
  'usage.table.lastActive': 'Son Etkinlik',
  'usage.filter.granularity': 'Ayrıntı Düzeyi',
  'usage.filter.granularity.hour': 'Saat',
  'usage.filter.granularity.day': 'Gün',
  'usage.filter.granularity.week': 'Hafta',
  'usage.filter.granularity.month': 'Ay',
  'usage.tabs.summary': 'Özet',
  'usage.tabs.tokens': 'Token',
  'usage.tabs.limits': 'Limitler',
  'usage.tabs.gpuInstances': 'GPU Örnekleri',
  'usage.tabs.storage': 'Depolama',
  'usage.tabs.resourceEvents': 'Olaylar',
  'usage.tabs.models': 'Modeller',
  'usage.tabs.apikeys': 'API Anahtarları',
  'usage.tabs.users': 'Kullanıcı',
  'usage.export.chart': 'Grafik Verisini Dışa Aktar',
  'usage.export.table': 'Tablo Verisini Dışa Aktar',
  'usage.export.rows': 'Yaklaşık {total} satır dışa aktarılacak.',
  'usage.export.rowsSlow':
    'Yaklaşık {total} satır dışa aktarılacak. Bu biraz zaman alabilir — lütfen bu sayfayı açık tutun.',
  'usage.export.rowsExceeded':
    'Yaklaşık {total} satır; tek bir dışa aktarım için geçerli olan {limit} satır sınırının üzerinde. Tarih aralığını {days} güne veya altına indirin ya da filtre ekleyin.',
  'usage.export.error.tooLarge':
    'Bu sorgu yaklaşık {total} satır döndürüyor; tek bir dışa aktarım için geçerli olan {limit} satır sınırının üzerinde. Tarih aralığını {days} güne veya altına indirin ya da filtre ekleyin.',
  'usage.export.splitAsCsv':
    'Sonuç tek bir dosya için fazla büyük, bu nedenle bir zip içinde {parts} CSV dosyası olarak sunulacak.',
  'usage.export.csvFallback':
    "Sonuç, Excel'in sayfa başına {limit} satır sınırını aşıyor; bu nedenle xlsx yerine CSV olarak dışa aktarılacak.",
  'usage.export.error.splitTooManyParts':
    'Bölme işlemi {total} dosya üretir; bu da {limit} sınırının üzerinde. Tarih aralığını daraltın veya aynı anda daha az tablo dışa aktarın.',
  'usage.export.estimateFailed':
    'Bu dışa aktarımın boyutu hesaplanamadı, bu nedenle önizlemede gösterilecek sütun yok. İndirme yine de çalışır; sınırları her durumda sunucu uygular.',
  'usage.export.error.failed': 'Dışa aktarma başarısız oldu.',
  'usage.export.suggest.shortenRange': '{days} güne indir',
  'usage.export.suggest.split': '{parts} CSV dosyası olarak dışa aktar',
  'usage.user.currentAccount': 'Geçerli Hesap',
  'usage.table.cluster': 'Küme',
  'usage.table.provider': 'Sağlayıcı',
  'usage.table.deleted': 'Silindi',
  'usage.chart.cached': 'Önbellekli',
  'usage.chart.uncached': 'Önbelleksiz',
  'usage.chart.inputTokensCached': 'Giriş Tokenları (Önbellekli/Önbelleksiz)',
  'usage.chart.moreGroups':
    '{count} öğe daha (toplam {value} token). Tümünü görmek için çubuğa tıklayın.',
  'usage.chart.apiKeyDetails': 'API Anahtarları',
  'usage.chart.groupCount': 'Toplam: {count}',
  'usage.chart.searchModels': 'Modelleri ara',
  'usage.chart.searchUsers': 'Kullanıcıları ara',
  'usage.chart.searchApiKeys': 'API anahtarlarını ara',
  'usage.chart.modelName': 'Model adı',
  'usage.chart.userName': 'Kullanıcı adı',
  'usage.chart.apiKeyName': 'Anahtar adı',
  'usage.chart.pageOf': 'Sayfa {page} / {total}',
  'usage.chart.previousPage': 'Önceki sayfa',
  'usage.chart.nextPage': 'Sonraki sayfa',
  'usage.table.inputTokensCached': 'Önbelleğe Alınan Giriş Tokenları',

  // --- Resource usage: shared metrics & units ---
  'usage.metric.tokens': 'Token',
  'usage.metric.input': 'Girdi',
  'usage.metric.output': 'Çıktı',
  'usage.metric.gpuHours': 'GPU Saati',
  'usage.metric.runningTime': 'Çalışma Süresi',
  'usage.metric.usage': 'Kullanım',
  'usage.metric.gbDays': 'GB-Gün',
  'usage.metric.gbHours': 'GB-Saat',
  'usage.metric.activeUsers': 'Aktif Kullanıcılar',
  'usage.metric.activeInstances': 'Aktif Örnekler',
  'usage.metric.activeStorage': 'Aktif Depolama',
  'usage.metric.activeVolumes': 'Aktif Birimler',
  'usage.metric.storageTypes': 'Depolama Türleri',
  'usage.metric.gpuHours.tip':
    'Örnek çalışma süresinin GPU sayısına göre ağırlıklandırılmış hali: N GPU kullanan bir örnek H saat çalıştığında N × H GPU-saat olarak sayılır. Her örnek tek bir GPU kullandığında Örnek Saati ile eşittir.',
  'usage.metric.runningTime.tip':
    'Örneğin gerçekte çalıştığı süre; tuttuğu birim sayısından bağımsızdır — iki saat çalışan bir örnek, 1 kart da tutsa 8 kart da tutsa 2 saattir. Kullanım ise bunun birim sayısıyla ağırlıklandırılmış hâlidir.',
  'usage.metric.usage.tip':
    'Çalışma süresinin, örneğin tuttuğu faturalama birimi sayısıyla ağırlıklandırılmış hâli: hızlandırılmış örneklerde GPU kartı sayısı, CPU örneklerinde temel flavor birimi sayısı. Hücrede sayının altında bileşimi gösterilir; dönem içinde yeniden boyutlandırılan bir örnek için her boyut ayrı satırda yer alır.',
  'usage.metric.gbDays.tip':
    'Depolama kapasitesinin zamana göre integrali, GB × gün cinsinden: 5 gün boyunca tutulan 10 GB = 50 GB-gün. (= GB-Saat ÷ 24)',
  'usage.metric.gbHours.tip':
    'Depolama kapasitesinin zamana göre integrali, GB × saat cinsinden: 5 saat boyunca tutulan 10 GB = 50 GB-saat.',

  // --- Resource usage: common table / labels ---
  'usage.common.noData': 'Veri yok',
  'usage.common.unknown': 'bilinmiyor',
  'usage.table.date': 'Tarih',
  'usage.table.name': 'Ad',
  'usage.table.user': 'Kullanıcı',
  'usage.table.users': 'Kullanıcılar',
  'usage.table.type': 'Tür',
  'usage.table.instance': 'Örnek',
  'usage.table.resized': 'Yeniden boyutlandırıldı',
  'usage.table.currentShape': 'Geçerli',
  'usage.table.shapeAndMore': '{shape} ve {count} diğer',
  'usage.table.instanceType': 'Örnek Türü',
  'usage.table.instanceTypes': 'Örnek Türleri',
  'usage.table.instances': 'Örnekler',
  'usage.table.capacity': 'Kapasite',
  'usage.export.tableNamed': 'Tablo Verilerini Dışa Aktar — {name}',

  // --- Summary tab ---
  'usage.summary.compute': 'Hesaplama',
  'usage.summary.tokensOverTime': 'Zaman içinde Token',
  'usage.summary.usageOverTime': 'Zaman içinde kullanım',
  'usage.summary.gbDaysOverTime': 'Zaman içinde GB-Gün',

  // --- Summary tab: limit-rejection stats ---
  'usage.summary.limits.total': 'limit aşımı olayı',
  'usage.summary.limits.rps': 'RPS',
  'usage.summary.limits.tpm': 'TPM',
  'usage.summary.limits.concurrency': 'eşzamanlı',
  'usage.summary.limits.weekly': 'haftalık',
  'usage.summary.limits.monthly': 'aylık',
  'usage.summary.limits.overTime': 'Zaman içinde limit aşımı',

  // --- Summary tab: rate limits ---
  'usage.rateLimits.title': 'Hız Sınırları',
  'usage.rateLimits.resetsIn': '{time} içinde sıfırlanır',
  'usage.rateLimits.usageUnavailable':
    'Anlık kullanım kullanılamıyor: hız sınırlama paylaşımlı bir Redis olmadan çalışıyor.',
  'usage.rateLimits.usageError': 'Anlık kullanım geçici olarak kullanılamıyor.',
  'usage.rateLimits.rpm': 'RPM',
  'usage.rateLimits.tpm': 'TPM',
  'usage.rateLimits.weekly': 'Hafta',
  'usage.rateLimits.monthly': 'Ay',
  'usage.rateLimits.rpmHint': 'Dakika başına istek sınırı',
  'usage.rateLimits.tpmHint': 'Dakika başına token sınırı',
  'usage.rateLimits.weeklyHint': 'Haftalık token sınırı',
  'usage.rateLimits.monthlyHint': 'Aylık token sınırı',
  'usage.rateLimits.concurrency.title': 'Modellere göre eşzamanlılık',
  'usage.rateLimits.concurrency.hint':
    'İsteklerinizin her modelde aynı anda çalışabileceği sayı. Sınır, hesabınızın model bazlı geçersiz kırması veya dağıtım varsayılanıdır; limite dayanan çalışma sayısı, "Too many concurrent requests" reddedilmelerinin kaynağıdır. Yöneticiler bu sınıra tabi değildir.',
  'usage.rateLimits.concurrency.model': 'Model',
  'usage.rateLimits.concurrency.running': 'Çalışıyor',
  'usage.rateLimits.resetButton': 'Sıfırla',
  'usage.rateLimits.resetConfirmTitle': 'Emin misiniz?',
  'usage.rateLimits.resetQuotaLeft':
    'Bu dönemde kalan sıfırlama: {count, plural, other {#}}.',
  'usage.rateLimits.resetReasonPlaceholder':
    'Üzerinde çalıştığınız görevi yazın',
  'usage.rateLimits.resetQuotaExhausted':
    'Bu dönem için sıfırlama limiti tükendi, {date} tarihinde yenilenir',
  'usage.rateLimits.resetSuccess': 'Limit sıfırlandı',
  'usage.rateLimits.duration.days': '{count, plural, other {# gün}}',
  'usage.rateLimits.duration.hours': '{count, plural, other {# saat}}',
  'usage.rateLimits.duration.minutes': '{count, plural, other {# dakika}}',
  'usage.rateLimits.duration.seconds': '{count, plural, other {# saniye}}',
  'usage.rateLimits.noLimits': 'Hız sınırı yapılandırılmamış.',

  // --- Limits tab: free-window badge ---
  'usage.rateLimits.freeActive': 'Serbest saatler',
  'usage.rateLimits.freeActiveHint':
    'Dağıtımın serbest penceresi etkin: tüm istekler kabul edilir ve limit sayaçları donar (kullanım istatistikleri toplanmaya devam eder).',

  // --- Limits tab: deployment defaults (admin) ---
  'usage.deploymentDefaults.title': 'Dağıtım varsayılanları',
  'usage.deploymentDefaults.hint':
    'Kendi ayarı olmayan tüm kullanıcılara uygulanan varsayılanlar. Değişiklikler bir sonraki uzlaştırma turunda (en fazla bir dakika) ağ geçidine ulaşır, yeniden başlatma gerekmez.',
  'usage.deploymentDefaults.rpm': 'Varsayılan RPM',
  'usage.deploymentDefaults.tpm': 'Varsayılan TPM',
  'usage.deploymentDefaults.monthly': 'Aylık token bütçesi',
  'usage.deploymentDefaults.concurrency': 'Model başına eşzamanlılık',
  'usage.deploymentDefaults.rpmHint':
    'Kendi ayarı olmayan kullanıcılar için dakikada izin verilen istek sayısı. Boş = sunucu yapılandırma dosyasındaki değer devralınır.',
  'usage.deploymentDefaults.tpmHint':
    'Kendi ayarı olmayan kullanıcılar için dakikada token sayısı. Boş = sunucu yapılandırma dosyasındaki değer devralınır.',
  'usage.deploymentDefaults.monthlyHint':
    'Kendi ayarı olmayan kullanıcılar için aylık token bütçesi. Boş = dağıtım varsayılanı yok (her hesap sessizce sınırlandırılmaz).',
  'usage.deploymentDefaults.concurrencyHint':
    'Kendi ayarı olmayan kullanıcılar için model başına aynı anda yürüyen istek sayısı; 0 sınırı kapatır. Boş = sunucu yapılandırma dosyasındaki değer devralınır.',
  'usage.deploymentDefaults.inheritPlaceholder': 'Devralınır',
  'usage.deploymentDefaults.inheritHint':
    'Boş alan = sunucu yapılandırma dosyasındaki değer devralınır. Eşzamanlılık için 0 = "sınır yok".',
  'usage.deploymentDefaults.free': 'Serbest pencere',
  'usage.deploymentDefaults.freeStart': 'Başlangıç (yerel saat)',
  'usage.deploymentDefaults.freeEnd': 'Bitiş (yerel saat)',
  'usage.deploymentDefaults.freeDays': 'Tamamen serbest günler',
  'usage.deploymentDefaults.freeDaysPlaceholder':
    'Yok — yalnızca günlük pencere uygulanır',
  'usage.deploymentDefaults.browserZoneHint':
    "Saatler tarayıcınızın saat diliminde gösterilir ve girilir, UTC olarak saklanır. Günler UTC'ye göredir; pencere gece yarısını aşabilir. Pencere sırasında tüm istekler kabul edilir ve limit sayaçları donar — kullanım istatistikleri toplanmaya devam eder.",
  'usage.deploymentDefaults.save': 'Kaydet',
  'usage.deploymentDefaults.saved': 'Dağıtım varsayılanları kaydedildi',

  // --- GPU Instances / Storage filters ---
  'usage.filter.instance': 'Örneğe göre filtrele',
  'usage.filter.storage': 'Depolamaya göre filtrele',

  // --- Resource events ---
  'usage.events.resourceType': 'Kaynak türü',
  'usage.events.eventType': 'Olay türü',
  'usage.events.resourceName': 'Ada göre filtrele',
  'usage.events.col.time': 'Zaman',
  'usage.events.col.resource': 'Kaynak',
  'usage.events.col.event': 'Olay',
  'usage.events.col.message': 'Mesaj',
  'usage.events.resource.gpuInstance': 'GPU Örneği',
  'usage.events.resource.cpuInstance': 'CPU Örneği',
  'usage.events.type.created': 'Oluşturuldu',
  'usage.events.type.deleted': 'Silindi',
  'usage.events.type.started': 'Başlatıldı',
  'usage.events.type.stopped': 'Durduruldu',
  'usage.events.type.updated': 'Güncellendi',
  'usage.events.type.attached': 'Eklendi',
  'usage.events.type.detached': 'Ayrıldı',
  'usage.events.resource.limit': 'Limit',
  'usage.events.type.limitRateRequests': 'Çok fazla istek',
  'usage.events.type.limitRateTokens': 'Çok fazla token',
  'usage.events.type.limitConcurrency': 'Çok fazla eşzamanlı istek',
  'usage.events.type.limitQuotaWeekly': 'Haftalık token kotası aşıldı',
  'usage.events.type.limitQuotaMonthly': 'Aylık token kotası aşıldı',
  'usage.events.type.limitGeneric': 'Hız sınırı tetiklendi',
  'usage.events.tooltip.businessUnit': 'İş Birimi',
  'usage.events.tooltip.department': 'Departman',
  'usage.events.tooltip.profession': 'Meslek'
};
