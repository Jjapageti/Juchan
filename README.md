# 교회 QR 보물찾기 / QR-Schatzsuche der Gemeinde

한국어와 독일어를 함께 표시하는 10개 미션용 정적 웹앱입니다. 사진 업로드 및 이미지 분석 기능은 제거되었으며, 모든 미션은 현장에서 증거를 확인받고 비밀번호를 입력하는 방식으로 진행됩니다.

Statische Web-App mit zehn Missionen auf Koreanisch und Deutsch. Foto-Upload und Bildanalyse wurden entfernt. Nach jeder erfüllten Aufgabe wird der Nachweis vor Ort geprüft und das Passwort eingegeben.

## 실행 / Start

1. 전체 폴더를 GitHub 저장소에 업로드합니다.
2. GitHub Pages를 활성화합니다.
3. 생성된 페이지 주소로 QR코드를 만듭니다.

1. Den gesamten Ordner in ein GitHub-Repository hochladen.
2. GitHub Pages aktivieren.
3. Aus der veröffentlichten URL einen QR-Code erstellen.

## 현재 설정 / Aktuelle Einstellungen

- 완료해야 하는 미션: 10개 / Abzuschließende Missionen: 10
- 미션 순서: 참가자별 무작위 / Reihenfolge: zufällig pro Teilnehmer
- 모든 미션 비밀번호 / Passwort für alle Missionen: `b486`
- 진행도 저장: 참가자의 브라우저 `localStorage`
- Fortschritt: im `localStorage` des Browsers

비밀번호를 변경하려면 `questions/question1.js`부터 `question10.js`까지의 `answers` 값을 수정하세요.

Zum Ändern des Passworts den Wert `answers` in `questions/question1.js` bis `question10.js` anpassen.
