from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from companies.views import CompanyViewSet
from . import settings
from resumes.views import ResumeViewSet
from users.views import UserViewSet, CustomTokenObtainPairView
from vacancies.views import VacancyViewSet

router = SimpleRouter()
router.register("users", UserViewSet)
router.register("resumes", ResumeViewSet)
router.register("vacancies", VacancyViewSet)
router.register("companies", CompanyViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh-token/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token-verify/", TokenVerifyView.as_view(), name="token-verify"),
    path("api/", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += [path("__debug__/", include("debug_toolbar.urls"))]
