from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import SubscriptionPlan


@api_view(['POST'])
@permission_classes([AllowAny])
def request_invoice(request):
    """Request for invoice-based subscription"""
    try:
        plan_id = request.data.get('plan_id')
        billing_period = request.data.get('billing_period', 'monthly')
        company_name = request.data.get('company_name')
        company_vat = request.data.get('company_vat')
        contact_name = request.data.get('contact_name')
        contact_email = request.data.get('contact_email')
        contact_phone = request.data.get('contact_phone')
        notes = request.data.get('notes', '')
        
        if not all([plan_id, company_name, contact_name, contact_email]):
            return Response(
                {'error': 'Vul alle verplichte velden in'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
        
        subject = f'Nieuwe factuur aanvraag - {company_name}'
        message = f"""
Nieuwe factuur aanvraag

Bedrijf: {company_name}
BTW: {company_vat or 'N/A'}
Contact: {contact_name} ({contact_email})
Telefoon: {contact_phone or 'N/A'}
Plan: {plan.name} ({billing_period})
Prijs: €{plan.price}
Opmerkingen: {notes or 'Geen'}
"""
        
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, ['info@projextpal.com'], fail_silently=True)
        
        return Response({
            'success': True,
            'message': 'Aanvraag ontvangen. We nemen binnen 1-2 werkdagen contact op.'
        })
        
    except SubscriptionPlan.DoesNotExist:
        return Response({'error': 'Plan niet gevonden'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def request_quote(request):
    """Request for custom quote"""
    try:
        company_name = request.data.get('company_name')
        contact_name = request.data.get('contact_name')
        contact_email = request.data.get('contact_email')
        contact_phone = request.data.get('contact_phone')
        num_users = request.data.get('num_users')
        requirements = request.data.get('requirements', '')
        
        if not all([company_name, contact_name, contact_email]):
            return Response(
                {'error': 'Vul alle verplichte velden in'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        subject = f'Nieuwe offerte aanvraag - {company_name}'
        message = f"""
Nieuwe offerte aanvraag

Bedrijf: {company_name}
Contact: {contact_name} ({contact_email})
Telefoon: {contact_phone or 'N/A'}
Gebruikers: {num_users or 'N/A'}
Wensen: {requirements or 'Geen'}
"""
        
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, ['info@projextpal.com'], fail_silently=True)
        
        return Response({
            'success': True,
            'message': 'Offerte aanvraag ontvangen. We nemen binnen 1-2 werkdagen contact op.'
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def request_demo(request):
    """Request for product demo"""
    try:
        company_name = request.data.get('company_name')
        contact_name = request.data.get('contact_name')
        contact_email = request.data.get('contact_email')
        contact_phone = request.data.get('contact_phone')
        preferred_date = request.data.get('preferred_date')
        preferred_time = request.data.get('preferred_time')
        num_participants = request.data.get('num_participants', 1)
        message_text = request.data.get('message', '')
        
        if not all([company_name, contact_name, contact_email]):
            return Response(
                {'error': 'Vul alle verplichte velden in'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        subject = f'Nieuwe demo aanvraag - {company_name}'
        message = f"""
Nieuwe demo aanvraag

Bedrijf: {company_name}
Contact: {contact_name} ({contact_email})
Telefoon: {contact_phone or 'N/A'}
Datum: {preferred_date or 'Flexibel'}
Tijd: {preferred_time or 'Flexibel'}
Deelnemers: {num_participants}
Bericht: {message_text or 'Geen'}
"""
        
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, ['info@projextpal.com'], fail_silently=True)
        
        return Response({
            'success': True,
            'message': 'Demo aanvraag ontvangen. We nemen binnen 1 werkdag contact op.'
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
