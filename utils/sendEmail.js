const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASS,
  },
});

const sendVerificationEmail = async (toEmail, userName, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email/${token}`;
  const fromEmail = process.env.MAILER_EMAIL;
  const fromName = process.env.MAIL_FROM_NAME?.replace(/"/g, '') || "SmartBuild";

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: toEmail,
    subject: "✅ Vérifiez votre email — SmartBuild",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🏠 SmartBuild</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Vérification de votre adresse email</p>
        </div>

        <div style="background: #f9fafb; padding: 40px 30px;">
          <h2 style="color: #1f497b; margin: 0 0 16px;">Bonjour ${userName} 👋</h2>
          <p style="color: #555; line-height: 1.7; font-size: 15px;">
            Bienvenue sur SmartBuild ! Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}"
               style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
              ✅ Vérifier mon email
            </a>
          </div>

          <p style="color: #999; font-size: 13px; text-align: center;">
            Ce lien expire dans 24 heures.<br/>
            Si vous n'avez pas créé de compte SmartBuild, ignorez cet email.
          </p>
        </div>

        <div style="background: #3b82f6; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
          <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 13px;">
            © 2025–2026 SmartBuild — Tous droits réservés
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendValidationEmail = async (toEmail, userName) => {
  const fromEmail = process.env.MAILER_EMAIL;
  const fromName = process.env.MAIL_FROM_NAME?.replace(/"/g, '') || "SmartBuild";

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: toEmail,
    subject: "✅ Bienvenue sur SmartBuild — Compte créé avec succès",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1F497B, #2E75B6); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🏠 SmartBuild</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Plateforme intelligente de devis immobilier</p>
        </div>

        <div style="background: #f9f9f9; padding: 40px 30px;">
          <h2 style="color: #1F497B; margin: 0 0 16px;">Bonjour ${userName} 👋</h2>
          <p style="color: #555; line-height: 1.7; font-size: 15px;">
            Votre compte SmartBuild a été créé avec succès. Vous pouvez dès maintenant accéder à votre espace et commencer à estimer votre projet de construction.
          </p>

          <div style="background: white; border-radius: 10px; padding: 20px; margin: 24px 0; border-left: 4px solid #2E75B6;">
            <p style="margin: 0 0 12px; font-weight: bold; color: #1F497B;">Ce que vous pouvez faire :</p>
            <p style="margin: 6px 0; color: #555;">✅ Estimer le coût de construction de votre maison</p>
            <p style="margin: 6px 0; color: #555;">✅ Obtenir des devis comparatifs (Économique / Standard / Premium)</p>
            <p style="margin: 6px 0; color: #555;">✅ Trouver des ingénieurs et des professionnels qualifiés</p>
            <p style="margin: 6px 0; color: #555;">✅ Télécharger votre devis en PDF</p>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/devis-wizard"
               style="background: linear-gradient(135deg, #1F497B, #2E75B6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
              🚀 Commencer mon estimation
            </a>
          </div>

          <p style="color: #999; font-size: 13px; text-align: center;">
            Si vous n'avez pas créé ce compte, ignorez cet email.
          </p>
        </div>

        <div style="background: #1F497B; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
          <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 13px;">
            © 2025–2026 SmartBuild — Tous droits réservés
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendValidationEmail };