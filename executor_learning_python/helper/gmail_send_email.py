import resend
from resend import Emails

resend.api_key="re_ULPg8SEr_NErH2UHrA6WNJCoNpwYW1ejh"

params = {
  "from": "Acme <onboarding@resend.dev>",
  "to": ["sohampirale20504@gmail.com"],
  "subject": "hello world",
  "html": "<p>it works!</p>"
}

def gmail_send_email(to,html):
    params["to"]=[to]
    params["html"]=html
    print(f"params : {params}")
    response = Emails.send(params)
    print(f"response : {response}")


gmail_send_email("sohampirale20504@gmail.com","1")