from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models_requests import DemoRequest, QuoteRequest, InvoiceRequest


class RequestPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


# ============================================
# DEMO REQUESTS
# ============================================

class DemoRequestListView(generics.ListAPIView):
    """List all demo requests (admin only)"""
    permission_classes = [IsAuthenticated]
    pagination_class = RequestPagination
    
    def get_queryset(self):
        if not self.request.user.is_staff:
            return DemoRequest.objects.none()
        
        queryset = DemoRequest.objects.all()
        
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(company_name__icontains=search) |
                Q(contact_name__icontains=search) |
                Q(contact_email__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        
        data = []
        for demo in page:
            data.append({
                'id': demo.id,
                'company_name': demo.company_name,
                'contact_name': demo.contact_name,
                'contact_email': demo.contact_email,
                'contact_phone': demo.contact_phone,
                'preferred_date': demo.preferred_date.isoformat() if demo.preferred_date else None,
                'preferred_time': demo.preferred_time.isoformat() if demo.preferred_time else None,
                'num_participants': demo.num_participants,
                'message': demo.message,
                'status': demo.status,
                'notes': demo.notes,
                'created_at': demo.created_at.isoformat(),
                'updated_at': demo.updated_at.isoformat(),
            })
        
        return self.get_paginated_response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_demo_request(request, pk):
    """Get single demo request"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        demo = DemoRequest.objects.get(pk=pk)
        return Response({
            'id': demo.id,
            'company_name': demo.company_name,
            'contact_name': demo.contact_name,
            'contact_email': demo.contact_email,
            'contact_phone': demo.contact_phone,
            'preferred_date': demo.preferred_date.isoformat() if demo.preferred_date else None,
            'preferred_time': demo.preferred_time.isoformat() if demo.preferred_time else None,
            'num_participants': demo.num_participants,
            'message': demo.message,
            'status': demo.status,
            'notes': demo.notes,
            'created_at': demo.created_at.isoformat(),
            'updated_at': demo.updated_at.isoformat(),
        })
    except DemoRequest.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_demo_request(request, pk):
    """Update demo request status/notes"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        demo = DemoRequest.objects.get(pk=pk)
        
        if 'status' in request.data:
            demo.status = request.data['status']
        if 'notes' in request.data:
            demo.notes = request.data['notes']
        
        demo.save()
        
        return Response({
            'success': True,
            'message': 'Demo request updated',
            'data': {
                'id': demo.id,
                'status': demo.status,
                'notes': demo.notes,
            }
        })
    except DemoRequest.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


# ============================================
# QUOTE REQUESTS
# ============================================

class QuoteRequestListView(generics.ListAPIView):
    """List all quote requests (admin only)"""
    permission_classes = [IsAuthenticated]
    pagination_class = RequestPagination
    
    def get_queryset(self):
        if not self.request.user.is_staff:
            return QuoteRequest.objects.none()
        
        queryset = QuoteRequest.objects.all()
        
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(company_name__icontains=search) |
                Q(contact_name__icontains=search) |
                Q(contact_email__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        
        data = []
        for quote in page:
            data.append({
                'id': quote.id,
                'company_name': quote.company_name,
                'contact_name': quote.contact_name,
                'contact_email': quote.contact_email,
                'contact_phone': quote.contact_phone,
                'num_users': quote.num_users,
                'requirements': quote.requirements,
                'status': quote.status,
                'notes': quote.notes,
                'created_at': quote.created_at.isoformat(),
                'updated_at': quote.updated_at.isoformat(),
            })
        
        return self.get_paginated_response(data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_quote_request(request, pk):
    """Update quote request"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        quote = QuoteRequest.objects.get(pk=pk)
        
        if 'status' in request.data:
            quote.status = request.data['status']
        if 'notes' in request.data:
            quote.notes = request.data['notes']
        
        quote.save()
        
        return Response({'success': True, 'message': 'Quote request updated'})
    except QuoteRequest.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


# ============================================
# INVOICE REQUESTS
# ============================================

class InvoiceRequestListView(generics.ListAPIView):
    """List all invoice requests (admin only)"""
    permission_classes = [IsAuthenticated]
    pagination_class = RequestPagination
    
    def get_queryset(self):
        if not self.request.user.is_staff:
            return InvoiceRequest.objects.none()
        
        queryset = InvoiceRequest.objects.select_related('plan').all()
        
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(company_name__icontains=search) |
                Q(contact_name__icontains=search) |
                Q(contact_email__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        
        data = []
        for invoice in page:
            data.append({
                'id': invoice.id,
                'company_name': invoice.company_name,
                'company_vat': invoice.company_vat,
                'contact_name': invoice.contact_name,
                'contact_email': invoice.contact_email,
                'contact_phone': invoice.contact_phone,
                'plan': {
                    'id': invoice.plan.id,
                    'name': invoice.plan.name,
                    'price': float(invoice.plan.price),
                } if invoice.plan else None,
                'billing_period': invoice.billing_period,
                'notes': invoice.notes,
                'status': invoice.status,
                'admin_notes': invoice.admin_notes,
                'created_at': invoice.created_at.isoformat(),
                'updated_at': invoice.updated_at.isoformat(),
            })
        
        return self.get_paginated_response(data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_invoice_request(request, pk):
    """Update invoice request"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        invoice = InvoiceRequest.objects.get(pk=pk)
        
        if 'status' in request.data:
            invoice.status = request.data['status']
        if 'admin_notes' in request.data:
            invoice.admin_notes = request.data['admin_notes']
        
        invoice.save()
        
        return Response({'success': True, 'message': 'Invoice request updated'})
    except InvoiceRequest.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


# ============================================
# DASHBOARD STATS
# ============================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_request_stats(request):
    """Get statistics for all requests"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    return Response({
        'demos': {
            'total': DemoRequest.objects.count(),
            'pending': DemoRequest.objects.filter(status='pending').count(),
            'scheduled': DemoRequest.objects.filter(status='scheduled').count(),
            'completed': DemoRequest.objects.filter(status='completed').count(),
        },
        'quotes': {
            'total': QuoteRequest.objects.count(),
            'pending': QuoteRequest.objects.filter(status='pending').count(),
            'reviewing': QuoteRequest.objects.filter(status='reviewing').count(),
            'quote_sent': QuoteRequest.objects.filter(status='quote_sent').count(),
        },
        'invoices': {
            'total': InvoiceRequest.objects.count(),
            'pending': InvoiceRequest.objects.filter(status='pending').count(),
            'approved': InvoiceRequest.objects.filter(status='approved').count(),
            'active': InvoiceRequest.objects.filter(status='active').count(),
        },
    })
