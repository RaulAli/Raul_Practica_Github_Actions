const nodemailer = require("nodemailer");

(async () => {
    try {
        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT || 587),
            secure: String(SMTP_PORT) === "465",
            auth: { user: SMTP_USER, pass: SMTP_PASS },
        });

        const body = `
S'ha realitzat un push en la branca main que ha provocat l'execució del workflow Raul_Practica_Github_Actions_workflow amb els següents resultats:

- linter_job: ${process.env.INPUT_LINTER_RESULT}
- cypress_job: ${process.env.INPUT_CYPRESS_RESULT}
- add_badge_job: ${process.env.INPUT_ADD_BADGE_RESULT}
- deploy_job: ${process.env.INPUT_DEPLOY_RESULT}
`.trim();

        const info = await transporter.sendMail({
            from: `"CI Notifier" <${SMTP_USER}>`,
            to: process.env.INPUT_TO,
            subject: process.env.INPUT_SUBJECT,
            text: body,
        });

        console.log(`Email sent: ${info.messageId}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
