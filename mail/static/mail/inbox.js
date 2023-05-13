document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email(recipients=null, subject=null, body=null) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // If it's a reply, pre-populate fields
  if (recipients && subject && body) {
    document.querySelector('#name').innerHTML = 'Reply';
    document.querySelector('#compose-recipients').value = recipients;
    document.querySelector('#compose-subject').value = subject;
    document.querySelector('#compose-body').value = body;
  }
  
  // Prevent the default form submission behavior
  const submit = document.querySelector('#compose-form');
  submit.addEventListener('submit', event => {
    event.preventDefault();
    // Send the email using the form data
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      if (result.error) {
        console.error(result.error);
      } else {
        load_mailbox('sent');
      }
    })
  });
}


function load_mailbox(mailbox) {
  
  // Hide other views
  document.querySelector('#compose-view').style.display = 'none';
  // Show the mailbox and mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Make a GET request to the server to get the emails for the specified mailbox
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Create a table element to display the emails
      const table = document.createElement('table');
      table.classList.add('table');
      table.classList.add('table-bordered');
      table.classList.add('mt-4');

      // Loop through each email and render it in a row
      emails.forEach(email => {
        // Create a new row element for the email
        const row = document.createElement('tr');
        row.classList.add('py-5');
        
        let recipientsCell = null;
        let senderCell = null;

        // Create cells for each piece of data
        if (mailbox === 'sent') {
          recipientsCell = document.createElement('td');
          recipientsCell.classList.add('recipients');
          recipientsCell.innerHTML = "To:  " + email.recipients;
        } else {
          senderCell = document.createElement('td');
          senderCell.classList.add('sender');
          senderCell.innerHTML = email.sender;
        }
        
        const subjectCell = document.createElement('td');
        subjectCell.classList.add('subject');
        subjectCell.innerHTML = email.subject;
        
        const timestampCell = document.createElement('td');
        timestampCell.classList.add('timestamp');
        timestampCell.classList.add('text-end');
        timestampCell.innerHTML = email.timestamp;
        
        // Add a different background color if the email is read or unread
        if (email.read) {
          row.classList.add('read');
        } else {
          row.classList.add('unread');
        }

        // Add an event listener to the row to load the email when clicked
        row.addEventListener('click', () => {
          loadEmail(email.id, mailbox);
        });

        // Append the cells to the row
        if (mailbox === 'sent') {
          row.appendChild(recipientsCell);
        } else {
          row.appendChild(senderCell);
        }
        row.appendChild(subjectCell);
        row.appendChild(timestampCell);

        // Append the row to the table
        table.appendChild(row);
      });

      // Append the table to the emails view
      document.querySelector('#emails-view').appendChild(table);
    });
}


function loadEmail(emailId, mailbox) {
  // Make a GET request to the server to get the email data
  fetch(`/emails/${emailId}`)
    .then(response => response.json())
    .then(email => {
      // Create a new div element for the email
      const emailDiv = document.createElement('div');
      emailDiv.innerHTML = `
        <p><strong>From:</strong> ${email.sender}</p>
        <p><strong>To:</strong> ${email.recipients}</p>
        <p><strong>Subject:</strong> ${email.subject}</p>
        <p><strong>Timestamp:</strong> ${email.timestamp}</p>
        <hr>
        <p style="white-space: pre-wrap;">${email.body}</p>
      `;
      // Add a reply button to the email view
      const replyButton = document.createElement('button');
      replyButton.classList.add('replyButton');
      replyButton.textContent = 'Reply';
      replyButton.addEventListener('click', () => {
        const subject = email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`;
        let recipient = '';
        if (mailbox === 'sent') {
          // If the email was sent by the current user, set the recipient to the original recipient
          recipient = email.recipients;
        } else {
          // If the email was received by the current user, set the recipient to the sender
          recipient = email.sender;
        }
        // Open the compose view and pre-fill fields
        compose_email(recipient, subject, `On ${email.timestamp} ${email.sender} wrote:\n${email.body}`);
      })
      
      // Display the email div in the emails view
      document.querySelector('#emails-view').innerHTML = '';
      document.querySelector('#emails-view').appendChild(emailDiv);
      if (mailbox !== 'sent') {
        const archive = document.createElement('button');
        archive.classList.add('archive');
        if (email.archived) {
          archive.innerHTML = 'Unarchive';
        } else {
          archive.innerHTML = 'Archive';
        }
        document.querySelector('#emails-view').appendChild(archive);
      }
      document.querySelector('#emails-view').appendChild(replyButton);
      
      document.querySelector('.archive').onclick = () => {
          if (email.archived) {
              markAsArchived(emailId, false);
          } else {
              markAsArchived(emailId, true);
          }
          load_mailbox('inbox');
      };

      // Mark the email as read
      if (!email.read) {
        markAsRead(emailId);
      }
    });
}


function markAsArchived(emailId, archive) {
  // Send a PUT request to the server to mark the email as archived/unarchived
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: archive
    })
  })
    .then(() => {
      // Load the user's inbox after the email has been archived/unarchived
      loadMailbox('inbox');
    })
    .catch(error => console.error(error));
}


function markAsRead(emailId) {
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });
}