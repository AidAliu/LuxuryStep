# file: review_view.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from ..models import Review, Shoe
from ..serializers import ReviewSerializer
from ..design_patterns.singleton_services import ReviewManagerSingleton

class ReviewListCreateView(APIView):
    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        shoe_id = request.data.get('Shoe')

        if Review.objects.filter(User=user, Shoe_id=shoe_id).exists():
            return Response({"error": "You have already reviewed this shoe."}, status=status.HTTP_400_BAD_REQUEST)

        rating = int(request.data.get('rating', 0))
        comment = request.data.get('comment', '')

        shoe = get_object_or_404(Shoe, ShoeID=shoe_id)

        manager = ReviewManagerSingleton()
        try:
            new_review = manager.create_review(
                user=user,
                shoe=shoe,
                rating=rating,
                comment=comment
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ReviewSerializer(new_review, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReviewDetailView(APIView):
    def get(self, request, pk):
        manager = ReviewManagerSingleton()
        review = manager.get_review_by_id(pk)
        if not review:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        manager = ReviewManagerSingleton()
        updated_review = manager.update_review(pk, request.data)
        if not updated_review:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReviewSerializer(updated_review, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        manager = ReviewManagerSingleton()
        success = manager.delete_review(pk)
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)


class ShoeReviewsView(APIView):
    def get(self, request, shoe_id):
        from ..models import Review
        reviews = Review.objects.filter(Shoe__ShoeID=shoe_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
