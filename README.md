# Email Client Single-Page-App using Django

### [Video Demo](https://youtu.be/ke0SxYfIFXU)

This is a single-page-app email client project built with JavaScript, HTML, CSS, and Django. The application allows users to send and receive emails, archive and unarchive them, reply to emails, and mark them as read or unread.

# Technologies
- Django: A high-level Python web framework used to build web applications
- JavaScript: A programming language used for web development
- HTML: A markup language used to create web pages
- CSS: A stylesheet language used to style web pages

# Functionality
The application has the following functionality:

- Sending emails: Users can fill out the email composition form and send an email to the desired recipient(s).
- Viewing mailbox: Users can view their Inbox, Sent mailbox, and Archive, and view the latest emails in the selected mailbox.
- Displaying emails: Each email in the mailbox is displayed in its own box that shows who the email is from, the subject line, and the timestamp. Unread emails have a white background, and read emails have a gray background.
- Viewing email content: When a user clicks on an email, they are taken to a view where they can see the content of that email, including the sender, recipients, subject, timestamp, and body.
- Archiving and unarchiving emails: Users can archive and unarchive received emails.
- Replying to emails: When viewing an email, users can click on the "Reply" button to reply to the email. The composition form is prefilled with the recipient field set to whoever sent the original email, subject line, and body of the email.

# How to Use
To use the email client:

1. Clone the repository from GitHub to your local machine.
2. Create a virtual environment and install the required dependencies from the requirements.txt file.
3. In the Django project directory, run the following command to start the development server:
    python manage.py runserver
4. Navigate to the email client application at http://localhost:8000/.

# Credits
This project was completed as part of the HarvardX CS50W Web Programming with Python and JavaScript course. The HTML and CSS templates were provided by the course, and the JavaScript functionality was implemented by me.
