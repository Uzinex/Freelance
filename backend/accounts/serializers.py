from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import PasswordResetCode, CustomUser
import random
from notifications.messaging import send_reset_code_email, send_reset_code_sms

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password"]

    def create(self, validated_data):
        user = User(username=validated_data["username"])
        user.set_password(validated_data["password"])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()  # может быть username, email или phone
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        identifier = data.get("identifier")
        password = data.get("password")

        user = None
        # пробуем по username
        user = authenticate(username=identifier, password=password)

        # пробуем по email
        if not user:
            try:
                user_obj = CustomUser.objects.get(email=identifier)
                user = authenticate(username=user_obj.username, password=password)
            except CustomUser.DoesNotExist:
                pass

        # пробуем по телефону
        if not user:
            try:
                user_obj = CustomUser.objects.get(phone=identifier)
                user = authenticate(username=user_obj.username, password=password)
            except CustomUser.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError("Неверные учетные данные")

        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user_id": user.id,
            "username": user.username,
        }
    
class PasswordResetRequestSerializer(serializers.Serializer):
    identifier = serializers.CharField()

    def validate(self, data):
        identifier = data["identifier"]
        user = None

        try:
            user = User.objects.get(email=identifier)
            data["method"] = "email"
        except User.DoesNotExist:
            try:
                user = User.objects.get(phone=identifier)
                data["method"] = "sms"
            except User.DoesNotExist:
                raise serializers.ValidationError("Пользователь не найден")
        data["user"] = user
        return data

    def create(self, validated_data):
        user = validated_data["user"]
        method = validated_data["method"]

        code = str(random.randint(100000, 999999))
        PasswordResetCode.objects.create(user=user, code=code)

        if method == "email":
            send_reset_code_email(user.email, code)
        else:
            send_reset_code_sms(user.phone, code)

        return {"detail": "Код отправлен"}
    
class PasswordResetConfirmSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    code = serializers.CharField()
    new_password = serializers.CharField()

    def validate(self, data):
        identifier = data["identifier"]
        code = data["code"]

        try:
            user = User.objects.get(email=identifier)
        except User.DoesNotExist:
            try:
                user = User.objects.get(phone=identifier)
            except User.DoesNotExist:
                raise serializers.ValidationError("Пользователь не найден")

        try:
            reset_code = PasswordResetCode.objects.filter(user=user, code=code).latest("created_at")
        except PasswordResetCode.DoesNotExist:
            raise serializers.ValidationError("Неверный код")

        if not reset_code.is_valid():
            raise serializers.ValidationError("Код недействителен или просрочен")

        data["user"] = user
        data["reset_code"] = reset_code
        return data

    def create(self, validated_data):
        user = validated_data["user"]
        reset_code = validated_data["reset_code"]

        user.set_password(validated_data["new_password"])
        user.save()

        reset_code.is_used = True
        reset_code.save()

        return {"detail": "Пароль успешно изменён"}
