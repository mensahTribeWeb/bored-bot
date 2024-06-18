document.addEventListener("DOMContentLoaded", function() {
    var idx = Math.floor(new Date().getHours());
    var body = document.getElementsByTagName("body")[0];
    body.className = "heaven-" + idx;

    // Event listener for the bored-bot button
    document.getElementById("bored-bot").addEventListener("click", function() {
        fetchActivity();
    });

    // Function to fetch activity from an alternative API
    function fetchActivity() {
        fetch("https://activity-api.herokuapp.com/api/activity")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update elements with fetched data
                document.body.classList.add("fun");
                document.getElementById("idea").textContent = data.activity || "No activity found";
                document.getElementById("title").textContent = "🦾 HappyBot🦿";
            })
            .catch(error => {
                console.error('Error fetching idea:', error);
            });
    }
});




// var idx = Math.floor(new Date().getHours());
// var body = document.getElementsByTagName("body")[0];
// body.className = "heaven-" + idx;

// // Add event listener to the bored-bot button
// document.getElementById("bored-bot").addEventListener("click", getIdea);

// // Function to fetch an idea from the Bored API and update the page
// function getIdea() {
//     fetch("https://www.boredapi.com/api/activity")
//         .then(res => res.json())
//         .then(data => {
//             // Add 'fun' class to body
//             document.body.classList.add("fun");
//             // Update the idea element with the fetched activity
//             document.getElementById("idea").textContent = data.activity;
//             // Update the title element
//             document.getElementById("title").textContent = "🦾 HappyBot🦿";
//         })
//         .catch(error => {
//             console.error('Error fetching idea:', error);
//         });
// }


// //AWS provided function
// var idx = Math.floor((new Date().getHours()));
// var body = document.getElementsByTagName("body")[0];
// body.className = "heaven-" + idx;

// document.getElementById("bored-bot").addEventListener("click", getIdea)

// function getIdea() {
//     fetch("https://www.boredapi.com/api/activity")
//         .then(res => res.json())
//         .then(data => {
//             document.body.classList.add("fun")
//             document.getElementById("idea").textContent = data.activity
//             document.getElementById("title").textContent = "🦾 HappyBot🦿"
//         })
// }



// ChallengeSection

// C1
// fetch("https://dog.ceo/api/breeds/image/random")
//   .then(response => response.json())
//   .then(data => console.log(data))


// C2
// console.log("The first console log")

// fetch("https://dog.ceo/api/breeds/image/random")
//     .then(response => response.json())
//     .then(data => console.log(data))

// console.log("The second console log")

// for (let i = 0; i < 100; i++) {
//  console.log("inside the for loop")
    
// }

// c3
// fetch("https://dog.ceo/api/breeds/image/random")
// .then(response => response.json())
// .then(data => {
//   console.log(data)
//   document.getElementById("img-container").innerHTML = ` <img src="${data.message}"> `})

// c4
// fetch("https://apis.scrimba.com/bored/api/activity")
// .then(res => res.json())
// .then(data =>
// {  console.log(data)
//   document.getElementById("idea").textContent = data.activity}
//   )
