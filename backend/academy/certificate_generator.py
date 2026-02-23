"""
Certificate PDF Generator with Skills Breakdown
Generates 2-page PDF: Front (certificate) + Back (skills)
"""

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from datetime import datetime
import qrcode
from io import BytesIO


class CertificateGenerator:
    """Generate beautiful 2-page certificates with skills breakdown"""
    
    def __init__(self, certificate):
        self.cert = certificate
        self.enrollment = certificate.enrollment
        self.user = self.enrollment.user
        self.course = self.enrollment.course
        self.width, self.height = landscape(A4)
        
    def generate(self, output_path):
        """Generate complete 2-page certificate"""
        c = canvas.Canvas(output_path, pagesize=landscape(A4))
        
        # Page 1: Certificate Front
        self.draw_certificate_front(c)
        c.showPage()
        
        # Page 2: Skills Breakdown
        self.draw_skills_breakdown(c)
        
        c.save()
        return output_path
    
    def draw_certificate_front(self, c):
        """Draw certificate front page"""
        # Border
        c.setStrokeColor(colors.HexColor('#8B5CF6'))
        c.setLineWidth(3)
        c.rect(20*mm, 20*mm, self.width - 40*mm, self.height - 40*mm)
        
        # Title
        c.setFont("Helvetica-Bold", 36)
        c.setFillColor(colors.HexColor('#8B5CF6'))
        c.drawCentredString(self.width/2, self.height - 60*mm, "CERTIFICATE OF ACHIEVEMENT")
        
        # Student Name
        c.setFont("Helvetica-Bold", 28)
        c.setFillColor(colors.HexColor('#7C3AED'))
        student_name = f"{self.user.first_name} {self.user.last_name}".upper()
        c.drawCentredString(self.width/2, self.height - 95*mm, student_name)
        
        # Course Title
        c.setFont("Helvetica-Bold", 20)
        c.setFillColor(colors.HexColor('#D946EF'))
        c.drawCentredString(self.width/2, self.height - 130*mm, self.course.title.upper())
        
        # Certificate Number
        c.setFont("Helvetica", 10)
        c.setFillColor(colors.black)
        c.drawCentredString(self.width/2, self.height - 160*mm, 
                          f"Certificate ID: {self.cert.certificate_number}")
    
    def draw_skills_breakdown(self, c):
        """Draw skills breakdown on back page"""
        # Title
        c.setFont("Helvetica-Bold", 24)
        c.setFillColor(colors.HexColor('#8B5CF6'))
        c.drawCentredString(self.width/2, self.height - 40*mm, "SKILLS MASTERY REPORT")
        
        y_pos = self.height - 70*mm
        
        # Skills data
        skills_data = self.cert.skills_data or {}
        
        for category, skills in skills_data.items():
            c.setFont("Helvetica-Bold", 14)
            c.drawString(40*mm, y_pos, category)
            y_pos -= 10*mm
            
            for skill in skills:
                self.draw_skill_bar(c, skill, y_pos)
                y_pos -= 12*mm
    
    def draw_skill_bar(self, c, skill, y_pos):
        """Draw individual skill progress bar"""
        name = skill.get('name', 'Skill')
        points = skill.get('points', 0)
        
        c.setFont("Helvetica", 11)
        c.drawString(45*mm, y_pos, f"• {name}: {points} pts")


def generate_certificate_pdf(certificate):
    """Main function to generate certificate PDF"""
    generator = CertificateGenerator(certificate)
    filename = f"certificate_{certificate.certificate_number}.pdf"
    output_path = f"/tmp/{filename}"
    generator.generate(output_path)
    return output_path, filename
