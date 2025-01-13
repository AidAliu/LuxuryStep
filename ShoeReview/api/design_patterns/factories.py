from django.contrib.auth.models import User as DjangoAuthUser
from ..models import (
    Brand,
    Shoe,
    Style,
    Order,
    OrderItem,
    Payment,
    Review,
    Wishlist,
    WishlistItem,
)

class UserFactory:
    @staticmethod
    def create_user(
        username: str,
        password: str,
        email: str = '',
        first_name: str = '',
        last_name: str = '',
        commit: bool = True
    ) -> DjangoAuthUser:
        user = DjangoAuthUser.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        if commit:
            user.save()
        return user

class BrandFactory:
    @staticmethod
    def create_brand(
        name: str,
        description: str,
        website_url: str,
        commit: bool = True
    ) -> Brand:
        brand = Brand(
            name=name,
            description=description,
            website_url=website_url
        )
        if commit:
            brand.save()
        return brand


# file: factories.py

from django.contrib.auth.models import User as DjangoAuthUser
from ..models import (
    Brand,
    Shoe,
    Style,
    Order,
    OrderItem,
    Payment,
    Review,
    Wishlist,
    WishlistItem,
)

class ShoeFactory:
    @staticmethod
    def create_shoe(
        name: str,
        brand: Brand,
        style: Style,
        price: float,
        size: float,
        stock: int,
        description: str,
        image_url=None,
        commit: bool = True
    ) -> Shoe:
        
        shoe = Shoe(
            name=name,
            BrandID=brand,
            StyleID=style,
            price=price,
            size=size,
            stock=stock,
            description=description,
            image_url=image_url
        )
        if commit:
            shoe.save()
        return shoe



class StyleFactory:
    @staticmethod
    def create_style(
        name: str,
        description: str,
        commit: bool = True
    ) -> Style:

        style = Style(
            name=name,
            description=description
        )
        if commit:
            style.save()
        return style


class OrderFactory:
    @staticmethod
    def create_order(
        user: DjangoAuthUser,
        status: str = 'Pending',
        shipping_address: str = '',
        commit: bool = True
    ) -> Order:
        """
        Factory method to create an Order instance.
        """
        order = Order(
            User=user,
            status=status,
            shipping_address=shipping_address
        )
        if commit:
            order.save()
        return order


class OrderItemFactory:
    @staticmethod
    def create_order_item(
        order: Order,
        shoe: Shoe,
        quantity: int,
        price: float = None,
        commit: bool = True
    ) -> OrderItem:
        """
        Factory method to create an OrderItem instance.
        'price' can be provided or derived from the Shoe's price * quantity.
        """
        if price is None:
            price = shoe.price * quantity

        order_item = OrderItem(
            Order=order,
            Shoe=shoe,
            quantity=quantity,
            price=price
        )
        if commit:
            order_item.save()
        return order_item


class PaymentFactory:
    @staticmethod
    def create_payment(
        order: Order,
        user: DjangoAuthUser,
        amount: float,
        payment_method: str,
        commit: bool = True
    ) -> Payment:
        payment = Payment(
            Order=order,
            User=user,
            amount=amount,
            payment_method=payment_method
        )
        if commit:
            payment.save()
        return payment


class ReviewFactory:
    @staticmethod
    def create_review(
        user: DjangoAuthUser,
        shoe: Shoe,
        rating: int,
        comment: str = '',
        commit: bool = True
    ) -> Review:
        review = Review(
            User=user,
            Shoe=shoe,
            rating=rating,
            comment=comment
        )
        if commit:
            review.save()
        return review


class WishlistFactory:
    @staticmethod
    def create_wishlist(
        user: DjangoAuthUser,
        name: str,
        commit: bool = True
    ) -> Wishlist:
        wishlist = Wishlist(
            User=user,
            name=name
        )
        if commit:
            wishlist.save()
        return wishlist


class WishlistItemFactory:
    @staticmethod
    def create_wishlist_item(
        wishlist: Wishlist,
        shoe: Shoe,
        commit: bool = True
    ) -> WishlistItem:
        wishlist_item = WishlistItem(
            Wishlist=wishlist,
            Shoe=shoe
        )
        if commit:
            wishlist_item.save()
        return wishlist_item
