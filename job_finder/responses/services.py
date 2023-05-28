from response_messages.serializers import MessageSerializer
from job_finder.tasks import send_user_email
from core.constants import RESPONSE_MESSAGE_SUBJECT
from responses.models import VacancyResponse


class VacancyResponseService:
    serializer_class = MessageSerializer

    _messages_by_status = {
        VacancyResponse.reject: "Sorry but you were rejected to continue discussing the vacancy {vacancy_title}",
        VacancyResponse.invite: "You are invited to further discuss the vacancy {vacancy_title}",
    }

    def __init__(self, vacancy_response: VacancyResponse):
        self.vacancy_response = vacancy_response

    def create_message(self, data: dict):
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        if message.user != self.vacancy_response.user:
            self._send_notification(message.text)
        return message

    def update_status(self, status):
        self.vacancy_response.status = status
        self.vacancy_response.save()
        if text := self._messages_by_status.get(status):
            text = text.format(vacancy_title=self.vacancy_response.vacancy.title)
            self._send_notification(text)

    def set_messages_viewed_status(self, user):
        print(self.vacancy_response.messages.exclude(user=user))
        self.vacancy_response.messages.exclude(user=user).update(is_viewed=True)

    def _send_notification(self, text):
        send_user_email.delay(
            self.vacancy_response.user.email, RESPONSE_MESSAGE_SUBJECT, text
        )
