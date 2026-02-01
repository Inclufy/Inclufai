from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from calendar import monthrange
from datetime import date as dt_date, timedelta
from .models import StatusReport, TrainingMaterial, ReportingItem, Meeting
from .serializers import StatusReportSerializer, TrainingMaterialSerializer , ReportingItemSerializer , MeetingSerializer, MeetingOccurrenceSerializer


class StatusReportViewSet(viewsets.ModelViewSet):
    queryset = StatusReport.objects.all()
    serializer_class = StatusReportSerializer
    
    def list(self, request):
        queryset = self.get_queryset()
        project_id = request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        report = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(report)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None):
        report = get_object_or_404(StatusReport, pk=pk)
        serializer = self.get_serializer(report, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, pk=None):
        report = get_object_or_404(StatusReport, pk=pk)
        serializer = self.get_serializer(report, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        report = get_object_or_404(StatusReport, pk=pk)
        report.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Training Material ViewSet
class TrainingMaterialViewSet(viewsets.ModelViewSet):
    queryset = TrainingMaterial.objects.all()
    serializer_class = TrainingMaterialSerializer

    def list(self, request):
        queryset = self.get_queryset()
        project_id = request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        material = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(material)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        material = get_object_or_404(TrainingMaterial, pk=pk)
        serializer = self.get_serializer(material, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        material = get_object_or_404(TrainingMaterial, pk=pk)
        serializer = self.get_serializer(material, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        material = get_object_or_404(TrainingMaterial, pk=pk)
        material.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# Report ViewSet
class ReportingItemViewSet(viewsets.ModelViewSet):
    queryset = ReportingItem.objects.all()
    serializer_class = ReportingItemSerializer
    parser_classes = [MultiPartParser, FormParser]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        project_id = request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)
        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page or qs, many=True, context={'request': request})
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        item = get_object_or_404(ReportingItem, pk=pk)
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk=None):
        item = get_object_or_404(ReportingItem, pk=pk)
        serializer = self.get_serializer(item, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        item = get_object_or_404(ReportingItem, pk=pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Meeting ViewSet
class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs

    def list(self, request, *args, **kwargs):
        """
        GET /communication/meetings/?project=<id>
        GET /communication/meetings/?project=<id>&month=YYYY-MM&expand=true
        """
        expand = request.query_params.get('expand', 'false').lower() == 'true'
        month = request.query_params.get('month')

        if not expand or not month:
            qs = self.get_queryset()
            ser = self.get_serializer(qs, many=True)
            return Response(ser.data)

        # Expand recurring meetings for requested month
        try:
            year_str, mon_str = month.split('-')
            year, mon = int(year_str), int(mon_str)
        except Exception:
            return Response({"detail": "Invalid month format. Use YYYY-MM."}, status=400)

        first = dt_date(year, mon, 1)
        last_day = monthrange(year, mon)[1]
        last = dt_date(year, mon, last_day)

        def include(d: dt_date) -> bool:
            return first <= d <= last

        occurrences = []
        base_qs = self.get_queryset()

        for m in base_qs:
            base = m.date
            payload = MeetingSerializer(m, context={'request': request}).data

            if m.type == "onetime":
                if include(base):
                    occurrences.append({**payload, "date": base})
                continue

            if m.frequency == "adhoc":
                if include(base):
                    occurrences.append({**payload, "date": base})
                continue

            if m.frequency in ("weekly", "biweekly"):
                step = 7 if m.frequency == "weekly" else 14
                d = base
                while d < first:
                    d += timedelta(days=step)
                while d <= last:
                    occurrences.append({**payload, "date": d})
                    d += timedelta(days=step)

            elif m.frequency == "monthly":
                d = base
                while d < first:
                    y = d.year + (1 if d.month == 12 else 0)
                    mo = 1 if d.month == 12 else d.month + 1
                    mdays = monthrange(y, mo)[1]
                    d = dt_date(y, mo, min(d.day, mdays))

                while d <= last:
                    occurrences.append({**payload, "date": d})
                    y = d.year + (1 if d.month == 12 else 0)
                    mo = 1 if d.month == 12 else d.month + 1
                    mdays = monthrange(y, mo)[1]
                    d = dt_date(y, mo, min(d.day, mdays))

        data = MeetingOccurrenceSerializer(occurrences, many=True).data
        return Response(data)