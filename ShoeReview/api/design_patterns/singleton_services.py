from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User as DjangoAuthUser

from ..models import (
    Brand,
    Order,
    OrderItem,
    Shoe,
    Style,
    Payment,
    Wishlist,
    WishlistItem,
    Review
)
from .factories import (
    BrandFactory,
    StyleFactory,
    OrderFactory,
    OrderItemFactory,
    ShoeFactory,
    PaymentFactory,
    WishlistFactory,
    WishlistItemFactory,
    ReviewFactory
)

class ReviewManagerSingleton:
    _instance = None
    _review_cache = {} 

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def create_review(self, user: DjangoAuthUser, shoe: Shoe, rating: int, comment: str = ''):
        review = ReviewFactory.create_review(
            user=user,
            shoe=shoe,
            rating=rating,
            comment=comment,
            commit=True
        )
        self._review_cache[review.ReviewID] = review
        return review

    def get_review_by_id(self, review_id: int):
        if review_id in self._review_cache:
            return self._review_cache[review_id]
        try:
            rev = Review.objects.get(pk=review_id)
            self._review_cache[review_id] = rev
            return rev
        except Review.DoesNotExist:
            return None

    def update_review(self, review_id: int, data: dict):
        review = self.get_review_by_id(review_id)
        if not review:
            return None
        review.rating = data.get('rating', review.rating)
        review.comment = data.get('comment', review.comment)
        review.save()
        self._review_cache[review_id] = review
        return review

    def delete_review(self, review_id: int):
        review = self.get_review_by_id(review_id)
        if review:
            review.delete()
            if review_id in self._review_cache:
                del self._review_cache[review_id]
            return True
        return False

class WishlistManagerSingleton:
    _instance = None
    _wishlist_cache = {} 

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def create_wishlist(self, user: DjangoAuthUser, name: str):
        wishlist = WishlistFactory.create_wishlist(user, name, commit=True)
        self._wishlist_cache[wishlist.WishlistID] = wishlist
        return wishlist

    def get_wishlist_by_id(self, wishlist_id):
        if wishlist_id in self._wishlist_cache:
            return self._wishlist_cache[wishlist_id]
        try:
            wishlist = Wishlist.objects.get(pk=wishlist_id)
            self._wishlist_cache[wishlist_id] = wishlist
            return wishlist
        except Wishlist.DoesNotExist:
            return None

    def update_wishlist(self, wishlist_id, data):
        wishlist = self.get_wishlist_by_id(wishlist_id)
        if not wishlist:
            return None
        wishlist.name = data.get('name', wishlist.name)
        wishlist.save()
        self._wishlist_cache[wishlist_id] = wishlist
        return wishlist

    def delete_wishlist(self, wishlist_id):
        wishlist = self.get_wishlist_by_id(wishlist_id)
        if wishlist:
            wishlist.delete()
            if wishlist_id in self._wishlist_cache:
                del self._wishlist_cache[wishlist_id]
            return True
        return False


class WishlistItemManagerSingleton:
    _instance = None
    _wishlist_item_cache = {}  

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def create_wishlist_item(self, wishlist: Wishlist, shoe: Shoe):
        wishlist_item = WishlistItemFactory.create_wishlist_item(
            wishlist=wishlist,
            shoe=shoe,
            commit=True
        )
        self._wishlist_item_cache[wishlist_item.pk] = wishlist_item
        return wishlist_item

    def get_wishlist_item_by_id(self, wishlist_item_id):
        if wishlist_item_id in self._wishlist_item_cache:
            return self._wishlist_item_cache[wishlist_item_id]
        try:
            item = WishlistItem.objects.get(pk=wishlist_item_id)
            self._wishlist_item_cache[wishlist_item_id] = item
            return item
        except WishlistItem.DoesNotExist:
            return None

    def update_wishlist_item(self, wishlist_item_id, data):
        item = self.get_wishlist_item_by_id(wishlist_item_id)
        if not item:
            return None

        if 'Shoe' in data:
            from ..models import Shoe
            shoe_id = data['Shoe']
            shoe = Shoe.objects.get(pk=shoe_id)
            item.Shoe = shoe
        item.save()
        self._wishlist_item_cache[wishlist_item_id] = item
        return item

    def delete_wishlist_item(self, wishlist_item_id):
        item = self.get_wishlist_item_by_id(wishlist_item_id)
        if item:
            item.delete()
            if wishlist_item_id in self._wishlist_item_cache:
                del self._wishlist_item_cache[wishlist_item_id]
            return True
        return False


class PaymentManagerSingleton:
    _instance = None
    _payment_cache = {}  

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def create_payment(self, order: Order, user: DjangoAuthUser, amount: float, payment_method: str):
        payment = PaymentFactory.create_payment(
            order=order,
            user=user,
            amount=amount,
            payment_method=payment_method,
            commit=True
        )
        self._payment_cache[payment.PaymentID] = payment
        return payment

    def get_payment_by_id(self, payment_id):
        if payment_id in self._payment_cache:
            return self._payment_cache[payment_id]
        try:
            payment = Payment.objects.get(pk=payment_id)
            self._payment_cache[payment_id] = payment
            return payment
        except Payment.DoesNotExist:
            return None

    def update_payment(self, payment_id, data):
        payment = self.get_payment_by_id(payment_id)
        if not payment:
            return None
        payment.amount = data.get('amount', payment.amount)
        payment.payment_method = data.get('payment_method', payment.payment_method)
        payment.save()
        self._payment_cache[payment_id] = payment
        return payment

    def delete_payment(self, payment_id):
        payment = self.get_payment_by_id(payment_id)
        if payment:
            payment.delete()
            if payment_id in self._payment_cache:
                del self._payment_cache[payment_id]
            return True
        return False

class StyleManagerSingleton:
    _instance = None
    _style_cache = {}  

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def create_style(self, name, description):
        new_style = StyleFactory.create_style(name=name, description=description, commit=True)
        self._style_cache[new_style.StyleID] = new_style
        return new_style

    def get_style_by_id(self, style_id):
        if style_id in self._style_cache:
            return self._style_cache[style_id]
        try:
            style = Style.objects.get(pk=style_id)
            self._style_cache[style_id] = style
            return style
        except Style.DoesNotExist:
            return None

    def update_style(self, style_id, data):
        style = self.get_style_by_id(style_id)
        if not style:
            return None
        style.name = data.get('name', style.name)
        style.description = data.get('description', style.description)
        style.save()
        self._style_cache[style_id] = style
        return style

    def delete_style(self, style_id):
        style = self.get_style_by_id(style_id)
        if style:
            style.delete()
            if style_id in self._style_cache:
                del self._style_cache[style_id]
            return True
        return False


class ShoeManagerSingleton:
    _instance = None
    _shoe_cache = {}  

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def create_shoe(self, name, brand, style, price, size, stock, description, image_url=None):
        new_shoe = ShoeFactory.create_shoe(
            name=name,
            brand=brand,
            style=style,
            price=price,
            size=size,
            stock=stock,
            description=description,
            image_url=image_url,
            commit=True
        )
        self._shoe_cache[new_shoe.ShoeID] = new_shoe
        return new_shoe

    def get_shoe_by_id(self, shoe_id):
        if shoe_id in self._shoe_cache:
            return self._shoe_cache[shoe_id]
        try:
            shoe = Shoe.objects.get(pk=shoe_id)
            self._shoe_cache[shoe_id] = shoe
            return shoe
        except Shoe.DoesNotExist:
            return None

    def update_shoe(self, shoe_id, data):
        shoe = self.get_shoe_by_id(shoe_id)
        if not shoe:
            return None
        shoe.name = data.get('name', shoe.name)
        shoe.price = data.get('price', shoe.price)
        shoe.size = data.get('size', shoe.size)
        shoe.stock = data.get('stock', shoe.stock)
        shoe.description = data.get('description', shoe.description)
        shoe.save()
        self._shoe_cache[shoe_id] = shoe
        return shoe

    def delete_shoe(self, shoe_id):
        shoe = self.get_shoe_by_id(shoe_id)
        if shoe:
            shoe.delete()
            if shoe_id in self._shoe_cache:
                del self._shoe_cache[shoe_id]
            return True
        return False


class BrandManagerSingleton:
    _instance = None
    _brand_cache = {}  

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    
    def create_brand(self, name, description, website_url):
        brand = BrandFactory.create_brand(name, description, website_url, commit=True)
        self._brand_cache[brand.BrandID] = brand
        return brand

    def get_brand_by_id(self, brand_id):
        if brand_id in self._brand_cache:
            return self._brand_cache[brand_id]

        try:
            brand = Brand.objects.get(pk=brand_id)
            self._brand_cache[brand_id] = brand
            return brand
        except Brand.DoesNotExist:
            return None

    def update_brand(self, brand_id, data):
        brand = self.get_brand_by_id(brand_id)
        if not brand:
            return None
        brand.name = data.get('name', brand.name)
        brand.description = data.get('description', brand.description)
        brand.website_url = data.get('website_url', brand.website_url)
        brand.save()
        self._brand_cache[brand_id] = brand
        return brand

    def delete_brand(self, brand_id):
        brand = self.get_brand_by_id(brand_id)
        if brand:
            brand.delete()
            if brand_id in self._brand_cache:
                del self._brand_cache[brand_id]
            return True
        return False


class OrderManagerSingleton:
    _instance = None
    _order_cache = {}  

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def create_order(self, user: DjangoAuthUser, status='Pending', shipping_address=''):
        order = OrderFactory.create_order(
            user=user,
            status=status,
            shipping_address=shipping_address,
            commit=True
        )
        self._order_cache[order.OrderID] = order
        return order

    def get_order_by_id(self, order_id):
        if order_id in self._order_cache:
            return self._order_cache[order_id]
        try:
            order = Order.objects.get(pk=order_id)
            self._order_cache[order_id] = order
            return order
        except Order.DoesNotExist:
            return None

    def update_order(self, order_id, data):
        order = self.get_order_by_id(order_id)
        if not order:
            return None
        order.status = data.get('status', order.status)
        order.shipping_address = data.get('shipping_address', order.shipping_address)

        order.save()
        self._order_cache[order_id] = order
        return order

    def delete_order(self, order_id):
        order = self.get_order_by_id(order_id)
        if order:
            order.delete()
            if order_id in self._order_cache:
                del self._order_cache[order_id]
            return True
        return False

    def get_or_create_active_order(self, user: DjangoAuthUser) -> Order:
        try:
            order = Order.objects.get(User=user, status='Pending')
            self._order_cache[order.OrderID] = order
            return order
        except ObjectDoesNotExist:
            order = OrderFactory.create_order(user=user, status='Pending')
            self._order_cache[order.OrderID] = order
            return order

    def finalize_order(self, order: Order, shipping_address: str = "") -> Order:
        order.shipping_address = shipping_address
        order.status = "Confirmed"
        order.save()
        self._order_cache[order.OrderID] = order
        return order
    

class OrderItemManagerSingleton:
    _instance = None
    _order_item_cache = {}  

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def create_order_item(self, order: Order, shoe: Shoe, quantity: int, price=None):
        order_item = OrderItemFactory.create_order_item(
            order=order,
            shoe=shoe,
            quantity=quantity,
            price=price,
            commit=True
        )
        self._order_item_cache[order_item.pk] = order_item
        return order_item

    def get_order_item_by_id(self, order_item_id):
        if order_item_id in self._order_item_cache:
            return self._order_item_cache[order_item_id]
        try:
            order_item = OrderItem.objects.get(pk=order_item_id)
            self._order_item_cache[order_item_id] = order_item
            return order_item
        except OrderItem.DoesNotExist:
            return None

    def update_order_item(self, order_item_id, data):
        order_item = self.get_order_item_by_id(order_item_id)
        if not order_item:
            return None
        order_item.quantity = data.get('quantity', order_item.quantity)
        order_item.price = data.get('price', order_item.price)
        order_item.save()
        self._order_item_cache[order_item_id] = order_item
        return order_item

    def delete_order_item(self, order_item_id):
        order_item = self.get_order_item_by_id(order_item_id)
        if order_item:
            order_item.delete()
            if order_item_id in self._order_item_cache:
                del self._order_item_cache[order_item_id]
            return True
        return False