from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User  # or your custom user model

@csrf_exempt  # CSRF exemption for testing purposes, should be handled properly for production
def register(request):
    if request.method == 'POST':
        # Extract data from the request
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Create a new user (or handle your custom user model)
        user = User.objects.create_user(username=username, email=email, password=password)
        
        # Return a success response
        return JsonResponse({'message': 'User registered successfully!'}, status=201)
    else:
        # Return an error if it's not a POST request
        return JsonResponse({'error': 'Method Not Allowed'}, status=405)
