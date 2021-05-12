import ejs from "ejs";

function render(origin: string, message: string) {
  if (!origin) {
    return ejs.render("<!doctype html><body>Origin missing</body></html>");
  }

  return ejs.render(
    `<!doctype html><body><script>
    (function() {
      function recieveMessage(e) {
        if (e.origin !== "<%= origin %>") {
          console.log("Wrong origin");
          return;
        }

        console.log("Sending message");
        window.opener.postMessage(
          '<%- message %>',
          e.origin
        )
      }

      console.log("Initiate handshake");
      window.addEventListener("message", recieveMessage, false)
      window.opener.postMessage("authorizing:github", "<%= origin %>")
    })()
    </script></body></html>`,
    { origin, message }
  );
}

export function renderError(origin: string, message: string) {
  return render(
    origin,
    ejs.render('authorization:github:error:{"message":"<%= message %>"}', { message })
  );
}

export function renderSuccess(origin: string, token: string) {
  return render(
    origin,
    ejs.render('authorization:github:success:{"token":"<%= token %>"}', { token })
  );
}
