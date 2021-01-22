import json
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from datetime import datetime

from .models import User, Post


def index(request):
    likes = Post.objects.filter(likes__username=request.user)
    posts = Post.objects.order_by("-timestamp")
    p = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = p.get_page(page_number)
    return render(request, "network/index.html", {
        "page_obj" : page_obj,
        "likes" : likes
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def newpost(request):

    #composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data=json.loads(request.body)

    #create newpost
    user = request.user
    body=data.get("body", "")
    post= Post(
        user=user,
        body=body
    )
    post.save()

    return JsonResponse({"message": "Post sent successfully."}, status=201)

def profile(request, user):
    likes = Post.objects.filter(likes__username=request.user)
    following = User.objects.filter(followers__username=request.user)
    posts = Post.objects.filter(user__username=user).order_by("-timestamp")
    p = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = p.get_page(page_number)
    if following.filter(username=user):
        return render(request, "network/profile.html", {
            "page_obj" : page_obj,
            "profilename" : user,
            "followstatus" : "Unfollow"
        })
    else:
        return render(request, "network/profile.html", {
            "page_obj" : page_obj,
            "profilename" : user,
            "followstatus" : "Follow"           
    })

@csrf_exempt
def followuser(request, username):
    following = User.objects.filter(followers__username=request.user)
    user=User.objects.get(username=request.user)
    data = json.loads(request.body)
    followtarget = User.objects.get(username = data["following"])
    if request.user == followtarget:
        return
    if request.method == 'PUT' and not following.filter(username=data["following"]):
        user.following.add(followtarget)
        user.save()
        return HttpResponse(status=204)
    else:
        user.following.remove(followtarget)
        user.save()
        return HttpResponse(status=204)

def following(request):
    following = User.objects.filter(followers__username=request.user)
    posts = Post.objects.filter(user__in=following).order_by("-timestamp")
    p = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = p.get_page(page_number)
    return render(request, "network/following.html", {
        "page_obj" : page_obj,

    })

@csrf_exempt
def editpost(request, id):
    #editing a post must be via POST

    if request.method == "PUT":
        data=json.loads(request.body)
        if data.get("likes", "") == "pluslike":
            user = User.objects.get(username=request.user)
            post=Post.objects.get(id=id)
            post.likes.add(user)
            post.save()
            return JsonResponse(post.serialize())
        elif data.get("likes", "") == "minuslike":
            user = User.objects.get(username=request.user)
            post=Post.objects.get(id=id)
            post.likes.remove(user)
            post.save()
            return JsonResponse(post.serialize())
    elif request.method != "POST":
        returnpost=Post.objects.get(id=id)
        return JsonResponse(returnpost.serialize())


    data=json.loads(request.body)

    #create newpost
    body=data.get("body", "")
    user = str(request.user)
    post = Post.objects.get(id=id)
    user2=str(post.user)
    if user2 == user:
        post.body = body
        post.save()

    return JsonResponse({"message": "Post sent successfully."}, status=201)
