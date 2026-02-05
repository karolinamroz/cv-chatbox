export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  
    const { name, email, message, type } = req.body
  
    // Determine email content based on type
    let subject, htmlContent, toEmail
  
    if (type === 'contact') {
      // Someone wants to contact Karolina
      subject = `Portfolio Contact: ${name}`
      htmlContent = `
        <h2>New message from your portfolio</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
      toEmail = 'kwintuj@gmail.com'
    } else if (type === 'cv-request') {
      // Someone wants the CV sent to them
      subject = `Karolina Mroz - CV`
      htmlContent = `
        <h2>Hi!</h2>
        <p>Thanks for your interest in my profile. Please find my CV attached.</p>
        <p>Feel free to reach out if you'd like to chat!</p>
        <br>
        <p>Best regards,</p>
        <p>Karolina Mroz</p>
        <p>kwintuj@gmail.com</p>
      `
      toEmail = email
    }
  
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Karolina Mroz', email: 'kwintuj@gmail.com' },
          to: [{ email: toEmail }],
          subject: subject,
          htmlContent: htmlContent,
          ...(type === 'cv-request' && {
            attachment: [{
              url: 'https://cv-chatbox.vercel.app/Karolina_Mroz_CV.pdf',
              name: 'Karolina_Mroz_CV.pdf'
            }]
          })
        })
      })
  
      if (!response.ok) {
        const error = await response.text()
        console.error('Brevo error:', error)
        return res.status(500).json({ error: 'Failed to send email' })
      }
  
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({ error: 'Failed to send email' })
    }
  }