document.addEventListener('DOMContentLoaded', function() {
   document.querySelector('form').onsubmit = () => newpost();
});


function newpost() {
   console.log("hello")
   const body = document.querySelector('#newpostbody').value;
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
