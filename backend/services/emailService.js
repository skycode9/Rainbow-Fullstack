const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Send contact form email to admin
const sendContactEmail = async (contactData) => {
  try {
    const { name, email, subject, message } = contactData;

    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL_ADMIN_CONTACT,
      to: process.env.ADMIN_EMAIL,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">This email was sent from Rainbow Films contact form.</p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return { success: false, error: error.message };
  }
};

// Send welcome email to subscriber
const sendWelcomeEmail = async (subscriberEmail) => {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: subscriberEmail,
      subject: "Welcome to Rainbow Films Newsletter! 🎬",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to Rainbow Films! 🎬</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #333;">Thank you for subscribing to our newsletter!</p>
            <p style="color: #666;">You'll now receive updates about:</p>
            <ul style="color: #666;">
              <li>Latest film releases</li>
              <li>Behind-the-scenes content</li>
              <li>Exclusive announcements</li>
              <li>Special events and screenings</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block;">
                Visit Our Website
              </a>
            </div>
            <p style="color: #999; font-size: 12px; text-align: center;">
              If you didn't subscribe, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
};

// Send confirmation email to contact form submitter
const sendContactConfirmation = async (contactData) => {
  try {
    const { name, email, subject } = contactData;

    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "We received your message! 📬",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Thank You for Contacting Us! 📬</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #333;">Hi ${name},</p>
            <p style="color: #666;">
              We've received your message regarding "<strong>${subject}</strong>" and our team will get back to you as soon as possible.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="color: #666; margin: 0;">
                <strong>What happens next?</strong>
              </p>
              <ul style="color: #666; margin-top: 10px;">
                <li>Our team will review your message</li>
                <li>We typically respond within 24-48 hours</li>
                <li>You'll receive a reply at this email address</li>
              </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block;">
                Visit Our Website
              </a>
            </div>
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
              This is an automated confirmation email from Rainbow Films.
            </p>
          </div>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending contact confirmation:", error);
    return { success: false, error: error.message };
  }
};

// Send notification to admin about new subscriber
const sendSubscriberNotification = async (subscriberEmail) => {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL_ADMIN_SUBSCRIBER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Newsletter Subscriber 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Newsletter Subscriber!</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${subscriberEmail}</p>
            <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #666; font-size: 12px;">This is an automated notification from Rainbow Films.</p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending subscriber notification:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactEmail,
  sendContactConfirmation,
  sendWelcomeEmail,
  sendSubscriberNotification,
};
