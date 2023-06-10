from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from companies.views import CompanyViewSet, CompanyManagerViewSet
from favorites.views import FavoriteVacanciesViewSet, FavoriteResumesViewSet
from responses.views import VacancyResponseViewSet
from . import settings
from resumes.views import ResumeViewSet
from users.views import UserViewSet, CustomTokenObtainPairView, GoogleLoginView
from vacancies.views import VacancyViewSet

router = SimpleRouter()
router.register("users", UserViewSet)
router.register("resumes", ResumeViewSet)
router.register("vacancies", VacancyViewSet)
router.register("companies", CompanyViewSet)
router.register("responses", VacancyResponseViewSet)
router.register("managers", CompanyManagerViewSet)
router.register("favorite_vacancies", FavoriteVacanciesViewSet)
router.register("favorite_resumes", FavoriteResumesViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh-token/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token-verify/", TokenVerifyView.as_view(), name="token-verify"),
    path("login/google/", GoogleLoginView.as_view(), name="login-with-google"),
    path("api/", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += [path("__debug__/", include("debug_toolbar.urls"))]
