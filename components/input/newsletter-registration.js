import classes from "./newsletter-registration.module.css";
import { useRef, useContext } from "react";
import NotificationContext from "../../store/notification-context";

function NewsletterRegistration() {
  const emailInputRef = useRef();
  const notificationCtx = useContext(NotificationContext);

  function registrationHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const emailRegExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (!emailRegExp.test(enteredEmail)) {
      alert("invalid email");
      return;
    }

    notificationCtx.showNotification({
      title: "Signing up!",
      message: "Registering for newsletter.",
      status: "pending",
    });

    // fetch user input (state or refs)
    fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email: enteredEmail }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        res.json().then((data) => {
          throw new Error(data.message || "Something went wrong!");
        });
      })
      .then(({ message }) => {
        notificationCtx.showNotification({
          title: "Signing up...",
          message: "Successfully registered for newsletter",
          status: "success",
        });
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something went wrong!",
          status: "error",
        });
      });
  }

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email"
            ref={emailInputRef}
          />
          <button>Register</button>
        </div>
      </form>
    </section>
  );
}

export default NewsletterRegistration;
