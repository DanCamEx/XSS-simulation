# XSS-simulation: Simulazione di un attacco Cross-Site Scripting persistente (Stored XSS)

Questo progetto rappresenta una simulazione di tipo **Stored Cross-Site Scripting (XSS)**. Mostra come la mancanza di sanitizzazione dell'input consenta di eseguire codice JavaScript nel browser degli utenti, portando in questo caso a un attacco di phishing che nel nostro caso specifico è in grado di rubare le credenziali degli account Google degli utenti.

Il progetto è composto da due web server totalmente isolati e containerizzati con Docker:
1. **`news_site` (Applicazione Vulnerabile - Porta 3000):** Un semplice sito che simula una notizia riportata da questo finto giornale chiamato "Il Mondo del Tech". Gli utenti possono visualizzare la news e inserire commenti.
2. **`login_site` (Server dell'Attaccante - Porta 3001):** Una pagina clone del login di Google, utilizzata per intercettare le credenziali degli utenti facendogli credere di star loggando sul vero sito di Google.

---

## Come avviare il progetto

È necessario avere **Docker** e **Docker Compose** installati sul sistema.

1. Aprire un terminale nella directory radice del progetto (dove sta il file `docker-compose.yml`).
2. Eseguire il comando:
   ```bash
   docker compose up --build -d
   ```
3. I servizi saranno esposti ai seguenti indirizzi:
   - Sito News: [http://localhost:3000](http://localhost:3000)
   - Sito Login: [http://localhost:3001](http://localhost:3001)

*(Per arrestare i container, utilizzare `docker compose down`)*

---

## Come replicare l'attacco

**1. Esecuzione dell'attacco**
- Aprire il proprio browser e raggiungere il seguente link: [http://localhost:3000](http://localhost:3000)
- Scorrere fino alla sezione di inserimento dei commenti.
- Inserire un valore qualsiasi nel campo "Nome".
- Nel campo "Il tuo commento" copiare e incollare lo script presente nel file `script.js` nel progetto.
  ```
- Cliccare su **Pubblica Commento**.

Il payload viene memorizzato nel database. Da questo momento, il rendering della pagina richiamerà anche questo commento dal database ed eseguirà lo script sul browser di ogni utente che lo andrà a visitare.

**2. Conseguenze dell'attacco**
- Dopo aver inserito lo script tra i commenti, i browser di tutti gli utenti che accederanno al sito [http://localhost:3000](http://localhost:3000) elaboreranno automaticamente lo script.
-  Da quel momento ad ogni utente che tenterà di inserire un commento comparirà un banner dove viene richiesto prima di creare un account utilizzando il servizio di autenticazione fornito da Google.

- Credendo di dover creare al volo un account usando Google per continuare e mandare il commento, l'utente inserisce le proprie credenziali.
- A questo punto le credenziali vengono memorizzate nel database dell'attacker con l'email e la password di tutti gli utenti che proveranno ad accedere.
- L'utente verrà poi reindirizzato al sito originale con il commento pubblicato, dando l'impressione che il login sia andato a buon fine e che sia riuscito ad accedere.

**3. Come verificare se i dati sono stati rubati**
Le credenziali rubate vengono salvate in un database usando il DBMS SQLite in un file chiamato `sqlite.db` creato all'interno della directory `login_site/`. Per leggerle è possibile usare un'estensione di vscode o un'applicazione apposita.

## Tecnologie e Framework Utilizzati
Node.js, SQLite, Docker, EJS, Fastify, Tailwind CSS