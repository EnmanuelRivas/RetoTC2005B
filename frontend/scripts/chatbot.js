const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const userMessage = userInput.value;
  if (!userMessage) return;

  displayMessage(userMessage, "user");
  userInput.value = "";

  try {
    const aiResponse = await getChatCompletion(userMessage);
    displayMessage(aiResponse, "ai");
  } catch (error) {
    console.error("Error:", error);
    displayMessage("Sorry, I encountered an error.", "ai");
  }
}

function displayMessage(message, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(`${sender}-message`); // ``
  messageDiv.textContent = message;
  chatHistory.appendChild(messageDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom
}

async function getChatCompletion(message) {
  //  *** IMPORTANT:  This is client-side JavaScript.  Do NOT put your API key directly here! ***
  //  I'll show you how to proxy this securely in the next step.
  const API_ENDPOINT = "http://10.14.255.61/v1/chat/completions"; //  Your API endpoint
  const API_KEY = "sk-mDmOn2bG9Z3GDNW-x8wdeQ"; //  Replace with your actual API key

  const requestBody = {
    model: "gpt-3.5-turbo", //  Or the model you want to use
    messages: [{ role: "user", content: message }],
  };


  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  //  Adjust this based on the exact structure of your API's response
  return data.choices[0].message.content;
}
