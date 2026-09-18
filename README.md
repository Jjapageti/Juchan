# 교회 QR 보물찾기 / QR-Schatzsuche der Gemeinde

한국어와 독일어를 함께 표시하는 10개 QR·15개 미션 후보용 정적 웹앱입니다. 참가자는 숨겨진 QR을 직접 찾아야 하며, QR마다 참가자의 휴대폰에서 아직 나오지 않은 미션 하나가 무작위로 배정됩니다. 참가자 한 명에게는 15개 후보 중 최대 10개가 배정됩니다.

Statische zweisprachige Web-App mit zehn QR-Codes und 15 möglichen Missionen. Die Teilnehmenden suchen versteckte QR-Codes. Auf jedem Gerät wird jedem QR-Code zufällig eine noch nicht zugeteilte Mission zugewiesen. Jede Person erhält höchstens zehn der 15 möglichen Missionen.

## 게임 동작 / Spielablauf

- 같은 QR도 참가자마다 서로 다른 미션이 나올 수 있습니다.
- 한 참가자에게 이미 배정된 미션은 다시 나오지 않습니다.
- 같은 QR은 참가자별로 한 번만 사용할 수 있습니다.
- 새로고침해도 현재 QR의 미션은 바뀌지 않습니다.
- 진행 중인 미션을 완료하거나 실패 처리하기 전에는 다른 QR 미션으로 넘어갈 수 없습니다.
- 미션 6에서 목사님과의 게임에 지면 `미션 실패` 버튼으로 해당 QR을 소비하고 다음 QR을 찾습니다.
- 사진 업로드나 이미지 분석은 사용하지 않습니다.
- 진행도는 각 참가자 휴대폰의 `localStorage`에 저장됩니다.

## QR 주소

GitHub Pages 기본 주소가 `https://jjapageti.github.io/Juchan/`인 경우 다음 주소로 QR코드 10개를 만듭니다.

```text
https://jjapageti.github.io/Juchan/?spot=1
https://jjapageti.github.io/Juchan/?spot=2
https://jjapageti.github.io/Juchan/?spot=3
https://jjapageti.github.io/Juchan/?spot=4
https://jjapageti.github.io/Juchan/?spot=5
https://jjapageti.github.io/Juchan/?spot=6
https://jjapageti.github.io/Juchan/?spot=7
https://jjapageti.github.io/Juchan/?spot=8
https://jjapageti.github.io/Juchan/?spot=9
https://jjapageti.github.io/Juchan/?spot=10
```

## 로컬 실행 / Lokal starten

프로젝트 폴더에서 다음 명령을 실행합니다.

```powershell
py -m http.server 8000
```

테스트 주소:

```text
http://localhost:8000/?spot=1
```

## 현재 설정 / Aktuelle Einstellungen

- QR 개수: 10개 / Anzahl QR-Codes: 10
- 미션 후보: 15개 / Mögliche Missionen: 15
- 참가자별 최대 미션: 10개 / Maximal zehn Missionen pro Person
- 모든 미션 비밀번호 / Passwort: `b486`
- 입력창 표시: 비밀번호 마스킹 / Passwort maskiert

비밀번호는 참가자의 화면에서 보이지 않도록 진행자가 직접 입력하는 것을 권장합니다. 정적 웹사이트이므로 개발자 도구로 소스를 확인하면 비밀번호를 찾을 수 있습니다.
