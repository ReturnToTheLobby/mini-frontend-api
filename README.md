# Mini-Frontend API Postări

1. **URL-ul API-ului:** S-a utilizat API-ul public de test JSONPlaceholder: `https://jsonplaceholder.typicode.com/posts`.
2. **Soluția CORS:** Deoarece API-ul extern oferă din oficiu headerele CORS corespunzătoare (`Access-Control-Allow-Origin: *`), nu a fost necesară configurarea unui proxy suplimentar pe client. În cazul unui backend propriu, CORS se configurează pe server folosind middleware-ul specific (ex: `cors` în Express.js).
3. **Status Codes tratate:**
   - **201 / 200 (Success):** La cererile GET/POST reușite, datele sunt procesate și afișate direct în interfață fără a reîncărca pagina.
   - **4xx (Client Errors):** Sunt interceptate prin verificarea `response.status`, afișând un mesaj de eroare specific lângă formular.
   - **Erori de rețea (Network Errors):** Prin blocul `catch`, se detectează căderea conexiunii și se afișează un mesaj generic prietenos utilizatorului.