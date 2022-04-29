from asyncio import constants
from pkg_resources import require
from .models import Session, Text, File
from .serializers import SessionSerializer, TextSerializer, FileSerializer
from .helpers.view_helper import random_session_num
from .helpers.const import MAX_FILE_SIZE
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import status
from django.db import connection
import datetime

from api import serializers
# Create your views here.


class SessionViewSet(APIView):
    def get(self, request):
        session = request.GET.get('session_id', None)
        password = request.GET.get('password', None)

        resp = {'message': False, 'session_id': None, 'password': None}

        if (session != None) and (Session.objects.filter(session_id=session).exists()):
            stored_password = Session.objects.get(session_id=session).password
            if (stored_password == password):
                resp['message'] = True
                resp['session_id'] = session
                resp['password'] = password
                return Response(data=resp, status=status.HTTP_200_OK)

        return Response(data=resp, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        id = random_session_num()
        password = request.data.get('password', '')

        while Session.objects.filter(session_id=id).exists():
            id = random_session_num()

        data = {'session_id': id, 'password': password,
                'created_at': datetime.datetime.now()}

        serializer = SessionSerializer(data=data)

        if serializer.is_valid():
            session = serializer.save()
            session.save()

        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        session = request.GET.get('session_id', None)
        if (session != None) and (Session.objects.filter(session_id=session).exists()):
            Session.objects.filter(session_id=session).delete()

            if Text.objects.filter(session_id=session).exists():
                Text.objects.filter(session_id=session).delete()

            if File.objects.filter(session_id=session).exists():
                File.objects.filter(session_id=session).delete()

            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class TextViewSet(APIView):
    def get(self, request):
        session = request.GET.get('session_id', None)
        password = request.GET.get('password', '')
        if (session != None) and (Session.objects.filter(session_id=session).exists()):
            stored_password = Session.objects.get(session_id=session).password
            if stored_password == password:
                t = Text.objects.filter(session_id=session).first()
                if (t is not None):
                    serializer = TextSerializer(t)
                    return Response(status=status.HTTP_200_OK, data=serializer.data)
                else:
                    data = {'session_id': session, 'content': ''}
                    return Response(status=status.HTTP_200_OK, data=data)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        session = request.data.get('session_id', None)
        if (session != None) and (Session.objects.filter(session_id=session).exists()):
            serializer = TextSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK, data=serializer.data)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        session = request.data.get('session_id', None)
        if (session != None) and (Session.objects.filter(session_id=session).exists()) and\
                (Text.objects.filter(session_id=session).exists()):

            t = Text.objects.filter(session_id=session).get()
            serializer = TextSerializer(instance=t, data=request.data)
            if serializer.is_valid():
                serializer.save()
                print(serializer.data)
                return Response(status=status.HTTP_200_OK, data=serializer.data)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UploadViewSet(APIView):
    def get(self, request):
        session = request.GET.get('session_id', None)
        password = request.GET.get('password', '')
        if (session != None) and (Session.objects.filter(session_id=session).exists()):
            stored_password = Session.objects.get(session_id=session).password
            if (File.objects.filter(session_id=session).exists()) and\
                    (stored_password == password):
                cursor = connection.cursor()
                files = cursor.execute(
                    "select file_name from file where session_id='{}'".format(session))
                data = {'files': [file['file_name'] for file in files]}
                return Response(status=status.HTTP_200_OK, data=data)
        return Response(status=status.HTTP_200_OK)

    def post(self, request):
        content_type = request.headers.get('Content-Type', None)
        session = request.GET.get('session_id', None)
        if (request.FILES != None) and (content_type != None) and (session != None) and\
                (Session.objects.filter(session_id=session).exists()):
            file_obj = request.FILES['file']
            data = {
                'session_id': session,
                'file_name': file_obj.name,
                'content_type': content_type,
                'content': file_obj.read()
            }
            serializers = FileSerializer(data=data)
            if serializers.is_valid():
                serializers.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class DownloadViewSet(APIView):
    def get(self, request):
        session = request.GET.get('session_id', None)
        file_name = request.GET.get('file_name', None)
        password = request.GET.get('password', '')
        if (session != None) and (file_name != None) and\
                (Session.objects.filter(session_id=session).exists()):
            stored_password = Session.objects.get(session_id=session).password

            if (stored_password == password) and\
                    (File.objects.filter(session_id=session, file_name=file_name).exists()):
                f = File.objects.filter(
                    session_id=session, file_name=file_name).get()
                resp = HttpResponse(f.content, content_type=f.content_type)
                resp['Content-Disposition'] = 'attachment; filename="{}"'.format(
                    file_name)
                return resp

        return Response(status=status.HTTP_400_BAD_REQUEST)
