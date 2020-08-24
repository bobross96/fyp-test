from django.contrib import admin

# Register your models here.
from .models import Author,Genre,Book,BookInstance,Language

'''THis is to register models so that it shows up on the admin boilerplate for easy modifications. 
    Creating a class for the different models can further change how it looks on the web page'''

class AuthorAdmin(admin.ModelAdmin):
    list_display = ('last_name','first_name','date_of_birth','date_of_death')


admin.site.register(Author,AuthorAdmin)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title','author')

@admin.register(BookInstance)
class BookInstanceAdmin(admin.ModelAdmin):
    list_filter = ('status','due_back')


#admin.site.register(Book)
#admin.site.register(Genre)
#admin.site.register(BookInstance)
#admin.site.register(Language)