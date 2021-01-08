document.addEventListener('DOMContentLoaded', function() {
   document.getElementById('follow-button').addEventListener('click', () => follow());
});

function follow() {
   var userid = '{{ request.user }}'
   fetch('/users/' + userid, {
      method: 'PUT',
      body : JSON.stringify({
         following : '{{ profilename }}'
         })
   })
   return console.log("hello")

}
