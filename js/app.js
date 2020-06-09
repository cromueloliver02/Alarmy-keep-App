// Display Current Year
// document.getElementById('year').textContent = new Date().getFullYear();

// Note Constructor
class Note {
   constructor(title, text, fullDate, id) {
      this.title = title;
      this.text = text;
      this.fullDate = fullDate;
      this.id = id;
   }
}
// UI Constructor
class UI {
   getFullDate() {
      var now = new Date();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var ap = "AM";
      if (hour > 11) {
         ap = "PM";
      }
      if (hour > 12) {
         hour = hour - 12;
      }
      if (hour == 0) {
         hour = 12;
      }
      if (hour < 10) {
         hour = "0" + hour;
      }
      if (minute < 10) {
         minute = "0" + minute;
      }
      let day;
      let month;
      switch (new Date().getMonth()) {
         case 0:
            month = 'January';
            break;
         case 1:
            month = 'February';
            break;
         case 2:
            month = 'March';
            break;
         case 3:
            month = 'April';
            break;
         case 4:
            month = 'May';
            break;
         case 5:
            month = 'June';
            break;
         case 6:
            month = 'July';
            break;
         case 7:
            month = 'August';
            break;
         case 8:
            month = 'September';
            break;
         case 9:
            month = 'October';
            break;
         case 10:
            month = 'November';
            break;
         case 11:
            month = 'December';
            break;
         default:
            month = '';
            break
      }
      switch (new Date().getDay()) {
         case 0:
            day = 'Sunday';
            break;
         case 1:
            day = 'Monday';
            break;
         case 2:
            day = 'Tuesday';
            break;
         case 3:
            day = 'Wednesday';
            break;
         case 4:
            day = 'Thursday';
            break;
         case 5:
            day = 'Friday';
            break;
         case 6:
            day = 'Saturday';
            break;
         default:
            day = '';
            break;
      }
      const date = new Date().getDate();
      const year = new Date().getFullYear();

      return `${day}, ${month} ${date}, ${year}&nbsp;&nbsp;&nbsp;&nbsp;${hour} : ${minute} ${ap}`;
   }

   // Add Note To The List
   addNoteToList(note) {
      const noteList = document.getElementById('note-list');
      const div = document.createElement('div');
      div.setAttribute('id', `${note.id}`);
      div.className = `alert alert-dark`;
      div.innerHTML = `
         <button class="close delete-btn text-danger">
               <span>
                  <i class="fas fa-trash-alt"></i>
               </span>
            </button>
            <h5>${note.title}</h5>
            ${note.text}
         <p class="text-right m-0 text-muted"><small>${note.fullDate}</small></p>
      `;
      noteList.insertBefore(div, noteList.firstChild)
   }

   // Clear All Fields
   clearFields() {
      document.getElementById('title').value = '';
      document.getElementById('note').value = '';
   }

   // Show Message Alert
   showMessage(message, className) {
      if (document.querySelector('.message-alert') === null) {
         const noteInputBox = document.getElementById('note-input-box');
         const name = document.getElementById('name');
         const div = document.createElement('div');
         div.className = `alert ${className} message-alert`;
         div.appendChild(document.createTextNode(message));
         noteInputBox.insertBefore(div, name.nextElementSibling);

         // Remove Message Alert After 3 Seconds
         setTimeout(function () {
            document.querySelector('.message-alert').remove();
         }, 2500);
      }
   }

   // Delete Note From The List
   deleteNoteFromList(target) {
      target.parentElement.parentElement.parentElement.remove();

      // Show Success Message Alert
      new UI().showMessage('Success: note deleted.', 'alert-success');
   }

   // Hide Subtext
   hideSubtext() {
      document.getElementById('subtext').classList.add('d-none');
      document.getElementById('subtext').classList.remove('d-block');
   }
   // Show Subtext
   showSubtext() {
      document.getElementById('subtext').classList.remove('d-none');
      document.getElementById('subtext').classList.add('d-block');
   }
   // Toggle Subtext
   toggleSubtext() {
      if (Storage.isLSEmpty() === true) {
         new UI().showSubtext();
      } else {
         new UI().hideSubtext();
      }
   }
}
// Storage Constructor
class Storage {
   // Get Notes From Local Storage
   static getNotesFromLS() {
      let notes;
      if (localStorage.getItem('notes') === null) {
         notes = [];
      } else {
         notes = JSON.parse(localStorage.getItem('notes'));
      }

      return notes;
   }

   // Add Notes To The LocalStorage
   static addNoteToLS(note) {
      const notes = Storage.getNotesFromLS();

      notes.push(note);

      localStorage.setItem('notes', JSON.stringify(notes));
   }

   static displayNotesFromLS() {
      const notes = Storage.getNotesFromLS();

      notes.forEach(function (note) {
         new UI().addNoteToList(note);
      });
   }

   static deleteFromTheLS(id) {
      const notes = Storage.getNotesFromLS();

      notes.forEach(function (note, index) {
         if (note.id == id) {
            notes.splice(index, 1);
         }
      });

      localStorage.setItem('notes', JSON.stringify(notes));
   }

   static isLSEmpty() {
      const notes = Storage.getNotesFromLS();

      if (notes.length === 0) {
         return true;
      } else {
         return false;
      }
   }
}

// Add Note Event Listener
document.getElementById('note-form').addEventListener('submit', function (e) {
   // Get Form Values
   const title = document.getElementById('title').value,
      text = document.getElementById('note').value,
      fullDate = new UI().getFullDate(),
      id = new Date().getTime();

   // Validate Inputs
   if (title === '' || text === '') {
      // Show Error Message Alert
      new UI().showMessage('Error: please fill in all the fields.', 'alert-danger');
   } else {
      // Add Note To The Note List
      new UI().addNoteToList(new Note(title, text, fullDate, id));

      // Add Note To The Local Server
      Storage.addNoteToLS(new Note(title, text, fullDate, id));

      // Hide/Show Subtext if LS is Empty/Not Empty
      new UI().toggleSubtext();

      // Show Success Message Alert
      new UI().showMessage('Success: note added.', 'alert-success');

      // Clear Fields
      new UI().clearFields();
   }

   e.preventDefault();
});
// Delete Note Event Listener
document.getElementById('note-list').addEventListener('click', function (e) {
   if (e.target.parentElement.parentElement.classList.contains('delete-btn')) {
      // Delete Note From The Note List
      new UI().deleteNoteFromList(e.target);

      // Delete Note From The LS
      Storage.deleteFromTheLS(e.target.parentElement.parentElement.parentElement.id);

      // Hide/Show Subtext if LS is Empty/Not Empty
      new UI().toggleSubtext();

      // Show Success Message Alert
      new UI().showMessage('Success: note deleted.', 'alert-success');
   }

   e.preventDefault();
});
// Display Notes From LS On Load
document.addEventListener('DOMContentLoaded', Storage.displayNotesFromLS);
// Hide/Show Table If LS is Empty/Not Empty
document.addEventListener('DOMContentLoaded', function () {
   // Hide/Show Subtext if LS is Empty/Not Empty
   new UI().toggleSubtext();
});