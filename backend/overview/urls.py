from django.urls import path
from . import views

urlpatterns = [
    path("overview/stats", views.overview_stats, name="overview-stats"),
    path("overview/users", views.users_list_create, name="overview-users"),
    path(
        "overview/users/<int:user_id>",
        views.user_delete,
        name="overview-user-delete",
    ),
    path(
        "overview/companies",
        views.companies_list,
        name="overview-companies",
    ),
    path(
        "overview/subscriptions",
        views.subscriptions_list,
        name="overview-subscriptions",
    ),
    path(
        "overview/notifications",
        views.notifications_list,
        name="overview-notifications",
    ),
]
