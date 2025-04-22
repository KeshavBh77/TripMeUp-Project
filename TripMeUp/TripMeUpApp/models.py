from django.db import models

class City(models.Model):
    city_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    intro = models.TextField(blank=True)
    description = models.TextField(blank=True)  # New field added
    facts = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Place(models.Model):
    place_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=20)
    address = models.CharField(max_length=200)
    street = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    email = models.EmailField()
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="places")
    rating = models.FloatField(default=0.0)
    description = models.TextField(blank=True)
    

    def __str__(self):
        return self.name

class Amenities(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    charge = models.DecimalField(max_digits=8, decimal_places=2)
    timings = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Accommodation(models.Model):
    place = models.OneToOneField(Place, on_delete=models.CASCADE, primary_key=True)
    type = models.CharField(max_length=100)
    charge = models.DecimalField(max_digits=8, decimal_places=2)
    amenities = models.ManyToManyField(Amenities)

    def __str__(self):
        return f"Accommodation at {self.place.name}"

class Restaurant(models.Model):
    place = models.OneToOneField(Place, on_delete=models.CASCADE, primary_key=True)
    working_hours = models.CharField(max_length=100)

    def __str__(self):
        return f"Restaurant at {self.place.name}"

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    first = models.CharField(max_length=50)
    last = models.CharField(max_length=50)
    contact = models.CharField(max_length=15)
    address = models.CharField(max_length=200)
    street = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    email = models.EmailField()
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    def __str__(self):
        return f"{self.first} {self.last}"

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    username = models.CharField(max_length=50)

class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    tier = models.CharField(max_length=20)

class Cuisine(models.Model):
    cuisine_id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=100)

    def __str__(self):
        return self.type

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    no_of_guests = models.IntegerField()
    starting_date = models.DateField()
    ending_date = models.DateField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)

class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    comment = models.TextField()
    rating = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)

class ClientCuisine(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    cuisine = models.ForeignKey(Cuisine, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('client', 'cuisine')

# Additional many-to-many helper models (if you want more control)
class Browses(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

class Curates(models.Model):
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)

class Writes(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)

class Serves(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    cuisine = models.ForeignKey(Cuisine, on_delete=models.CASCADE)
