var express = require("express");
var router = express.Router();
const Notification = require("../../models/Notification");

// Route to save notifications for matching users
router.post('/saveNotification', async (req, res) => {
    const { users, disease, description, category, location } = req.body;

    try {
        const notifications = users.map(user => ({
            email: user.email,
            disease,
            description,
            category,
            location
        }));

        // Save each notification
        await Notification.insertMany(notifications);

        return res.status(200).json({ message: 'Notifications saved successfully!' });
    } catch (err) {
        return res.status(500).json({ error: 'Error saving notifications.' });
    }
});

router.get('/getNotifications/:email', async (req, res) => {
  try {
      const email = req.params.email;
      // Find notifications by email and sort by timestamp in descending order
      const notifications = await Notification.find({ email })
          .sort({ timestamp: -1 }); // Newest notifications first
      res.json(notifications);
  } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).send('Server error');
  }
});
// Route to delete a notification by its id
router.delete('/deleteNotification/:id', async (req, res) => {
  const { id } = req.params;

  try {
      await Notification.findByIdAndDelete(id); // Delete the notification by ID
      res.status(200).json({ message: 'Notification deleted successfully!' });
  } catch (error) {
      res.status(500).json({ error: 'Error deleting notification.' });
  }
});

// Route to delete a notification by ID
router.delete('/deleteNotification/:id', async (req, res) => {
  const { id } = req.params;

  try {
      await Notification.findByIdAndDelete(id); // Delete the notification by ID
      res.status(200).json({ message: 'Notification deleted successfully!' });
  } catch (error) {
      res.status(500).json({ error: 'Error deleting notification.' });
  }
});


module.exports = router;
