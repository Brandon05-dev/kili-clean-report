from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID

class ReportCreate(BaseModel):
    description: str
    photo_url: Optional[str] = None
    lat: float
    lng: float
    
    @validator('description')
    def description_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Description cannot be empty')
        return v
    
    @validator('lat')
    def validate_latitude(cls, v):
        if not -90 <= v <= 90:
            raise ValueError('Latitude must be between -90 and 90')
        return v
    
    @validator('lng')
    def validate_longitude(cls, v):
        if not -180 <= v <= 180:
            raise ValueError('Longitude must be between -180 and 180')
        return v

class ReportResponse(BaseModel):
    id: UUID
    description: str
    photo_url: Optional[str]
    lat: float
    lng: float
    status: Literal["Pending", "In Progress", "Resolved"]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReportStatusUpdate(BaseModel):
    status: Literal["Pending", "In Progress", "Resolved"]

class AdminCreate(BaseModel):
    email: EmailStr
    phone: str
    password: str
    is_super_admin: bool = False
    
    @validator('phone')
    def validate_phone(cls, v):
        # Basic phone validation - you might want to use a more robust solution
        if not v.startswith('+'):
            raise ValueError('Phone number must start with country code (+)')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id: UUID
    email: str
    phone: str
    is_super_admin: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class InviteAdmin(BaseModel):
    email: EmailStr
    phone: str
    is_super_admin: bool = False

class VerifyOTP(BaseModel):
    email: EmailStr
    otp_code: str

class DailySummary(BaseModel):
    date: str
    total_reports: int
    resolved_reports: int
    pending_reports: int
    in_progress_reports: int
    summary_text: str
    top_locations: list
    
class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    version: str
    database: str
