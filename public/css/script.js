// function loginUser() {
//   alert('Opening Login Page...')
// }

function scrollCourses() {
  document.getElementById('courses').scrollIntoView({
    behavior: 'smooth'
  })
}

function watchDemo() {
  alert('Demo Video Coming Soon')
}

// function buyCourse(courseName) {
//   alert(`Opening ${courseName} Payment Page`)
// }

function uploadScreenshot() {
  alert('Upload Screenshot Feature Connected')
}


// Course Details
function copyUPI() {

  const upi = document.getElementById('upiText').innerText

  navigator.clipboard.writeText(upi)

  // alert('UPI ID Copied Successfully')
}