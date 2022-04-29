from .models import Session, Text, File
from .helpers.const import SESSION_ID_LENGTH, MAX_PSW_LENGTH, MAX_TEXT_LENGTH, MAX_FILE_NAME_LENGTH
from rest_framework import serializers


class SessionSerializer(serializers.Serializer):
    session_id = serializers.CharField(max_length=SESSION_ID_LENGTH)
    password = serializers.CharField(
        allow_blank=True, max_length=MAX_PSW_LENGTH)
    created_at = serializers.DateTimeField()

    def create(self, validated_data):
        return Session.objects.create(**validated_data)


class TextSerializer(serializers.Serializer):
    session_id = serializers.CharField(max_length=SESSION_ID_LENGTH)
    content = serializers.CharField(max_length=MAX_TEXT_LENGTH)

    def create(self, validated_data):
        return Text.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance


class BinaryField(serializers.Field):
    def to_representation(self, value):
        return value

    def to_internal_value(self, value):
        return value


class FileSerializer(serializers.Serializer):
    session_id = serializers.CharField(max_length=SESSION_ID_LENGTH)
    file_name = serializers.CharField(max_length=MAX_FILE_NAME_LENGTH)
    content_type = serializers.CharField(max_length=MAX_FILE_NAME_LENGTH)
    content = BinaryField()

    def create(self, validated_data):
        return File.objects.create(**validated_data)
