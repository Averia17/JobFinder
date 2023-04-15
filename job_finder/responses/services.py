from response_messages.serializers import MessageSerializer
from job_finder.tasks import send_user_email
from core.constants import RESPONSE_MESSAGE_SUBJECT


class ResponseMessagesService:
    serializer_class = MessageSerializer

    def __init__(self, vacancy_response):
        self.vacancy_response = vacancy_response

    def create_message(self, data: dict):
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        if message.user != self.vacancy_response.user:
            self._send_notification(message.text)
        return message

    def _send_notification(self, text):
        send_user_email.delay(
            self.vacancy_response.user.email, RESPONSE_MESSAGE_SUBJECT, text
        )
