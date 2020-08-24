from django.db import models

# Create your models here.

class Genre(models.Model):
    name = models.CharField(max_length=200, help_text='Enter book genre (e.g. Horror)')

    def __str__(self):
        return self.name

from django.urls import reverse #reverse is required to generate URL by reversing the URL pattern

class Language(models.Model):
    name = models.CharField(max_length=200,help_text="Enter book's original language(e.g English, Japanese, Chinese")

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=200)

    summary = models.TextField(max_length=1000, help_text='Enter brief description of the book')
    isbn = models.CharField('ISBN', max_length=13, help_text='13 Character <a href="https://www.isbn-international.org/content/what-isbn">ISBN number</a>')

    #below are for shared information to link to other table (many to one relationship)
    #first param is the name of the class, in the form of string if its not declared yet
    author = models.ForeignKey('Author', on_delete=models.SET_NULL, null=True)

    #many to many relationship, for genre 
    genre = models.ManyToManyField(Genre, help_text='Select genre for the book')

    #each book can have 
    language = models.ForeignKey(Language,on_delete=models.SET_NULL,null=True)

    def __str__(self):
        return self.title
    #this will sreturn url mapping that has the name book-detail
    def get_absolute_url(self):
        return reverse("book_detail", args=[str(self.id)])

import uuid 

class BookInstance(models.Model):
    #specific instance of a book model from above, has more details
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this book')
    book = models.ForeignKey('Book', on_delete=models.SET_NULL, null=True)
    imprint = models.CharField(max_length=200)
    due_back = models.DateField(null=True,blank=True)

    LOAN_STATUS = (
        ('m', 'Maintenance'),
        ('o', 'On loan'),
        ('a', 'Available'),
        ('r', 'Reserved'),
        
    )

    status = models.CharField(max_length=1,choices=LOAN_STATUS,blank=True,default='m',help_text='Book Availability')

    class Meta:
        ordering = ['due_back']
    
    def __str__(self):
        return f"{self.id}({self.book.title})"
    

class Author(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    date_of_death = models.DateField('died', null=True, blank=True)

    def __str__(self):
        return self.last_name        
