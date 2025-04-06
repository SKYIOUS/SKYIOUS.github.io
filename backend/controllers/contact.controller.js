const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create contact record
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Send confirmation email to user
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      await transporter.sendMail({
        from: `SKYIOUS <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Thank you for contacting us',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
              <h1>SKYIOUS</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              <p>Hello ${name},</p>
              <p>Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>
              <p>For your reference, here's a copy of your message:</p>
              <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #4F46E5;">
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p>Best regards,<br>The SKYIOUS Team</p>
            </div>
          </div>
        `
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Continue without failing if email sending fails
    }

    // Send notification to admin
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      await transporter.sendMail({
        from: `SKYIOUS <${process.env.EMAIL_FROM}>`,
        to: process.env.EMAIL_FROM,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
              <h1>New Contact Form Submission</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #4F46E5;">
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p><strong>IP Address:</strong> ${req.ip}</p>
              <p><strong>User Agent:</strong> ${req.headers['user-agent']}</p>
              <p><a href="${req.protocol}://${req.get('host')}/admin/dashboard.html">View in Admin Dashboard</a></p>
            </div>
          </div>
        `
      });
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Continue without failing if email sending fails
    }

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
exports.getContactSubmissions = async (req, res) => {
  try {
    // Query parameters for filtering
    const { status } = req.query;
    
    // Build query object
    const queryObj = {};
    if (status) {
      queryObj.status = status;
    }
    
    const submissions = await Contact.find(queryObj).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single contact submission
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContactSubmission = async (req, res) => {
  try {
    const submission = await Contact.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    // Update status to 'read' if it was 'new'
    if (submission.status === 'new') {
      submission.status = 'read';
      await submission.save();
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update contact submission status
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContactSubmission = async (req, res) => {
  try {
    const { status, response } = req.body;

    const submission = await Contact.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    // Update status if provided
    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      submission.status = status;
    }

    // Update response if provided
    if (response) {
      submission.response = {
        text: response,
        date: Date.now(),
        respondedBy: req.user.id
      };
      
      // Send response email to the contact
      try {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
          }
        });

        await transporter.sendMail({
          from: `SKYIOUS <${process.env.EMAIL_FROM}>`,
          to: submission.email,
          subject: `Re: ${submission.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
                <h1>SKYIOUS</h1>
              </div>
              <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
                <p>Hello ${submission.name},</p>
                <p>Thank you for contacting us. Here's our response to your inquiry:</p>
                <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #4F46E5;">
                  <p>${response.replace(/\n/g, '<br>')}</p>
                </div>
                <p>For reference, your original message was:</p>
                <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #808080;">
                  <p><strong>Subject:</strong> ${submission.subject}</p>
                  <p><strong>Message:</strong></p>
                  <p>${submission.message.replace(/\n/g, '<br>')}</p>
                </div>
                <p>If you have any further questions, please don't hesitate to reply to this email.</p>
                <p>Best regards,<br>The SKYIOUS Team</p>
              </div>
            </div>
          `
        });
        
        // If email sent successfully, update status to replied
        submission.status = 'replied';
      } catch (error) {
        console.error('Error sending response email:', error);
        return res.status(500).json({
          success: false,
          message: 'Error sending response email'
        });
      }
    }

    await submission.save();

    res.status(200).json({
      success: true,
      data: submission,
      message: 'Contact submission updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContactSubmission = async (req, res) => {
  try {
    const submission = await Contact.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    await submission.remove();

    res.status(200).json({
      success: true,
      message: 'Contact submission deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 