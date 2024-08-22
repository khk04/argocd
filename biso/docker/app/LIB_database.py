import os
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base

# Database Configuration
DATABASE_URL = os.environ.get('DATABASE_URL')

# SQLAlchemy
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Define a SQLAlchemy model
class DevUser(Base):
    __tablename__ = "dev_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    nickname = Column(String, index=True)
    admin = Column(Boolean, index=True)
    cpu = Column(Integer, index=True)
    node = Column(Integer, index=True)
    memory = Column(Integer, index=True)

class ReadyJob(Base):
    __tablename__ = "ready_jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_name = Column(String, unique=True, index=True)
    user_name = Column(String, index=True)
    cpu = Column(Integer, index=True)
    node = Column(Integer, index=True)
    memory = Column(Integer, index=True)
    image = Column(String, index=True)
    job_state = Column(String, index=True)
    file_count = Column(Integer, index=True)
    file_name1 = Column(String, index=True)
    file_name2 = Column(String, index=True)
    file_name3 = Column(String, index=True)
    job_control = Column(String, index=True)

# Create the tables in the database
Base.metadata.create_all(bind=engine)


# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
