import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

User = get_user_model()


class AdminNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "admin_notifications"
        self.room_group_name = f"admin_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json.get("message", "")
            title = text_data_json.get("title", "Notification")

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "notification_message", "title": title, "message": message},
            )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"error": "Invalid JSON format"}))

    # Receive message from room group
    async def notification_message(self, event):
        title = event["title"]
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"title": title, "message": message}))
