# ChatAZ — Real Vaxtda Mesajlaşma Proqramı

WhatsApp stilli, real vaxtda işləyən mesajlaşma proqramı.

## Xüsusiyyətlər
- 👥 Çox istifadəçili — dostlarınızla eyni anda danışın
- 💬 Xüsusi mesajlaşma (şəxsi söhbətlər)
- 🏠 Qrup otaqları (Ümumi, Texnologiya, Əyləncə, Müzakirə)
- 🤖 AI Köməkçi (Anthropic Claude ilə)
- ⌨️ "Yazır..." göstəricisi
- 🌙 Qaranlıq/İşıq tema
- 🔔 Yeni mesaj bildirişləri

## Quraşdırma

### Tələblər
- Node.js (v16+) — https://nodejs.org dan yükləyin

### Addımlar

```bash
# 1. Qovluğa keçin
cd chataz

# 2. Asılılıqları yükləyin
npm install

# 3. Serveri işə salın
npm start
```

### İstifadə

1. Brauzer açın: **http://localhost:3000**
2. Adınızı daxil edin, rəng seçin → "Daxil ol"
3. Dostunuz da eyni addımı eləsin — **eyni şəbəkədədirsənsə** `http://[SİZİN_IP]:3000` ünvanını ona göndərin
4. Sol paneldən istifadəçi və ya otaq seçin, yazın!

### Dostunuzu bağlamaq üçün
Öz IP adresinizi öyrənin:
- **Windows**: `cmd`-də `ipconfig` yazın
- **Mac/Linux**: `ifconfig` və ya `ip addr`

Sonra dostunuza `http://192.168.X.X:3000` ünvanını göndərin (WiFi eyni olmalıdır).

## İnternetdən əlçatan etmək (isteğe bağlı)
```bash
# ngrok ilə (pulsuz)
npx ngrok http 3000
```
Sizə `https://xxxx.ngrok.io` kimi URL verəcək — onu hər yerdən istifadə etmək olar.

---
ChatAZ ilə xoş söhbətlər! 💬
