#!/usr/bin/python
""" holds class transactions"""
import models
from models.base_model import BaseModel, Base
from os import getenv
import sqlalchemy
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class Transaction(BaseModel, Base):
    """Representation of transactions"""
    if models.storage_t == 'db':
        """
        __tablename__ = 'amenities'
        name = Column(String(128), nullable=False)
        """
    else:
        transaction_type = 0
        amount = 0
        d_p_c = 0
        c_p_c = 0
        user_id = 0
        reviewed = 0
        employer_id = 0

    def __init__(self, *args, **kwargs):
        """initializes Amenity"""
        super().__init__(*args, **kwargs)
