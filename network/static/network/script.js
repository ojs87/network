document.addEventListener('DOMContentLoaded', function() {
   document.querySelector('form').onsubmit = () => newpost();
});


function newpost() {
   console.log("hello")
   const body = document.querySelector('#newpostbody').value;
   document.querySelector('#newpostbody').value = "";
   console.log(body)
   fetch('/posts', {
      method: 'POST',
      body: JSON.stringify({
         body: body,
      })
   })
   .then(response => response.json())
   .then(result => {
       // Print result
       location.reload();
       console.log(result);

   });
   //stop form from submiting
   return false;
}

function editpost(clicked_id) {
   document.getElementById('edit-button_' + clicked_id).setAttribute('onClick', 'savepost(' + clicked_id + ')')
   const tarea = document.createElement('textarea');
   value = document.getElementById('postbody_' + clicked_id).innerHTML
   tarea.innerHTML = value.trim()
   tarea.id = "editpostbody_" + clicked_id
   document.getElementById('postbody_' + clicked_id).innerHTML = ""
   document.getElementById('postbody_' + clicked_id).append(tarea)
   document.getElementById('edit-button_' + clicked_id).innerHTML = "Save"
}

function savepost(clicked_id) {
   const body = document.querySelector('#editpostbody_' + clicked_id).value;
   fetch('/posts/' + clicked_id, {
      method: 'POST',
      body: JSON.stringify({
         body: body,
      })
   })
   document.getElementById('edit-button_' + clicked_id).setAttribute('onClick', 'editpost(' + clicked_id + ')')
   document.getElementById('edit-button_' + clicked_id).innerHTML = "Edit"
   document.getElementById("editpostbody_" + clicked_id).remove()
   document.getElementById('postbody_' + clicked_id).append(body)
   console.log(body)
}
