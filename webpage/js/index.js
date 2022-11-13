var idx = Math.floor((new Date().getHours()));
var body = document.getElementsByTagName("body")[0];
body.className = "heaven-" + idx;

document.getElementById("bored-bot").addEventListener("click", getIdea)

function getIdea() {
    fetch("https://www.boredapi.com/api/activity")
        .then(res => res.json())
        .then(data => {
            document.body.classList.add("fun")
            document.getElementById("idea").textContent = data.activity
            document.getElementById("title").textContent = "🦾 HappyBot🦿"
        })
}

fetch("https://dog.ceo/api/breeds/image/random")
  .then(response => response.json())
  .then(data => console.log(data))