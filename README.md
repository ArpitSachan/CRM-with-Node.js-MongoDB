# Customer relation Management (CRM)

## Features
 
* User Login and Registration - user verification through email functionality.
* Customer Information Screen - Add/Delete/Update Customer information(Name, email, phone, address, GST No., frequency of automated reminder)
* CRM Screen - For each of the customer, a contact screen has been made where the user can see the history of past communications. He can add the communications made with timestamp information, conversation information. Also there should be a functionality to directly send mail to the customer from the app itself.
* Automated mail scheduling - setting up a mail scheduler which sends a mail of the past conversations with the user at a given number of days.

## Libraries Used

* `Mongodb` databse
* Authentication using `JSONWebToken` with email verification.
* In app mail sending usign `nodemailer` with automated reminder mail sending with `Kue libarary for Job scheduling`
* `Winston` logger for logging purposes
