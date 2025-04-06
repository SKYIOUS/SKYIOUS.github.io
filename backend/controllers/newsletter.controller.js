const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email, name, categories } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    // Check if already subscribed
    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      // If unsubscribed before, resubscribe
      if (!subscriber.isSubscribed) {
        subscriber.isSubscribed = true;
        subscriber.subscribedDate = Date.now();
        subscriber.unsubscribedDate = undefined;
        
        if (categories && categories.length > 0) {
          subscriber.categories = categories;
        }
        
        await subscriber.save();

        return res.status(200).json({
          success: true,
          message: 'Successfully resubscribed to the newsletter'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Email already subscribed to the newsletter'
      });
    }

    // Create new subscriber
    subscriber = await Newsletter.create({
      email,
      name: name || '',
      categories: categories || ['general'],
      subscribedDate: Date.now()
    });

    // Send welcome email
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
        subject: 'Welcome to SKYIOUS Newsletter',
        text: `Hello ${name || 'there'},\n\nThank you for subscribing to our newsletter. You'll receive updates on new content, resources, and features.\n\nIf you didn't subscribe, you can unsubscribe by clicking the unsubscribe link in any of our emails.\n\nBest regards,\nThe SKYIOUS Team`
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Continue without failing if email sending fails
    }

    res.status(201).json({
      success: true,
      data: subscriber,
      message: 'Successfully subscribed to the newsletter'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    // Find subscriber
    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber || !subscriber.isSubscribed) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in newsletter subscribers'
      });
    }

    // Update subscription status
    subscriber.isSubscribed = false;
    subscriber.unsubscribedDate = Date.now();
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from the newsletter'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isSubscribed: true });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Send newsletter
// @route   POST /api/newsletter/send
// @access  Private/Admin
exports.sendNewsletter = async (req, res) => {
  try {
    const { subject, message, categories } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a subject and message'
      });
    }

    // Get subscribers based on categories if provided
    let query = { isSubscribed: true };
    
    if (categories && categories.length > 0) {
      query.categories = { $in: categories };
    }
    
    const subscribers = await Newsletter.find(query);

    if (subscribers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No subscribers found for the selected categories'
      });
    }

    // Send email to all subscribers
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    let successCount = 0;
    let errorCount = 0;

    for (const subscriber of subscribers) {
      try {
        await transporter.sendMail({
          from: `SKYIOUS <${process.env.EMAIL_FROM}>`,
          to: subscriber.email,
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
                <h1>SKYIOUS Newsletter</h1>
              </div>
              <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
                ${message}
              </div>
              <div style="padding: 10px 20px; background-color: #f5f5f5; font-size: 12px; color: #666; text-align: center;">
                <p>You're receiving this email because you subscribed to the SKYIOUS newsletter.</p>
                <p>To unsubscribe, <a href="${req.protocol}://${req.get('host')}/api/newsletter/unsubscribe?email=${subscriber.email}">click here</a>.</p>
              </div>
            </div>
          `
        });
        successCount++;
      } catch (error) {
        console.error(`Error sending to ${subscriber.email}:`, error);
        errorCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Newsletter sent to ${successCount} subscribers with ${errorCount} errors.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 