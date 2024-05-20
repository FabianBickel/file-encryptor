# File Encryptor

---

**a) Src mit Hinweis:**
- Wo wird die Integrität geprüft?
    Die Integrität der Datei wird in `FileEncryptorDecryptor.tsx` in der Funktion `decryptFile()` auf Zeile `181` geprüft, indem der Hashwert der entschlüsselten Datei mit dem der verschlüsselten Datei verglichen wird.
- Wo sind die Passwortregeln?
    In der Datei `FileEncryptorDecryptor.tsx` werden die Passwortregeln in der Funktion `validatePassword()` überprüft.
- Welche Teile vom Kürteil sind wo gelöst?
    4) Siehe "Wo sind die Passwortregeln?"
    6) `FileUploader.tsx` nimmt durch die Funktion `handleDrop` (eine Konstante `const`) eine Datei per Drag&Drop und liefert gibt sie zurück an `App.tsx`. Die Logik 


**b) 1 Originalfile und 1 verschlüsseltes File mit Angabe Geheimnis**
    Das Geheimnis lautet `F@v1c0n.png`

**c) 1 Screenshot der Startseite eurer Applikation** ✅

**d) Erklärung: "Selbst gemacht", bwz. "Selbst gemacht sind die Teile...."**
    Der grösste Teil der Applikation wurde selbständig angefertigt. Die Hilfe von ChatGPT wurde nur eingesetzt, 