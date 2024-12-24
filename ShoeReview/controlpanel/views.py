from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.core.exceptions import PermissionDenied

@method_decorator(login_required, name='dispatch')
class AdminDashboardView(View):
    def get(self, request):
        # Check if the logged-in user is an admin
        if not request.user.is_admin:
            raise PermissionDenied("You are not authorized to access this page.")
        
        # Render the control panel dashboard
        return render(request, 'controlpanel/dashboard.html')
