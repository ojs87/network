
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
   //change the edit button to a save button that will call savepost when clicked
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
   //fetch the post to be edited and change the body of the post
   const body = document.querySelector('#editpostbody_' + clicked_id).value;
   fetch('/posts/' + clicked_id, {
      method: 'POST',
      body: JSON.stringify({
         body: body
      })
   })
   //change the button back to Edit
   document.getElementById('edit-button_' + clicked_id).setAttribute('onClick', 'editpost(' + clicked_id + ')')
   document.getElementById('edit-button_' + clicked_id).innerHTML = "Edit"
   document.getElementById("editpostbody_" + clicked_id).remove()
   document.getElementById('postbody_' + clicked_id).append(body)
   //console.log(body)
}

function likepost(clicked_id) {
   //change the action of the "like" button to "unlike"
   document.getElementById('like-button_' + clicked_id).setAttribute('onClick', 'unlikepost(' + clicked_id + ')')
   //fetch the post that was clicked and add the user to the posts likes
   fetch('/posts/' + clicked_id, {
      method: 'PUT',
      body: JSON.stringify({
         likes: "pluslike"
      })
   })
   //change the "Likes: " value on the page
      .then(response => response.json())
      .then(post => {
         console.log(post);
         document.getElementById('likescount_' + clicked_id).innerHTML = "Likes: " + (post["likes"])
   })

   //change the "like" button to "unlike"
   document.getElementById('like-button_' + clicked_id).innerHTML="Unlike"
}

function unlikepost(clicked_id) {
   //change action of the the "unlike" button to "like"
   document.getElementById('like-button_' + clicked_id).setAttribute('onClick', 'likepost(' + clicked_id + ')')
   //fetch the post that was clicked and remove the user from the posts likes
   fetch('/posts/' + clicked_id, {
      method: 'PUT',
      body: JSON.stringify({
         likes: "minuslike"
      })
   })
   //change the "Likes: " value on the page
      .then(response => response.json())
      .then(post => {
      console.log(post);
      document.getElementById('likescount_' + clicked_id).innerHTML = "Likes: " + (post["likes"])
   })
   //change the "unlike" button to "like"
   document.getElementById('like-button_' + clicked_id).innerHTML="Like"
}
