# 🧠 Pràctica – GitHub Actions amb Next.js

Aquest projecte forma part de la pràctica sobre **GitHub Actions**, aplicant un conjunt de *workflows* automatitzats sobre un projecte basat en **Next.js**.

L’objectiu és entendre i configurar un sistema complet d’integració contínua (*CI/CD*), des de la validació del codi fins al desplegament i notificació automàtica.

---

## ⚙️ Conceptes teòrics

**GitHub Actions** és una eina d’automatització integrada en GitHub que permet definir fluxos de treball (*workflows*) per a executar accions automàtiques com ara:

- Validar el codi amb un **linter**  
- Executar **tests automàtics**  
- **Desplegar** el projecte en plataformes externes (com Vercel)  
- Enviar **notificacions** o actualitzar arxius automàticament  

### 🧩 Elements bàsics d’un workflow

| Element | Descripció |
|----------|-------------|
| **Workflow** | Fitxer YAML que defineix els jobs i quan s’executen (`.github/workflows/...`) |
| **Job** | Conjunt d’steps que s’executen en un *runner* |
| **Step** | Instrucció individual (execució de comandes o d’una acció) |
| **Runner** | Màquina virtual que executa els jobs (p. ex. `ubuntu-latest`) |
| **needs** | Defineix la dependència entre jobs |
| **if / continue-on-error** | Controla condicions d’execució o errors |
| **Artifacts** | Fitxers generats pels jobs que poden ser reutilitzats |
| **Secrets** | Variables segures (tokens, contrasenyes, claus API, etc.) |

---

## 🚀 Workflow principal: `Raul_Practica_Github_Actions_workflow.yml`

El workflow s’executa automàticament en cada *push* o *pull request* sobre la branca `main`.

### 🔹 1. Linter_job
- Executa `npm run lint -- --max-warnings=0`
- Verifica que la sintaxi i estil del codi siguin correctes segons **ESLint**
- Si es detecten advertències o errors, el job falla

### 🔹 2. Cypress_job
- Depèn del job anterior (`needs: [linter_job]`)
- Utilitza l’acció [`cypress-io/github-action`](https://github.com/cypress-io/github-action)
- Executa els **tests de Cypress** sobre el projecte ja compilat
- Desa el resultat a `result.txt`
- Pujarà l’arxiu com a *artifact* encara que hi hagi errors (`continue-on-error: true`)

### 🔹 3. Add_badge_job
- Recupera l’artifact `result.txt`
- Llig el resultat del test (`success` o `failure`)
- Afegeix un *badge* al final del `README.md` després del text:
- Utilitza una acció pròpia (`.github/actions/add-badge`)
- Fa un commit automàtic amb el canvi

### 🔹 4. Deploy_job
- Desplega automàticament a **Vercel**
- Fa servir l’acció [`amondnet/vercel-action@v20`](https://github.com/amondnet/vercel-action)
- Necessita els secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### 🔹 5. Notification_job
- Sempre s’executa (`if: always()`)
- Utilitza una acció pròpia escrita en **Node.js (Nodemailer)**
- Envia un **correu electrònic automàtic** amb el resultat del workflow
- Secrets necessaris:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `NOTIFY_TO`

---

## 🔐 Secrets configurats

| Nom | Descripció | Job |
|------|-------------|-----|
| `VERCEL_TOKEN` | Token d’autenticació per desplegar a Vercel | Deploy_job |
| `VERCEL_ORG_ID` | ID de l’organització a Vercel | Deploy_job |
| `VERCEL_PROJECT_ID` | ID del projecte a Vercel | Deploy_job |
| `SMTP_HOST` | Servidor SMTP (p. ex. `smtp.gmail.com`) | Notification_job |
| `SMTP_PORT` | Port del servidor SMTP | Notification_job |
| `SMTP_USER` | Correu d’origen | Notification_job |
| `SMTP_PASS` | Contrasenya d’aplicació de Gmail | Notification_job |
| `NOTIFY_TO` | Correu destinatari | Notification_job |

---

## 🧩 Resultat final del workflow

Cada vegada que es fa un *push* a la branca `main`:
1. El codi passa per **linting** i **tests automàtics**
2. S’actualitza el **README** amb el *badge* de l’últim resultat
3. El projecte es desplega automàticament a **Vercel**
4. Es rep un **correu automàtic** amb el resum dels jobs

---

## 📸 Annex – Captures del procés

Es pot consultar tota la documentació gràfica i el pas a pas de la pràctica al següent document:

👉 [Documentació de la pràctica (PDF)](./docs/Documentacio_Practica_Github_Actions.pdf)

### 📄 Exemple final al README:

```markdown
Example of nextjs project using Cypress.io

RESULTAT DELS ÚLTIMS TESTS  
![Tests](https://img.shields.io/badge/test-failure-red)

