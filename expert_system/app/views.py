from django.shortcuts import render


def index(request):
    return render(request, 'index.html',
                  {'useless': 'value'})


def editor(request):
    return render(request, 'editor.html',
                {'useless': 'value'})


def client(request):
    return render(request, 'client.html',
                {'useless': 'value'})