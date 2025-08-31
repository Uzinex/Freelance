from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client

def send_reset_code_email(to_email: str, code: str):
    subject = "Сброс пароля"
    message = f"Ваш код для сброса пароля: {code}"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [to_email])

def send_reset_code_sms(to_phone: str, code: str):
    if not settings.TWILIO_ACCOUNT_SID:
        print(f"SMS code for {to_phone}: {code} (Twilio не настроен)")
        return
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    message = client.messages.create(
        body=f"Ваш код для сброса пароля: {code}",
        from_=settings.TWILIO_PHONE_NUMBER,
        to=to_phone
    )
    print("SMS отправлено:", message.sid)
