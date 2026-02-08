"""
AI-Powered Analytics for Project & Program Management
"""
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, List, Any


class RiskDetector:
    """Detect risks in projects and programs"""
    
    @staticmethod
    def analyze_budget_risk(spent: Decimal, allocated: Decimal, progress: int) -> Dict[str, Any]:
        """
        Analyze budget vs progress to detect overrun risk
        
        Returns:
            risk_level: 'low', 'medium', 'high'
            message: Human readable risk description
            severity: 0-100 score
        """
        if allocated == 0:
            return {
                'risk_level': 'low',
                'message': 'No budget allocated',
                'severity': 0
            }
        
        spend_percentage = float(spent / allocated * 100)
        
        # Risk scoring logic
        if progress == 0:
            if spend_percentage > 10:
                return {
                    'risk_level': 'high',
                    'message': f'{spend_percentage:.1f}% budget spent with 0% progress - immediate action needed',
                    'severity': 90
                }
        
        # Ideal: spend_percentage should match progress percentage
        variance = spend_percentage - progress
        
        if variance > 20:
            return {
                'risk_level': 'high',
                'message': f'Budget {variance:.1f}% ahead of progress - major overrun risk',
                'severity': min(100, int(variance * 3))
            }
        elif variance > 10:
            return {
                'risk_level': 'medium',
                'message': f'Budget {variance:.1f}% ahead of progress - watch closely',
                'severity': min(80, int(variance * 2))
            }
        else:
            return {
                'risk_level': 'low',
                'message': 'Budget tracking on target',
                'severity': max(0, int(variance))
            }
    
    @staticmethod
    def analyze_timeline_risk(start_date, end_date, progress: int) -> Dict[str, Any]:
        """
        Analyze timeline vs progress to detect delay risk
        """
        if not start_date or not end_date:
            return {
                'risk_level': 'low',
                'message': 'No timeline set',
                'severity': 0
            }
        
        today = datetime.now().date()
        
        # Handle both datetime and date objects
        if hasattr(start_date, 'date'):
            start_date = start_date.date()
        if hasattr(end_date, 'date'):
            end_date = end_date.date()
        
        total_days = (end_date - start_date).days
        elapsed_days = (today - start_date).days
        
        if total_days <= 0:
            return {'risk_level': 'low', 'message': 'Invalid timeline', 'severity': 0}
        
        time_percentage = (elapsed_days / total_days * 100)
        
        # Time vs progress variance
        variance = time_percentage - progress
        
        if variance > 25:
            return {
                'risk_level': 'high',
                'message': f'{time_percentage:.0f}% time elapsed but only {progress}% complete - major delay risk',
                'severity': min(100, int(variance * 2))
            }
        elif variance > 15:
            return {
                'risk_level': 'medium',
                'message': f'Progress lagging {variance:.0f}% behind schedule',
                'severity': min(80, int(variance * 1.5))
            }
        else:
            return {
                'risk_level': 'low',
                'message': 'Timeline on track',
                'severity': max(0, int(variance))
            }


class BudgetForecaster:
    """Forecast budget completion and overrun"""
    
    @staticmethod
    def forecast_completion(spent: Decimal, allocated: Decimal, progress: int) -> Dict[str, Any]:
        """
        Forecast final budget based on current burn rate
        """
        if progress == 0 or allocated == 0:
            return {
                'forecasted_total': float(allocated),
                'forecasted_overrun': 0,
                'confidence': 'low'
            }
        
        # Calculate burn rate
        burn_rate = float(spent) / progress  # Cost per percentage point
        forecasted_total = burn_rate * 100
        forecasted_overrun = forecasted_total - float(allocated)
        
        # Confidence based on progress (more progress = more confidence)
        if progress < 20:
            confidence = 'low'
        elif progress < 50:
            confidence = 'medium'
        else:
            confidence = 'high'
        
        return {
            'forecasted_total': round(forecasted_total, 2),
            'forecasted_overrun': round(forecasted_overrun, 2),
            'forecasted_overrun_percentage': round((forecasted_overrun / float(allocated) * 100), 1) if allocated > 0 else 0,
            'confidence': confidence
        }


class ProjectHealthScorer:
    """Calculate overall project health score"""
    
    @staticmethod
    def calculate_health_score(
        budget_risk_severity: int,
        timeline_risk_severity: int,
        progress: int,
        team_size: int
    ) -> Dict[str, Any]:
        """
        Calculate weighted health score (0-100, higher is better)
        """
        # Invert risk severities (high risk = low score)
        budget_score = 100 - budget_risk_severity
        timeline_score = 100 - timeline_risk_severity
        progress_score = progress  # Progress itself is a positive metric
        
        # Team size bonus (projects with teams are healthier)
        team_bonus = min(10, team_size * 2) if team_size > 0 else -10
        
        # Weighted average
        health_score = (
            budget_score * 0.4 +      # Budget: 40% weight
            timeline_score * 0.4 +     # Timeline: 40% weight
            progress_score * 0.2 +     # Progress: 20% weight
            team_bonus
        )
        
        health_score = max(0, min(100, health_score))  # Clamp to 0-100
        
        # Categorize health
        if health_score >= 80:
            status = 'excellent'
            color = 'green'
        elif health_score >= 60:
            status = 'good'
            color = 'blue'
        elif health_score >= 40:
            status = 'at_risk'
            color = 'orange'
        else:
            status = 'critical'
            color = 'red'
        
        return {
            'score': round(health_score, 1),
            'status': status,
            'color': color,
            'components': {
                'budget_health': budget_score,
                'timeline_health': timeline_score,
                'progress': progress_score,
                'team_bonus': team_bonus
            }
        }
