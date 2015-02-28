from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'expert_system.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', 'app.views.index', name='index'),
    url(r'^editor$', 'app.views.editor', name='editor'),
    url(r'^client$', 'app.views.client', name='client'),
    url(r'^admin/', include(admin.site.urls)),
)
