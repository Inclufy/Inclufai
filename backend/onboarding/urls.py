from django.urls import path
from .views import (
    AnalyzeCompanyView,
    SuggestSetupView,
    SaveOnboardingView,
    OnboardingStatusView,
)
from .demo_views import (
    demo_industries,
    demo_status,
    demo_seed,
    demo_reset,
    demo_switch,
)

urlpatterns = [
    path('analyze-company/', AnalyzeCompanyView.as_view(), name='onboarding-analyze'),
    path('suggest-setup/', SuggestSetupView.as_view(), name='onboarding-suggest'),
    path('complete/', SaveOnboardingView.as_view(), name='onboarding-complete'),
    path('status/', OnboardingStatusView.as_view(), name='onboarding-status'),

    # Demo environment endpoints
    path('demo/industries/', demo_industries, name='demo-industries'),
    path('demo/status/', demo_status, name='demo-status'),
    path('demo/seed/', demo_seed, name='demo-seed'),
    path('demo/reset/', demo_reset, name='demo-reset'),
    path('demo/switch/', demo_switch, name='demo-switch'),
]
