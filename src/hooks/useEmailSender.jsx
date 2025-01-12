import { useState } from "react";
import axios from "axios";

const useEmailSender = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendEmail = async ({ recipient, senderName, senderPhone, subject, message, additionalText }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        "https://apibase.onrender.com/email/send_email",
        {
          recipient: recipient,
          sender_name: senderName,
          sender_phone: senderPhone,
          subject: subject,
          message: message,
          additional_text: additionalText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, 
        }
      );
      if (response.status === 200) {
        setSuccess(true);
      } else {
        throw new Error("No se pudo enviar el correo.");
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error, success };
};

export default useEmailSender;