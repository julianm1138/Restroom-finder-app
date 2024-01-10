const upvoteBtns = document.querySelectorAll('.fa-thumbs-up')

upvoteBtns.forEach(button => {
  button.addEventListener('click', () => {
      // get the Id from the parent <li> element
      const restroomId = button.parentElement.id;
      console.log("Upvoting restroom with _id:", restroomId);

      fetch('/voteUp', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ '_id': restroomId })
      })
      .then(res => {
          if (res.ok) return res.json();
      })
      .then(response => {
          window.location.reload(true);
      })
      .catch(error => console.error(error));
  })
})

   


// const deleteButton = document.querySelector('#delete-button')
// const messageDiv = document.querySelector('#message')

// deleteButton.addEventListener('click', _ => {
//   fetch('/restrooms', {
//     method: 'delete',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ 
//       name: 'Darth Vadar'
//     })
//   })
//     .then(res => {
//       if (res.ok) return res.json()
//     })
//     .then(response => {
//       if (response === 'No restroom to delete') {
//         messageDiv.textContent = 'No Darth Vadar restroom to delete'
//       } else {
//         window.location.reload(true)
//       }
//     })
//     .catch(console.error)
// })