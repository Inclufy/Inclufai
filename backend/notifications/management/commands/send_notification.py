from django.core.management.base import BaseCommand
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json


class Command(BaseCommand):
    help = "Send a test notification via WebSocket"

    def add_arguments(self, parser):
        parser.add_argument(
            "--title", type=str, default="Test Notification", help="Notification title"
        )
        parser.add_argument(
            "--message",
            type=str,
            default="This is a test notification",
            help="Notification message",
        )

    def handle(self, *args, **options):
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            "admin_admin_notifications",
            {
                "type": "notification_message",
                "title": options["title"],
                "message": options["message"],
            },
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully sent notification: {options["title"]} - {options["message"]}'
            )
        )
