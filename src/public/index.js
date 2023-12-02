//Empalme login tradicional y google

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';

const firebaseConfig = {
apiKey: "AIzaSyBJNkX9GYXk4hJbd4kYzaCw5ppJR0f_vP8",
authDomain: "team-9-back-asp.firebaseapp.com",
projectId: "team-9-back-asp",
storageBucket: "team-9-back-asp.appspot.com",
messagingSenderId: "760161682996",
appId: "1:760161682996:web:2b3d170eb0ec89dd222c61"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const googleLoginButton = document.getElementById("google_login_button");
const regularLoginButton = document.getElementById("login_button");

let authentication = null;
let idToken = null;

// El buttonGoogle escucha el evento del click (evento y funcionalidad)
async function loginWithGoogle() {
  try {
      authentication = await signInWithPopup(auth, provider);

      // Después de que el usuario haya sido autenticado con éxito
      if (authentication) {
          const user = authentication.user;
          console.log("Usuario autenticado:", user);

          // Obtener el idToken del usuario
          const idToken = await user.getIdToken(true);
          console.log("ID Token del usuario:", idToken);
                          
          const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user, idToken }),
          };

          let statusCode;

          fetch('http://localhost:3000/api/registergoogle', requestOptions)
              .then((Response) => {
                console.log("Response:", Response);
                statusCode = Response.status;
                return Response.json();
              })
              .then((data) => {
                  if (statusCode === 200) {
                    alert(data.message);
                    console.log("idToken:", data.idToken);
                    console.log("refreshToken:", data.refreshToken);
                    if (typeof data.message === "string" && data.message.includes("Welcome teacher")) {
                      console.log("Redirigiendo a misClases.html");
                      window.location.href = "../pages/misClases.html";
                    } else if (typeof data.message === "string" && data.message.includes("Welcome student")) {
                      console.log("Redirigiendo a estudiante.htm");
                      window.location.href = "../pages/estudiante.html";
                    }
                  } else if (statusCode === 201) {
                    alert('Usuario creado y autenticado');
                  } else if (statusCode === 400) {
                    alert('No es posible autenticar al usuario');
                  } else if (statusCode === 500) {
                    alert('Autenticación erronea');
                  } else {
                    alert('La solicitud POST falló con el código de error:', statusCode);
                  }
              })
              .catch((error) => {
                  console.log(error);
              });

      } else {
        alert("No se logró autenticar al usuario");
      }
  } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error de autenticación:", errorCode, errorMessage);
  }
};

googleLoginButton.addEventListener("click", function (e) {
  e.preventDefault();
  loginWithGoogle(e);
});

regularLoginButton.addEventListener("click", function (e) {
  e.preventDefault();
  regularLogin(e);
});

function regularLogin() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const data = JSON.stringify({
    email: email,
    password: password,
  });


  let statusCode;

  fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((Response) => {
      console.log("Response:", Response);
      statusCode = Response.status;
      return Response.json();
    })
    .then((data) => {
      console.log("Status Code:", statusCode);
      if (statusCode === 200) {
        alert(data.message);
        console.log("idToken:", data.idToken);
        console.log("refreshToken:", data.refreshToken);
        if (typeof data.message === "string" && data.message.includes("Welcome student")) {
          console.log("Redirigiendo a misClases.html");
          window.location.href = "../pages/misClases.html";
        } else if (typeof data.message === "string" && data.message.includes("Welcome student")) {
          window.location.href = "../pages/estudiante.html";
        }
      } else if (statusCode === 400) {
        if (data.error === "Bad Request") {
          alert("Solicitud incorrecta. Verifica tus datos.");
        } else {
          alert("Contraseña incorrecta");
        }
      } else if (statusCode === 403) {
        if (data.error === "Blocked account. A password reset email has been sent") {
          alert("Cuenta bloqueada. Se ha enviado un correo electrónico para restablecer la contraseña.");
        } else {
          alert("Acceso no autorizado.");
        }
      } else {
        alert("Error desconocido. Inténtalo de nuevo más tarde.");
      }
    })
    .catch((error) => {
      console.error("Error durante la solicitud:", error);
      alert(`Error durante la solicitud: ${error.message}`);
    });
}

//Almacenamiento del Token en el localStorage
localStorage.setItem("idToken", data.idToken);

//Obtener el Token en el localStorage
const idToken = localStorage.getItem("idToken");